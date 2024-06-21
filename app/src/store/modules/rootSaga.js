import {all} from 'redux-saga/effects';
import salaoSagas from './salao/sagas';

export default function* rootSaga() {
  yield all([...salaoSagas]);
}
