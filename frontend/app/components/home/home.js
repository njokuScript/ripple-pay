import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
 } from 'react-native';

import { unauthUser } from '../../actions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout() {
    this.props.unauthUser();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi, user</Text>
        <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={this.onLogout}>
          <View style={styles.button}> 
            <Text>logout</Text>
          </View>
        </TouchableOpacity>
        </View>
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
    backgroundColor: '#335B7B',
    

  },
  logoutContainer: {
    padding: 20,
    backgroundColor: '#F2cFB1',
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 100,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 1,
  },
  button: {
    
    fontFamily: 'Apple SD Gothic Neo',
    
  },
});


export default Home;
