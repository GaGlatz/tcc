import { Router } from "express";
import Time from "../models/time.js";
import Scheduling from "../models/scheduling.js";
import Client from "../models/client.js";
import Salon from "../models/salon.js";
import Services from "../models/services.js";
import Collaborator from "../models/collaborator.js";

import moment from "moment";
import mongoose from "mongoose";
import lodash from "lodash";

import pagarme from "../services/pagarme.js";
import { SALON_FEE, RECIPIENT_ID } from "../constants.js";
import {
  toCents,
  hourToMinutes,
  sliceMinutes,
  SLOT_DURATION,
  mergeDateTime,
  splitByValue,
} from "../util.js";

const router = Router();
const { uniq, chunk, omit } = lodash;
const { connection } = mongoose;

const getAgendamentos = async (req, res) => {
  const { range, salaoId } = req.body;

  try {
    const agendamentos = await Scheduling.find({
      status: "A",
      salaoId,
      data: {
        $gte: moment(range.start).startOf("day"),
        $lte: moment(range.end).endOf("day"),
      },
    }).populate([
      { path: "servicoId", select: "titulo duracao" },
      { path: "colaboradorId", select: "nome" },
      { path: "clienteId", select: "nome" },
    ]);

    res.json({ error: false, agendamentos });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const createAgendamento = async (req, res) => {
  const db = connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { clienteId, salaoId, servicoId, colaboradorId } = req.body;

    const cliente = await Client.findById(clienteId).select(
      "nome endereco customerId"
    );
    const salao = await Salon.findById(salaoId).select("recipientId");
    const servico = await Services.findById(servicoId).select(
      "preco titulo comissao"
    );
    const colaborador = await Collaborator.findById(colaboradorId).select(
      "recipientId"
    );

    const precoFinal = toCents(servico.preco) * 100;

    const colaboradoreSplitRule = {
      recipient_id: colaborador.recipientId,
      amount: parseInt(precoFinal * (servico.comissao / 100)),
    };

    const createPayment = await pagarme("/transactions", {
      amount: precoFinal,
      card_number: "4111111111111111",
      card_cvv: "123",
      card_expiration_date: "0922",
      card_holder_name: "Morpheus Fishburne",
      customer: {
        id: cliente.customerId,
      },
      billing: {
        name: cliente.nome,
        address: {
          country: cliente.endereco.pais.toLowerCase(),
          state: cliente.endereco.uf.toLowerCase(),
          city: cliente.endereco.cidade,
          street: cliente.endereco.logradouro,
          street_number: cliente.endereco.numero,
          zipcode: cliente.endereco.cep,
        },
      },
      items: [
        {
          id: servicoId,
          title: servico.titulo,
          unit_price: precoFinal,
          quantity: 1,
          tangible: false,
        },
      ],
      split_rules: [
        {
          recipient_id: salao.recipientId,
          amount: precoFinal - SALON_FEE - colaboradoreSplitRule.amount,
        },
        colaboradoreSplitRule,
        {
          recipient_id: RECIPIENT_ID,
          amount: SALON_FEE,
          charge_processing_fee: false,
        },
      ],
    });

    if (createPayment.error) {
      throw { message: createPayment.message };
    }

    let agendamento = {
      ...req.body,
      transactionId: createPayment.data.id,
      comissao: servico.comissao,
      valor: servico.preco,
    };
    await new Scheduling(agendamento).save();

    await session.commitTransaction();
    session.endSession();
    res.json({ error: false, agendamento: createPayment.data });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
};

const getDiasDisponiveis = async (req, res) => {
  const { data, salaoId, servicoId } = req.body;
  const horarios = await Time.find({ salaoId });
  const servico = await Services.findById(servicoId).select("duracao");
  let colaboradores = [];

  let agenda = [];
  let lastDay = moment(data);

  const servicoDuracao = hourToMinutes(moment(servico.duracao).format("HH:mm"));
  const servicoDuracaoSlots = sliceMinutes(
    moment(servico.duracao),
    moment(servico.duracao).add(servicoDuracao, "minutes"),
    SLOT_DURATION,
    false
  ).length;

  for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
    const espacosValidos = horarios.filter((h) => {
      return (
        h.dias.includes(moment(lastDay).day()) &&
        h.especialidades.includes(servicoId)
      );
    });

    if (espacosValidos.length > 0) {
      let todosHorariosDia = {};
      for (let espaco of espacosValidos) {
        for (let colaborador of espaco.colaboradores) {
          if (!todosHorariosDia[colaborador._id]) {
            todosHorariosDia[colaborador._id] = [];
          }
          todosHorariosDia[colaborador._id] = [
            ...todosHorariosDia[colaborador._id],
            ...sliceMinutes(
              mergeDateTime(lastDay, espaco.inicio),
              mergeDateTime(lastDay, espaco.fim),
              SLOT_DURATION
            ),
          ];
        }
      }

      for (let colaboradorKey of Object.keys(todosHorariosDia)) {
        const agendamentos = await Scheduling.find({
          colaboradorId: colaboradorKey,
          data: {
            $gte: moment(lastDay).startOf("day"),
            $lte: moment(lastDay).endOf("day"),
          },
        }).select("data -_id");

        let horariosOcupado = agendamentos.map((a) => ({
          inicio: moment(a.data),
          fim: moment(a.data).add(servicoDuracao, "minutes"),
        }));

        horariosOcupado = horariosOcupado
          .map((h) => sliceMinutes(h.inicio, h.fim, SLOT_DURATION, false))
          .flat();

        let horariosLivres = splitByValue(
          uniq(
            todosHorariosDia[colaboradorKey].map((h) => {
              return horariosOcupado.includes(h) ? "-" : h;
            })
          ),
          "-"
        );

        horariosLivres = horariosLivres
          .filter((h) => h.length >= servicoDuracaoSlots)
          .flat();

        horariosLivres = horariosLivres.map((slot) =>
          slot.filter(
            (horario, index) => slot.length - index >= servicoDuracaoSlots
          )
        );

        horariosLivres = chunk(horariosLivres, 2);

        if (horariosLivres.length === 0) {
          todosHorariosDia = omit(todosHorariosDia, colaboradorKey);
        } else {
          todosHorariosDia[colaboradorKey] = horariosLivres;
        }
      }

      const totalColaboradores = Object.keys(todosHorariosDia).length;

      if (totalColaboradores > 0) {
        colaboradores.push(Object.keys(todosHorariosDia));
        agenda.push({
          [moment(lastDay).format("YYYY-MM-DD")]: todosHorariosDia,
        });
      }
    }

    lastDay = moment(lastDay).add(1, "day");
  }

  colaboradores = await Collaborator.find({
    _id: { $in: uniq(colaboradores.flat()) },
  }).select("nome foto");

  colaboradores = colaboradores.map((c) => ({
    ...c._doc,
    nome: c.nome.split(" ")[0],
  }));

  res.json({ error: false, colaboradores, agenda });
};

router.post("/filter", getAgendamentos);
router.post("/", createAgendamento);
router.post("/dias-disponiveis", getDiasDisponiveis);

export default router;
