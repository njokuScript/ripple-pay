import thunk from 'redux-thunk';
import {createStore, compose, applyMiddleware} from 'redux';
import {AsyncStorage} from 'react-native';
import {persistStore, autoRehydrate} from 'redux-persist';
import reducer from '../reducers';
import logger from 'redux-logger';

var defaultState = {};
// Must remove autoRehydrate and persistStore in production. Unsafe.
exports.configureStore = (initialState=defaultState) => {
  // AsyncStorage.clear().then(() => {})
  // do clear when the first screen appears
  var store = createStore(reducer, initialState, compose(
    applyMiddleware(thunk, logger),
    autoRehydrate()
  ));
  persistStore(store, {storage: AsyncStorage});
  return store;
};
