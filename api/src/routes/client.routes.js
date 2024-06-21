import { Router } from "express";
import Client from "../models/client.js";
import SalonClient from "../models/relationship/salon-client.js";
import moment from "moment";
import pagarme from "../services/pagarme.js";
import mongoose from "mongoose";

const router = Router();
const { connection, Types } = mongoose;

const createClient = async (req, res) => {
  const db = connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, salaoId } = req.body;
    let newClient = null;

    const existentClient = await Client.findOne({
      $or: [{ email: cliente.email }, { telefone: cliente.telefone }],
    });

    if (!existentClient) {
      newClient = await createNewClient(cliente, session);
    }

    const clienteId = existentClient ? existentClient._id : newClient._id;

    const existentRelationship = await SalonClient.findOne({
      salaoId,
      clienteId,
    });

    if (!existentRelationship) {
      await new SalonClient({
        salaoId,
        clienteId,
      }).save({ session });
    }

    if (existentRelationship && existentRelationship.status === "I") {
      await SalonClient.findOneAndUpdate(
        {
          salaoId,
          clienteId,
        },
        { status: "A" },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    if (
      existentRelationship &&
      existentRelationship.status === "A" &&
      existentClient
    ) {
      res.json({ error: true, message: "Cliente já cadastrado!" });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
};

const createNewClient = async (cliente, session) => {
  const _id = Types.ObjectId();
  const pagarmeCliente = await pagarme("/customers", {
    external_id: _id,
    name: cliente.nome,
    type: cliente.documento.tipo === "cpf" ? "individual" : "corporation",
    country: "br",
    email: cliente.email,
    documents: [
      {
        type: cliente.documento.tipo,
        number: cliente.documento.numero,
      },
    ],
    phone_numbers: ["+55" + cliente.telefone],
    birthday: cliente.dataNascimento,
  });

  if (pagarmeCliente.error) {
    throw pagarmeCliente;
  }

  return await new Client({
    _id,
    ...cliente,
    customerId: pagarmeCliente.data.id,
  }).save({ session });
};

const filterClients = async (req, res) => {
  try {
    const clientes = await Client.find(req.body.filters);
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const getClientsBySalaoId = async (req, res) => {
  try {
    const clientes = await SalonClient.find({
      salaoId: req.params.salaoId,
      status: "A",
    })
      .populate("clienteId")
      .select("clienteId");

    res.json({
      error: false,
      clientes: clientes.map((c) => ({
        ...c.clienteId._doc,
        vinculoId: c._id,
        dataCadastro: moment(c.dataCadastro).format("DD/MM/YYYY"),
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const deleteClientLink = async (req, res) => {
  try {
    await SalonClient.findByIdAndUpdate(req.params.id, { status: "I" });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

router.post("/", createClient);
router.post("/filter", filterClients);
router.get("/salao/:salaoId", getClientsBySalaoId);
router.delete("/vinculo/:id", deleteClientLink);

export default router;
