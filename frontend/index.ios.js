import StartApp from './app/index';

let starter = new StartApp();
starter.makeRegistrations();
starter.startSingleApplication();

// import React, { Component } from 'react';
// import {Provider} from 'react-redux';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';
//
// import App from './app/components/App';
//
// import {configureStore} from './app/store';
//
// let theStore = configureStore();
// class ripplePay extends Component {
//   render() {
//     return (
//       <Provider store={theStore}>
//         <App />
//       </Provider>
//     );
//   }
// }
//
// AppRegistry.registerComponent('ripplePay', () => ripplePay);
//
// export default theStore;
