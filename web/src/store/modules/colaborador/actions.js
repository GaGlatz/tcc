import types from "./types";

export const filterColaborador = (filters) => ({
  type: types.FILTER_COLABORADOR,
  filters,
});

export const updateColaborador = (payload) => ({
  type: types.UPDATE_COLABORADOR,
  payload,
});

export const addColaborador = (colaborador) => ({
  type: types.ADD_COLABORADOR,
  colaborador,
});

export const resetColaborador = () => ({ type: types.RESET_COLABORADOR });

export const allColaboradores = () => ({ type: types.ALL_COLABORADORES });

export const unlinkColaborador = (colaboradorId) => ({
  type: types.UNLINK_COLABORADOR,
  colaboradorId,
});

export const allServicos = () => ({ type: types.ALL_SERVICOS });

export const saveColaborador = () => ({ type: types.SAVE_COLABORADOR });
