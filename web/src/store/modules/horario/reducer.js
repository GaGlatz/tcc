import produce from "immer";
import types from "./types";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    confirmDelete: false,
    drawer: false,
    view: "week",
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  horario: {
    dias: [],
    inicio: "",
    fim: "",
    especialidades: [],
    colaboradores: [],
  },
  horarios: [],
  servicos: [],
  colaboradores: [],
};

function horario(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case types.UPDATE_HORARIO:
        return { ...draft, ...action.payload };

      case types.RESET_HORARIO:
        draft.horario = INITIAL_STATE.horario;
        break;

      default:
        break;
    }
  });
}

export default horario;
