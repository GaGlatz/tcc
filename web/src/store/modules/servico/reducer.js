import types from "./types";
import moment from "moment";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    confirmDelete: false,
    drawer: false,
    tab: "servicos",
  },
  form: {
    filtering: false,
    disabled: false,
    saving: false,
  },
  servico: {
    titulo: "",
    preco: "",
    comissao: "",
    duracao: moment("00:30", "HH:mm").format(),
    recorrencia: "",
    descricao: "",
    status: "A",
    arquivos: [],
  },
  servicos: [],
};

function servico(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_SERVICO: {
      return { ...state, ...action.servico };
    }

    case types.RESET_SERVICO: {
      return { ...state, servico: INITIAL_STATE.servico };
    }

    default:
      return state;
  }
}

export default servico;
