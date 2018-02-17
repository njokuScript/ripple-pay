import thunk from 'redux-thunk';
import {createStore, compose, applyMiddleware} from 'redux';
// import {AsyncStorage} from 'react-native';
// import {persistStore, autoRehydrate} from 'redux-persist';
// import FSStorage from 'redux-persist-fs-storage';
import reducer from '../reducers';
import logger from 'redux-logger';

let defaultState = {};
// Upgraded from AsyncStorage to file system storage because info was getting too large. 
// This must be removed later anyway though.
// Must remove autoRehydrate and persistStore in production. Unsafe.
exports.configureStore = (initialState=defaultState) => {
  // AsyncStorage.clear().then(() => {})
  // do clear when the first screen appears
  let store = createStore(reducer, initialState, compose(
    applyMiddleware(thunk, logger)
    // autoRehydrate()
  ));
  // persistStore(store, {storage: FSStorage()});
  return store;
};
