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
  colaborador: {
    email: "",
    nome: "",
    telefone: "",
    dataNascimento: "",
    sexo: "M",
    vinculo: "A",
    especialidades: [],
    contaBancaria: {
      titular: "",
      cpfCnpj: "",
      banco: "",
      tipo: "conta_corrente",
      agencia: "",
      numero: "",
      dv: "",
    },
  },
  colaboradores: [],
  servicos: [],
};

function colaborador(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case types.UPDATE_COLABORADOR:
        return { ...draft, ...action.payload };

      case types.FILTER_COLABORADOR:
        draft.form.filtering = true;
        break;

      case types.RESET_COLABORADOR:
        draft.colaborador = INITIAL_STATE.colaborador;
        break;

      default:
        break;
    }
  });
}

export default colaborador;
