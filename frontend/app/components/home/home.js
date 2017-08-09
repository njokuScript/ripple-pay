import React from 'react';

import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions
 } from 'react-native';
import Search from '../search/search';
import Wallet from '../wallet/wallet';
import { unauthUser } from '../../actions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout() {
    this.props.unauthUser();
  }

  navSearch() {
    this.props.navigator.push({
      title: 'Search',
      component: Search
    })
  }

  navWallet() {
    this.props.navigator.push({
      title: 'Wallet',
      component: Wallet
    })
  }


  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={this.navWallet.bind(this)}>
            <Image style={{width: 30, height: 30}} source={require('./deposit.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.navSearch.bind(this)}>
          <Image
            style={{ width: 30, height: 30 }} source={require('./sendRequest.png')} />
        </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.xrpDisplay}>
            872,520 XRP
          </Text>
        </View>
         {/* temp logout button for develpment */}
          <View style={styles.navContainer}>
            <TouchableOpacity onPress={this.onLogout}>
              <Text>logout</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// define your styles
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1/4,
    backgroundColor: '#335B7B',
  },
  image: {
    resizeMode: 'contain'
  },
  nav: {
    flex: 1/16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  profileContainer: {
  flex: 1,
  alignItems: 'center'
},
  xrpDisplay: {
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    fontSize: 25
  }
});

export default Home;
