import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import userReducer from './userReducer';
import alertsReducer from './alertsReducer';
import shapeReducer from './shapeReducer';
import transactionReducer from './transactionReducer';

module.exports = combineReducers({
  form: formReducer,
  user: userReducer,
  alerts: alertsReducer,
  shape: shapeReducer,
  transaction: transactionReducer
});
