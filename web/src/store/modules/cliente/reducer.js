import produce from "immer";
import types from "./types";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    confirmDelete: false,
    drawer: false,
    tab: "dados-cadastrais",
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  cliente: {
    email: "",
    nome: "",
    telefone: "",
    dataNascimento: "",
    sexo: "M",
    documento: {
      tipo: "cpf",
      numero: "",
    },
    endereco: {
      cidade: "",
      uf: "",
      cep: "",
      logradouro: "",
      numero: "",
      pais: "BR",
    },
  },
  clientes: [],
};

function cliente(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_CLIENTE: {
      return produce(state, (draft) => {
        Object.assign(draft, action.payload);
      });
    }

    case types.FILTER_CLIENTE: {
      return produce(state, (draft) => {
        draft.form.filtering = true;
      });
    }

    case types.RESET_CLIENTE: {
      return produce(state, (draft) => {
        draft.cliente = INITIAL_STATE.cliente;
      });
    }
    default:
      return state;
  }
}

export default cliente;
