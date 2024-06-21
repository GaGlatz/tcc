import {combineReducers} from 'redux';
import salaoReducer from '../modules/salao/reducer';

const rootReducer = combineReducers({
  salao: salaoReducer,
});

export default rootReducer;
