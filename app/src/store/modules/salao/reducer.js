import types from './types';
import produce from 'immer';
import {uniq} from 'underscore';
import consts from '../../../consts';

const INITIAL_STATE = {
  salao: {},
  servicos: [],
  agenda: [],
  colaboradores: [],
  agendamento: {
    clienteId: consts.clienteId,
    salaoId: consts.salaoId,
    servicoId: null,
    colaboradorId: null,
    data: null,
  },
  form: {
    inputFiltro: '',
    inputFiltroFoco: false,
    modalEspecialista: false,
    modalAgendamento: 0,
    agendamentoLoading: false,
  },
};

function salao(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case types.UPDATE_FORM:
        draft.form[action.key] = action.value;
        break;
      case types.UPDATE_SALAO:
        Object.assign(draft.salao, action.salao);
        break;
      case types.UPDATE_SERVICOS:
        draft.servicos = action.servicos;
        break;
      case types.UPDATE_AGENDA:
        draft.agenda = [...draft.agenda, ...action.agenda];
        break;
      case types.UPDATE_COLABORADORES:
        draft.colaboradores = uniq([
          ...draft.colaboradores,
          ...action.colaboradores,
        ]);
        break;
      case types.UPDATE_AGENDAMENTO:
        if (action.key === 'servicoId') {
          draft.form.modalAgendamento = 2;
        }
        draft.agendamento[action.key] = action.value;
        break;
      case types.RESET_AGENDAMENTO:
        draft.agenda = INITIAL_STATE.agenda;
        draft.colaboradores = INITIAL_STATE.colaboradores;
        draft.agendamento = INITIAL_STATE.agendamento;
        break;
    }
  });
}

export default salao;
