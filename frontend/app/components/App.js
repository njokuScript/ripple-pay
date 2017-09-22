import React from 'react';
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
import Main from './Main';
import AlertContainer from './alerts/AlertContainer';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.starter = new StartApp();
  }

  render() {
    let renderMainView = () => {
      if (this.props.user_id) {
        this.starter.startTabs();
        return (
          <View>
          </View>
        )
      } else {
        return (
          <Login />
        );
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {renderMainView()}
        <AlertContainer />
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
    user_id: state.user.user_id
  };
};
let mapDispatchToProps = (dispatch) => {
  return {
    unauthUser: () => dispatch(unauthUser)
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
