import types from './types';

// Ação para obter informações do salão
export const getSalao = () => ({type: types.GET_SALAO});

// Ação para atualizar informações do salão
export const updateSalao = (salao) => ({type: types.UPDATE_SALAO, salao});

// Ação para obter todos os serviços
export const allServicos = () => ({type: types.ALL_SERVICOS});

// Ação para atualizar a lista de serviços
export const updateServicos = (servicos) => ({
  type: types.UPDATE_SERVICOS,
  servicos,
});

// Ação genérica para atualizar qualquer campo do agendamento
export const updateAgendamento = (key, value) => ({
  type: types.UPDATE_AGENDAMENTO,
  key,
  value,
});

// Ação genérica para atualizar qualquer campo do formulário
export const updateForm = (key, value) => ({
  type: types.UPDATE_FORM,
  key,
  value,
});

// Ação para filtrar a agenda
export const filterAgenda = () => ({type: types.FILTER_AGENDA});

// Ação para atualizar a agenda
export const updateAgenda = (agenda) => ({type: types.UPDATE_AGENDA, agenda});

// Ação para atualizar a lista de colaboradores
export const updateColaboradores = (colaboradores) => ({
  type: types.UPDATE_COLABORADORES,
  colaboradores,
});

// Ação para resetar o agendamento
export const resetAgendamento = () => ({type: types.RESET_AGENDAMENTO});

// Ação para salvar o agendamento
export const saveAgendamento = () => ({type: types.SAVE_AGENDAMENTO});
