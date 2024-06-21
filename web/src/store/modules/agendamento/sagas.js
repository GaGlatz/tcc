import { takeLatest, all, call, put, select } from "redux-saga/effects";
import { updateAgendamento } from "./actions";
import types from "./types";
import api from "../../../services/api";
import { notification } from "../../../services/rsuite";
import consts from "../../../consts";

function* handleError(error) {
  yield call(notification, "error", {
    placement: "topStart",
    title: "Ops...",
    description: error.message,
  });
}

export function* filterAgenramentos({ range }) {
  try {
    const { data: res } = yield call(api.post, "/agendamento/filter", {
      salaoId: consts.salaoId,
      range,
    });

    if (res.error) {
      yield handleError(res);
      return;
    }

    yield put(updateAgendamento({ agendamentos: res.agendamentos }));
  } catch (err) {
    yield handleError(err);
  }
}

export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgenramentos)]);
