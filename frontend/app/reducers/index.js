import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import userReducer from './userReducer';
import alertsReducer from './alertsReducer';
import changellyReducer from './changellyReducer';
import transactionReducer from './transactionReducer';

module.exports = combineReducers({
  form: formReducer,
  user: userReducer,
  alerts: alertsReducer,
  changelly: changellyReducer,
  transaction: transactionReducer
});
