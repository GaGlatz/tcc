import { Schema, model, Types } from "mongoose";

const collaboratorServiceSchema = new Schema({
  colaboradorId: {
    type: Types.ObjectId,
    ref: "Colaborador",
    required: true,
  },
  servicoId: {
    type: Types.ObjectId,
    ref: "Servico",
    required: true,
  },
  status: {
    type: String,
    enum: ["A", "I"],
    required: true,
    default: "A",
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

export default model("CollaboratorService", collaboratorServiceSchema);
