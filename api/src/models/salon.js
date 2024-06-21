import { Schema, model } from "mongoose";

const salonSchema = new Schema({
  nome: String,
  foto: String,
  capa: String,
  email: String,
  senha: String,
  telefone: String,
  recipientId: String,
  endereco: {
    cidade: String,
    uf: String,
    cep: String,
    logradouro: String,
    numero: String,
    pais: String,
  },
  geo: {
    type: String,
    coordinates: [],
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

salonSchema.index({ coordenadas: "2dsphere" });

export default model("Salon", salonSchema);
