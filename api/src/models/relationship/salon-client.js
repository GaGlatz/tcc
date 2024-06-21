import { Schema, model, Types } from "mongoose";

const salonClientSchema = new Schema({
  salaoId: {
    type: Types.ObjectId,
    ref: "Salao",
    required: true,
  },
  clienteId: {
    type: Types.ObjectId,
    ref: "Cliente",
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

export default model("SalonClient", salonClientSchema);
