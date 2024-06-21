import { Schema, model, Types } from "mongoose";

const fileSchema = new Schema({
  referenciaId: {
    type: Types.ObjectId,
    refPath: "model",
  },
  model: {
    type: String,
    required: true,
    enum: ["Servico", "Salao"],
  },
  arquivo: {
    type: String,
    required: true,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

export default model("File", fileSchema);
