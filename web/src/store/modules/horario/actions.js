import types from "./types";

export const updateHorario = (payload) => ({
  type: types.UPDATE_HORARIO,
  payload,
});

export const addHorario = () => ({ type: types.ADD_HORARIO });

export const saveHorario = () => ({ type: types.SAVE_HORARIO });

export const resetHorario = () => ({ type: types.RESET_HORARIO });

export const allHorarios = () => ({ type: types.ALL_HORARIOS });

export const allServicos = () => ({ type: types.ALL_SERVICOS });

export const removeHorario = () => ({ type: types.REMOVE_HORARIO });

export const filterColaboradores = () => ({ type: types.FILTER_COLABORADORES });
