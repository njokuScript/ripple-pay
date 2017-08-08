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
        <View style={styles.navContainer}>
        <TouchableOpacity onPress={this.onLogout}>
          <View> 
              <Text style={styles.logout}>logout</Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.userDisplay}>
            Good Evening, Mr. Millionaire
          </Text>
          <Text style={styles.xrpDisplay}>
            Current XRP: 872,520
          </Text>    
        </View>  
        <View style={styles.xrpOptionsContainer}>
          <TouchableOpacity onPress={this.sendXrp}>
          <Text style={styles.xrpOption}>
            SEND XRP
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.requestXrp}>
            <Text style={styles.xrpOption}>
              REQUEST XRP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.withdrawXrp}>
            <Text style={styles.xrpOption}>
              WITHDRAW XRP
            </Text>
          </TouchableOpacity>  
          <TouchableOpacity onPress={this.depositXrp}>
            <Text style={styles.xrpOption}>
              DEPOSIT XRP
            </Text>  
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
  navContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logout: {
    fontFamily: 'Copperplate',
    color: '#F2cFB1',
    right: 120,
    top: 30,
    fontSize: 22,
  },
  userDisplay: {
    color: '#F2cFB1',
  },
  xrpDisplay: {
    color: '#F2cFB1', 
  },
  xrpOptionsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  xrpOption: {
    fontFamily: 'Copperplate',
    fontSize: 20,
    color: '#F2cFB1',
  }
});


export default Home;
