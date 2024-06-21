import { all } from "redux-saga/effects";

import cliente from "./cliente/sagas";
import servico from "./servico/sagas";
import colaborador from "./colaborador/sagas";
import horario from "./horario/sagas";
import agendamento from "./agendamento/sagas";

const sagas = [cliente, servico, colaborador, horario, agendamento];

export default function* rootSaga() {
  yield all(sagas);
}
