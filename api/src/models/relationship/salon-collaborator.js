import { Schema, model, Types } from "mongoose";

const salonCollaboratorSchema = new Schema({
  salaoId: {
    type: Types.ObjectId,
    ref: "Salao",
    required: true,
  },
  colaboradorId: {
    type: Types.ObjectId,
    ref: "Colaborador",
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

export default model("SalonCollaborator", salonCollaboratorSchema);
