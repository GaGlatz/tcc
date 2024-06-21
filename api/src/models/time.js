import { Schema, model, Types } from "mongoose";

const timeSchema = new Schema({
  salaoId: {
    type: Types.ObjectId,
    ref: "Salao",
    required: true,
  },
  dias: {
    type: [Number],
    required: true,
  },
  inicio: {
    type: Date,
    required: true,
  },
  fim: {
    type: Date,
    required: true,
  },
  especialidades: {
    type: [{ type: Types.ObjectId, ref: "Servico" }],
    required: true,
  },
  colaboradores: {
    type: [{ type: Types.ObjectId, ref: "Colaborador" }],
    required: true,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

export default model("Time", timeSchema);
