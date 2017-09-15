// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import ExchangeContainer from '../exchange/exchangeContainer'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Entypo';

// create a component

//I DID NOT MAKE SURE THAT THE INPUT FIELDS ARE NUMBERS AND NOT LETTERS BECAUSE THIS WILL BE SOLVED WITH A NUMBERPAD LATER
class BankSend extends Component {
  constructor(props){
    super(props);
    this.sendPayment = this.sendPayment.bind(this);
    this.state = {
      amount: "",
      page: "",
      disabled: false
    };
  }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  // navWallet() {
    // this.props.requestTransactions(this.props.user);
    // this.props.requestAddressAndDesTag(this.props.user.user_id);
  //   this.props.navigator.push({
  //     title: 'Wallet',
  //     component: WalletContainer,
  //     navigationBarHidden: true
  //   });
  // }

  // navExchange() {
  //   this.props.navigator.push({
  //     title: "Exchange",
  //     component: ExchangeContainer,
  //     navigationBarHidden: true
  //   });
  // }

  navSearch() {
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }
  //I am not required to do request transactions here because this will happen automatically from componentDidMount in home.js

  navHome() {
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  sendPayment(){
    this.setState({disabled: true});
    this.props.sendInBank(this.props.sender_id, this.props.receiver_id, parseFloat(this.state.amount)).then(() => {
      this.setState({disabled: false});
      this.navHome.bind(this);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.navSearch.bind(this)} >
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Sending to {this.props.otherUser}
          </Text>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="Amount"
            onChangeText={
              (amt) => {
                this.setState({amount: amt});
              }
            }
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity disabled={this.state.disabled} onPress={this.sendPayment}>
            <Text style={this.state.disabled ? styles.redbutton : styles.greenbutton}>
              Send Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#335B7B',
   },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 20,
    backgroundColor: '#335B7B',
  },
  titleContainer: {
    padding: 10,
    alignItems: 'center',
  },

  title: {
    color: '#F2CFB1',
    fontSize: 35,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    flex: 1,
    top: 60,
    fontFamily: 'Kohinoor Bangla'
  },

  field: {
    borderRadius: 5,
    padding: 5,
    paddingLeft: 8,
    margin: 45,
    marginTop: 0,
    top: 80,
    backgroundColor: '#fff'
  },

  textInput: {
    height: 26,
    fontFamily: 'Kohinoor Bangla'
  },

  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 60
  },
  greenbutton: {
    fontSize: 30,
    color: 'green',
    fontFamily: 'Kohinoor Bangla',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'green',
    borderBottomWidth: 0,
    shadowOpacity: 0.3,
    padding: 7
  },
  redbutton: {
    fontSize: 30,
    color: 'red',
    fontFamily: 'Kohinoor Bangla',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'red',
    borderBottomWidth: 0,
    shadowOpacity: 0.3,
    padding: 7
  },
  formError: {
    color: 'red'
  }
});

// make this component available to the app
export default BankSend;