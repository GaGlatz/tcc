import { takeLatest, all, call, put, select } from "redux-saga/effects";
import {
  updateCliente,
  resetCliente,
  allClientes as allClientesAction,
} from "./actions";
import types from "./types";
import api from "../../../services/api";
import { notification } from "../../../services/rsuite";
import consts from "../../../consts";

function* notify(type, message) {
  yield call(notification, type, {
    placement: "topStart",
    title: type === "error" ? "Ops..." : "Feitoooo!!",
    description: message,
  });
}

export function* filterCliente({ filters }) {
  const { form } = yield select((state) => state.cliente);

  try {
    yield put(updateCliente({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.post, "/cliente/filter", filters);
    yield put(updateCliente({ form: { ...form, filtering: false } }));

    if (res.error) {
      yield call(notify, "error", res.message);
      return false;
    }

    if (res.clientes.length > 0) {
      yield put(
        updateCliente({
          cliente: res.clientes[0],
          form: { ...form, filtering: false, disabled: true },
        })
      );
    } else {
      yield put(
        updateCliente({
          form: { ...form, filtering: false, disabled: false },
        })
      );
    }

    console.log(res.clientes);
  } catch (err) {
    yield put(updateCliente({ form: { ...form, filtering: false } }));
    yield call(notify, "error", err.message);
  }
}

export function* addCliente() {
  try {
    const { cliente, form, components } = yield select(
      (state) => state.cliente
    );
    yield put(updateCliente({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.post, "/cliente", {
      cliente,
      salaoId: consts.salaoId,
    });
    yield put(updateCliente({ form: { ...form, saving: false } }));

    if (res.error) {
      yield call(notify, "error", res.message);
      return false;
    }

    yield put(allClientesAction());
    yield put(updateCliente({ components: { ...components, drawer: false } }));
    yield put(resetCliente());

    yield call(notify, "success", "Cliente salvo com sucesso!");
  } catch (err) {
    yield call(notify, "error", err.message);
  }
}

export function* allClientes() {
  const { form } = yield select((state) => state.cliente);

  try {
    yield put(updateCliente({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/cliente/salao/66742bf2af325f7ddc17ba75`
    );
    yield put(updateCliente({ form: { ...form, filtering: false } }));

    if (res.error) {
      yield call(notify, "error", res.message);
      return false;
    }

    yield put(updateCliente({ clientes: res.clientes }));
  } catch (err) {
    yield put(updateCliente({ form: { ...form, filtering: false } }));
    yield call(notify, "error", err.message);
  }
}

export function* unlinkCliente({ payload }) {
  const { form, components, cliente } = yield select((state) => state.cliente);

  try {
    yield put(updateCliente({ form: { ...form, saving: true } }));

    const { data: res } = yield call(
      api.delete,
      `/cliente/vinculo/${cliente.vinculoId}`
    );
    yield put(updateCliente({ form: { ...form, saving: false } }));

    if (res.error) {
      yield call(notify, "error", res.message);
      return false;
    }

    yield call(notify, "success", "O cliente foi desvinculado com sucesso!");

    yield put(allClientesAction());
    yield put(
      updateCliente({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );
  } catch (err) {
    yield put(updateCliente({ form: { ...form, saving: false } }));
    yield call(notify, "error", err.message);
  }
}

export default all([
  takeLatest(types.ADD_CLIENTE, addCliente),
  takeLatest(types.FILTER_CLIENTE, filterCliente),
  takeLatest(types.ALL_CLIENTES, allClientes),
  takeLatest(types.UNLINK_CLIENTE, unlinkCliente),
]);
