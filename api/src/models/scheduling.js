import { Schema, model, Types } from "mongoose";

const schedulingSchema = new Schema({
  clienteId: {
    type: Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  salaoId: {
    type: Types.ObjectId,
    ref: "Salao",
    required: true,
  },
  servicoId: {
    type: Types.ObjectId,
    ref: "Servico",
    required: true,
  },
  colaboradorId: {
    type: Types.ObjectId,
    ref: "Colaborador",
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  comissao: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["A", "I"],
    required: true,
    default: "A",
  },
  transactionId: {
    type: String,
    required: true,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

export default model("Scheduling", schedulingSchema);
