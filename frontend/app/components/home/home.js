import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
 } from 'react-native';

import { unauthUser } from '../../actions';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  onLogout() {
    this.props.unauthUser;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi, user</Text>
        <TouchableOpacity onPress={this.onLogout}>
          <Text>logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});


export default Home;
