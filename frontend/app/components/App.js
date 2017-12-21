import React from 'react';
import * as Keychain from 'react-native-keychain';
import {connect} from 'react-redux';
import { unauthUser } from '../actions/authActions';
import StartApp from '../index';
import {
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';

import Login from './Login';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.starter = new StartApp();
  }

  clearCredentials() {
    Keychain.resetGenericPassword().then(() => {
      console.log("jwt token deleted");
    })
  }

  render() {
    let renderMainView = () => {
      if (this.props.screenName) {
        this.starter.startTabs();
        //Since it starts at tab-based application, it automatically knows to
        //start with the home page
        return (
          <View>
          </View>
        )
      } else {
        this.clearCredentials();
        return (
          <Login />
        );
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {renderMainView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#ccc'
  },
});

let mapStateToProps = (state) => {
  return {
    screenName: state.user.screenName
  };
};
let mapDispatchToProps = (dispatch) => {
  return {
    unauthUser: () => dispatch(unauthUser())
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
