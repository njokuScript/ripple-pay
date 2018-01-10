// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
import CustomBackButton from '../presentationals/customBackButton';
import PasswordLock from '../presentationals/passwordLock';
import AlertContainer from '../alerts/AlertContainer';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

// I DID NOT MAKE SURE THAT THE INPUT FIELDS ARE NUMBERS AND NOT LETTERS BECAUSE THIS WILL BE SOLVED WITH A NUMBERPAD LATER
class BankSend extends Component {
  constructor(props){
    super(props);
    this.sendPayment = this.sendPayment.bind(this);
    this.enableSending = this.enableSending.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      amount: "",
      sendButtonDisabled: false
    };
  }

  onNavigatorEvent(event){
    if ( event.id === "willDisappear")
    {
      this.setState({
        sendButtonDisabled: true
      });
    }
  }

  enableSending() {
    this.setState({
      sendButtonDisabled: false
    });
  }

  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.

  //I am not required to do request transactions here because this will happen automatically from componentDidMount in home.js


  sendPayment(){
    if (!parseFloat(this.state.amount) || parseFloat(this.state.amount) <= 0 || !this.state.amount.match(/\d+/))
    {
      this.props.addAlert("Can't send 0 or less Ripple");
      return;
    }
    this.setState({sendButtonDisabled: true});
    this.props.sendInBank(this.props.receiverScreenName, parseFloat(this.state.amount));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <CustomBackButton handlePress={() => this.props.navigator.pop({
            animationType: 'fade'
          })}/>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceTextField}>
              balance:
            </Text>
            <Text style={styles.balanceText}>
              {this.props.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
            </Text>
          </View>
        </View>
        <View style={styles.amount}>
          <CustomInput
            placeholder="Amount"
            onChangeText={
              (amt) => {
                this.setState({amount: amt});
              }
            }
            autoCorrect={false}
            placeholderTextColor="#6D768B"
            autoFocus={true}
            autoCapitalize={'none'}
            keyboardType={'number-pad'}
            keyboardAppearance={'dark'}/>
        </View>
        <View style={styles.paymentButton}>
          <CustomButton
            performAction={`pay ${this.props.receiverScreenName}`}
            buttonColor={this.state.sendButtonDisabled ? "red" : "white"}
            isDisabled={this.state.sendButtonDisabled}
            handlePress={this.sendPayment}
          />
          <View style={styles.alert}>
            <AlertContainer />
          </View>
        </View>
        {/* <PasswordLock enableSending={this.enableSending} /> */}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: '#111F61',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#111F61',
  },
  titleContainer: {
    alignItems: 'center',
  },
  paymentButton:{
    marginTop: 0
  },
  title: {
   textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'Kohinoor Bangla',
  },
  field: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 30,
    marginTop: -20,
    top: 90
  },
  textInput: {
    height: 40,
    fontFamily: 'Kohinoor Bangla',
    color: 'black',
  },
  formError: {
    color: 'red'
  },
  balanceContainer: {
    borderRadius: 50,
    borderColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row"
  },
  balanceText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontFamily: 'Kohinoor Bangla'
  },
  balanceTextField: {
    textAlign: 'center',
    fontSize: 11,
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    marginTop: 9,
    marginRight: 10
  },
  alert: {
    marginTop: 205
  }
});

// make this component available to the app
export default BankSend;
