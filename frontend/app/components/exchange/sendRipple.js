// import liraries
import React, { Component } from 'react';
// import StartApp from '../../index.js';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
import PasswordLock from '../presentationals/passwordLock';
import AlertContainer from '../alerts/AlertContainer';
import Util from '../../utils/util';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

// create a component
//I DID NOT MAKE SURE THAT THE INPUT FIELDS ARE NUMBERS AND NOT LETTERS BECAUSE THIS WILL BE SOLVED WITH A NUMBERPAD LATER
class SendRipple extends Component {
  constructor(props){
    super(props);
    this.prepareTransaction = this.prepareTransaction.bind(this);
    this.sendPayment = this.sendPayment.bind(this);
    this.enableSending = this.enableSending.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      toAddress: "",
      toDesTag: undefined,
      amount: "",
      sendButtonDisabled: true
    };
  }

  onNavigatorEvent(event) {
    if (event.id === "willAppear") {
      this.props.clearTransaction();
    }
    if (event.id === "willDisappear") {
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

  sendPayment() {
    this.setState({ sendButtonDisabled: true });
    const { amount } = this.props.transaction;
    if (amount) {
      this.props.signAndSend(this.props.fromAddress, parseFloat(amount));
    } else {
      this.props.clearTransaction();
    }
  }

  prepareTransaction(){
    if ( !this.props.fromAddress || !this.props.sourceTag)
    {
      this.props.addAlert("Please get a wallet first")
    }
    //This is the REGEX to validate a Ripple Address
    else if(!Util.validRippleAddress(this.state.toAddress))
    {
      this.props.addAlert("Invalid Ripple Address");
    }
    else if (this.props.fromAddress === this.state.toAddress) {
      this.props.addAlert("Can't Send to yourself");
    }
    else{
      if (this.state.toAddress === "") {
        this.props.addAlert("Please Enter a destination address");
        return;
      }
      if (this.state.amount === "") {
        this.props.addAlert("Please enter an amount");
        return;
      }
      let {toDesTag, toAddress, amount} = this.state;
      if (!Util.validMoneyEntry(amount))
      {
        this.props.addAlert("Can't send 0 or less Ripple");
        return;
      }
      this.props.preparePayment(parseFloat(amount), this.props.fromAddress, toAddress, parseInt(this.props.sourceTag), parseInt(toDesTag));
    }
  }

  displayBackButton() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => this.props.navigator.pop({
          animationType: 'fade'
        })}>
          <Text><Icon name="chevron-left" size={30} color={"white"} /></Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (this.state.sendButtonDisabled) {
      return (
        <View style={styles.container}>
          <AlertContainer />
          { this.displayBackButton() }
          <PasswordLock enableSending={this.enableSending} />
        </View>
      );
    }

    const { toAddress, toDesTag, fee, amount } = this.props.transaction;
    const readyToSend = Boolean(toAddress && fee && amount);
    const transaction = () => {
      if (readyToSend) {
        return (
          <View>
            <Text>To address: {toAddress}</Text>
            <Text>To Destination Tag: {toDesTag}</Text>
            <Text>Amount: {amount}</Text>
            <Text>Fee: {fee}</Text>
          </View>
        );
      }
      return null;
    };
    return (
      <View style={styles.container}>
        <AlertContainer />
        { this.displayBackButton() }
        <CustomInput
            placeholder="Destination Address"
            onChangeText={
              (toAddr) => {
                this.setState({toAddress: toAddr});
              }
            }
            autoFocus={true}
            autoCorrect={false}
            placeholderTextColor="#6D768B"
            keyboardAppearance={'dark'}
            autoCapitalize={'none'}
        />
        <CustomInput
            placeholder="Destination Tag - optional"
            onChangeText={
              (des) => {
                this.setState({toDesTag: des});
              }
            }
            autoCorrect={false}
            autoCapitalize={'none'}
            placeholderTextColor="#6D768B"
            keyboardType={'number-pad'}
            keyboardAppearance={'dark'}
          />
        <CustomInput
            placeholder="Amount"
            onChangeText={
              (amt) => {
                this.setState({amount: amt});
              }
            }
            autoCorrect={false}
            placeholderTextColor="#6D768B"
            autoCapitalize={'none'}
            keyboardType={'number-pad'}
            keyboardAppearance={'dark'}
          />
          <CustomButton
            performAction={readyToSend ? "Send Payment" : "Prepare Payment"}
            buttonColor={this.state.sendButtonDisabled ? "red" : "white"}
            isDisabled={this.state.sendButtonDisabled}
            handlePress={readyToSend ? this.sendPayment : this.prepareTransaction}
          />
          { transaction() }
        <View style={styles.fee}>
          <Text style={styles.feetext}>
            transaction Fee: 0.02 XRP
          </Text>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#111F61',
    paddingTop: 20
  },
  topContainer: {
    marginBottom: -10,
    marginLeft: 10
  },
  feetext: {
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20
  },
  formError: {
    color: 'red'
  }
});

//make this component available to the app
export default SendRipple;
