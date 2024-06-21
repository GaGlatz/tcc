function* handleError(error) {
  Alert.alert('Erro', error.message);
  return false;
}

function* handleSuccess(message) {
  Alert.alert('Sucesso', message, [{text: 'OK'}]);
}

export function* getSalao() {
  try {
    const {data: res} = yield call(api.post, `/salao/${consts.salaoId}`);
    if (res.error) return yield* handleError(new Error(res.message));

    yield put(updateSalao(res.salao));
  } catch (err) {
    yield* handleError(err);
  }
}

export function* allServicos() {
  try {
    const {data: res} = yield call(api.get, `/servico/salao/${consts.salaoId}`);
    if (res.error) return yield* handleError(new Error(res.message));

    yield put(updateServicos(res.servicos));
  } catch (err) {
    yield* handleError(err);
  }
}

export function* filterAgenda() {
  try {
    const {agendamento, agenda} = yield select((state) => state.salao);
    const finalStartDate =
      agenda.length === 0
        ? moment().format('YYYY-MM-DD')
        : Object.keys(agenda[0])[0];

    const {data: res} = yield call(api.post, `/agendamento/dias-disponiveis`, {
      ...agendamento,
      data: finalStartDate,
    });
    if (res.error) return yield* handleError(new Error(res.message));

    const {horariosDisponiveis, data, colaboradorId} = yield call(
      util.selectAgendamento,
      res.agenda,
    );
    const finalDate = moment(`${data}T${horariosDisponiveis[0][0]}`).format();

    yield put(updateAgenda(res.agenda));
    yield put(updateColaboradores(res.colaboradores));
    yield put(updateAgendamento('data', finalDate));
    yield put(updateAgendamento('colaboradorId', colaboradorId));
  } catch (err) {
    yield* handleError(err);
  }
}

export function* saveAgendamento() {
  try {
    yield put(updateForm('agendamentoLoading', true));

    const {agendamento} = yield select((state) => state.salao);
    const {data: res} = yield call(api.post, `/agendamento`, agendamento);
    if (res.error) {
      yield put(updateForm('agendamentoLoading', false));
      return yield* handleError(new Error(res.message));
    }

    yield* handleSuccess('Horário agendado com sucesso');
    yield put(updateForm('agendamentoLoading', false));
  } catch (err) {
    yield put(updateForm('agendamentoLoading', false));
    yield* handleError(err);
  }
}

export default all([
  takeLatest(types.GET_SALAO, getSalao),
  takeLatest(types.ALL_SERVICOS, allServicos),
  takeLatest(types.FILTER_AGENDA, filterAgenda),
  takeLatest(types.SAVE_AGENDAMENTO, saveAgendamento),
]);
