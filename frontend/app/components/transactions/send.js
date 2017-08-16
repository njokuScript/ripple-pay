// import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
class Send extends Component {

  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  // navWallet() {
  //   this.props.requestTransactions(this.props.user);
  //   this.props.requestAddressAndDesTag(this.props.user.user_id);
  //   this.props.navigator.push({
  //     title: 'Wallet',
  //     component: Wallet,
  //     navigationBarHidden: true
  //   });
  // }

  // navHome() {
  //   this.setState({query: ""});
  //   this.props.requestTransactions(this.props.user);
  //   this.props.navigator.push({
  //     title: 'Home',
  //     component: HomeContainer,
  //     navigationBarHidden: true
  //   });
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text>Send</Text>
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

//make this component available to the app
export default Send;
