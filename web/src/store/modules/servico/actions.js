import types from "./types";

export const addServico = () => ({ type: types.ADD_SERVICO });

export const updateServico = (servico) => ({
  type: types.UPDATE_SERVICO,
  servico,
});

export const resetServico = () => ({ type: types.RESET_SERVICO });

export const allServicos = () => ({ type: types.ALL_SERVICOS });

export const removeArquivo = (arquivo) => ({
  type: types.REMOVE_ARQUIVO,
  arquivo,
});

export const saveServico = () => ({ type: types.SAVE_SERVICO });

export const removeServico = () => ({ type: types.REMOVE_SERVICO });
