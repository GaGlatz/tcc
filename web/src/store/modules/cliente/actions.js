import types from "./types";

export const filterCliente = (filters) => ({
  type: types.FILTER_CLIENTE,
  filters,
});

export const updateCliente = (payload) => ({
  type: types.UPDATE_CLIENTE,
  payload,
});

export const addCliente = (cliente) => ({ type: types.ADD_CLIENTE, cliente });

export const resetCliente = () => ({ type: types.RESET_CLIENTE });

export const allClientes = () => ({ type: types.ALL_CLIENTES });

export const unlinkCliente = (clienteId) => ({
  type: types.UNLINK_CLIENTE,
  clienteId,
});
