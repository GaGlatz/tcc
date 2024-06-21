import { Router } from "express";
import Mongoose from "mongoose";
import Collaborator from "../models/collaborator.js";
import SalonCollaborator from "../models/relationship/salon-collaborator.js";
import ServiceCollaborator from "../models/relationship/service-collaborator.js";
import moment from "moment";
import pagarme from "../services/pagarme.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const { connection } = Mongoose;

const createColaborador = async (req, res) => {
  const db = connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { colaborador, salaoId } = req.body;
    let newColaborador = null;

    const existentColaborador = await Collaborator.findOne({
      $or: [{ email: colaborador.email }, { telefone: colaborador.telefone }],
    });

    if (!existentColaborador) {
      const pagarmeBankAccount = await createBankAccount(colaborador, session);
      const pargarmeReceiver = await createReceiver(
        pagarmeBankAccount,
        session
      );

      const recipientId = uuidv4();

      newColaborador = await new Collaborator({
        ...colaborador,
        recipientId: recipientId,
      }).save({ session });
    }

    const colaboradorId = existentColaborador
      ? existentColaborador._id
      : newColaborador._id;

    const existentRelationship = await SalonCollaborator.findOne({
      salaoId,
      colaboradorId,
    });

    if (!existentRelationship) {
      await new SalonCollaborator({
        salaoId,
        colaboradorId,
        status: colaborador.vinculo,
      }).save({ session });
    }

    if (existentRelationship && existentRelationship.status === "I") {
      await SalonCollaborator.findOneAndUpdate(
        {
          salaoId,
          colaboradorId,
        },
        { status: "A" },
        { session }
      );
    }

    await ServiceCollaborator.insertMany(
      colaborador.especialidades.map((servicoId) => ({
        servicoId,
        colaboradorId,
      }))
    );

    await session.commitTransaction();
    session.endSession();

    if (existentRelationship && existentColaborador) {
      res.json({ error: true, message: "Colaborador já cadastrado!" });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
};

const createBankAccount = async (colaborador, session) => {
  const { contaBancaria } = colaborador;
  const pagarmeBankAccount = await pagarme("/bank_accounts", {
    bank_code: contaBancaria.banco,
    document_number: contaBancaria.cpfCnpj,
    agencia: contaBancaria.agencia,
    conta: contaBancaria.numero,
    conta_dv: contaBancaria.dv,
    legal_name: contaBancaria.titular,
  });

  if (pagarmeBankAccount.error) {
    throw pagarmeBankAccount;
  }

  return pagarmeBankAccount;
};

const createReceiver = async (pagarmeBankAccount, session) => {
  const pargarmeReceiver = await pagarme("/recipients", {
    bank_account_id: pagarmeBankAccount.data.id,
    transfer_interval: "daily",
    transfer_enabled: true,
  });

  if (pagarmeBankAccount.error) {
    throw pargarmeReceiver;
  }

  return pargarmeReceiver;
};

const filterColaboradores = async (req, res) => {
  try {
    const colaboradores = await Collaborator.find(req.body.filters);
    res.json({ error: false, colaboradores });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const getColaboradoresBySalaoId = async (req, res) => {
  try {
    const { salaoId } = req.params;
    let listaColaboradores = [];

    const colaboradores = await SalonCollaborator.find({
      salaoId,
      status: { $ne: "E" },
    })
      .populate("colaboradorId")
      .select("colaboradorId dataCadastro status");

    for (let colaborador of colaboradores) {
      const especialidades = await ServiceCollaborator.find({
        colaboradorId: colaborador.colaboradorId._id,
      });

      listaColaboradores.push({
        ...colaborador._doc,
        especialidades: especialidades.map((e) => e.servicoId),
      });
    }

    res.json({
      error: false,
      colaboradores: listaColaboradores.map((c) => ({
        ...c.colaboradorId._doc,
        vinculoId: c._id,
        vinculo: c.status,
        especialidades: c.especialidades,
        dataCadastro: moment(c.dataCadastro).format("DD/MM/YYYY"),
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const updateColaborador = async (req, res) => {
  try {
    const { vinculo, vinculoId, especialidades } = req.body;
    const { colaboradorId } = req.params;

    await Collaborator.findByIdAndUpdate(colaboradorId, req.body);

    if (vinculo) {
      await SalonCollaborator.findByIdAndUpdate(vinculoId, { status: vinculo });
    }

    if (especialidades) {
      await ServiceCollaborator.deleteMany({
        colaboradorId,
      });

      await ServiceCollaborator.insertMany(
        especialidades.map((servicoId) => ({
          servicoId,
          colaboradorId,
        }))
      );
    }

    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const deleteColaboradorLink = async (req, res) => {
  try {
    await SalonCollaborator.findByIdAndUpdate(req.params.id, { status: "E" });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

router.post("/", createColaborador);
router.post("/filter", filterColaboradores);
router.get("/salao/:salaoId", getColaboradoresBySalaoId);
router.put("/:colaboradorId", updateColaborador);
router.delete("/vinculo/:id", deleteColaboradorLink);

export default router;
