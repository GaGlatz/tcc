import produce from "immer";
import types from "./types";

const INITIAL_STATE = {
  components: {
    modal: false,
  },
  agendamento: {},
  agendamentos: [],
};

function agendamento(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_AGENDAMENTO: {
      return produce(state, (draft) => {
        Object.assign(draft, action.payload);
      });
    }
    default:
      return state;
  }
}

export default agendamento;
