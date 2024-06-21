import { Schema, model, Types } from "mongoose";

const servicesSchema = new Schema({
  salaoId: {
    type: Types.ObjectId,
    ref: "Salao",
  },
  titulo: {
    type: String,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  comissao: {
    type: Number,
    required: true,
  },
  duracao: {
    type: String,
    required: true,
  },
  recorrencia: {
    type: Number,
    required: true,
    default: 30,
  },
  descricao: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["A", "I", "E"],
    required: true,
    default: "A",
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

export default model("Services", servicesSchema);
