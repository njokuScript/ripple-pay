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
        <View style={styles.profileContainer}>
          <Text style={styles.xrpDisplay}>
            872,520 XRP
          </Text>    
        </View>  
        <View style={styles.xrpOptionsContainer}>
          {/* <TouchableOpacity onPress={this.sendXrp}>
          <Text style={styles.xrpOption}>
            send
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.requestXrp}>
            <Text style={styles.xrpOption}>
              request
            </Text>
          </TouchableOpacity>  */}
          <TouchableOpacity onPress={this.depositXrp}>
            <Text style={styles.xrpOption}>
              deposit
            </Text>  
          </TouchableOpacity>
          <View style={styles.navContainer}>
            <TouchableOpacity onPress={this.onLogout}>
              <Text>logout</Text>
            </TouchableOpacity>
          </View>
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
  profileContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
  userDisplay: {
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    fontSize: 25,
    margin: 8,
  },
  xrpDisplay: {
    color: 'white', 
    fontFamily: 'Kohinoor Bangla',
    fontSize: 25, 
  },
  xrpOptionsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    bottom: 50,
    alignSelf: 'auto',
  },
  xrpOption: {
    fontFamily: 'Kohinoor Bangla',
    fontSize: 22,
    color: 'white',
    margin: 15,
    borderRadius: 4,
    borderWidth: 1.9,
    borderColor: 'white',
    padding: 9,
    flex: 1,
    shadowOpacity: 0.4,
    textAlign: 'center',
  }
});

export default Home;
