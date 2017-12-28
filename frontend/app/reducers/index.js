import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import authReducer from './authReducer';
import alertsReducer from './alertsReducer';
import shapeReducer from './shapeReducer';

module.exports = combineReducers({
  form: formReducer,
  user: authReducer,
  alerts: alertsReducer,
  shape: shapeReducer
});
