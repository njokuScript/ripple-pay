// import liraries
import React, { Component } from 'react';
import { _ } from 'lodash';
// import StartApp from '../../index.js';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
import PasswordLock from '../presentationals/passwordLock';
import ScanQR from '../presentationals/scanQR';
import AlertContainer from '../alerts/AlertContainer';
import Util from '../../utils/util';
import Validation from '../../utils/validation';
import Config from '../../config_enums';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
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
    this.onQRScan = this.onQRScan.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      toAddress: "",
      toDesTag: undefined,
      amount: "",
      secret: "",
      sendButtonDisabled: true,
      displayQRCodeScanner: false
    };
    this.initialState = _.cloneDeep(this.state);
  }

  componentWillReceiveProps(nextProps) {
    let { toAddress, toDesTag, fee, amount } = this.props.transaction;
    const prevNotReadyToSend = Boolean(!toAddress || !fee || !amount);

    let { toAddress: nextPropsToAddress, toDestTag: nextPropsToDesTag, fee: nextPropsFee, amount: nextPropsAmount } = nextProps.transaction;
    const nowReadyToSend = Boolean(nextPropsToAddress && nextPropsFee && nextPropsAmount);

    if (prevNotReadyToSend && nowReadyToSend) {
      Alert.alert(
        'Send Ripple',
        'Transaction Details:',
        [
          { text: `To Address: ${nextPropsToAddress}`, onPress: this.props.clearTransaction },
          { text: `To Destination Tag: ${isNaN(nextPropsToDesTag) ? "Not specified" : nextPropsToDesTag}`, onPress: this.props.clearTransaction },
          { text: `Amount: ${nextPropsAmount}`, onPress: this.props.clearTransaction },
          { text: `Fee: ${nextPropsFee + Config.ripplePayFee}`, onPress: this.props.clearTransaction },
          { text: `Send Payment!`, onPress: this.sendPayment },
          { text: `Cancel Payment!`, onPress: this.props.clearTransaction }
        ],
        { cancelable: false }
      );
    }
  }

  onNavigatorEvent(event) {
    if (event.id === "willAppear") {
      this.props.clearTransaction();
    }
    if (event.id === "willDisappear") {
      this.setState(this.initialState);
      this.props.clearTransaction();
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
      if (this.props.activeWallet === Config.WALLETS.BANK_WALLET) {
        this.props.signAndSend(this.props.fromAddress, parseFloat(amount));
      }
      else if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {

        if (!this.secretKeyValidations()) {
          return;
        }
        
        this.props.sendPaymentWithPersonalAddress(this.props.fromAddress, this.state.secret, parseFloat(amount));
      }
    } 
    this.props.clearTransaction();
    this.setState(this.initialState);
  }

  secretKeyValidations() {
    const validationErrors = [];
    validationErrors.push(...Validation.validateInput(Validation.TYPE.SECRET_KEY, this.state.secret));
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        this.props.addAlert(error);
      })
      return false;
    }
    return true;
  }

  prepareTransactionValidations() {
    if (!this.props.fromAddress || !this.props.sourceTag) {
      this.props.addAlert("Please get a wallet first");
      return false;
    }
    if (this.props.fromAddress === this.state.toAddress) {
      this.props.addAlert("Can't Send to yourself");
      return false;
    }
    const validationErrors = [];
    validationErrors.push(...Validation.validateInput(Validation.TYPE.RIPPLE_ADDRESS, this.state.toAddress));

    if (this.state.toDesTag && this.state.toDesTag.length > 0) {
      validationErrors.push(...Validation.validateInput(Validation.TYPE.DESTINATION_TAG, this.state.toDesTag));
    }

    validationErrors.push(...Validation.validateInput(Validation.TYPE.MONEY, this.state.amount));
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        this.props.addAlert(error);
      })
      return false;
    }
    return true;
  }

  prepareTransaction(){
    if (!this.prepareTransactionValidations()) {
      return;
    }
    let { toDesTag, toAddress, amount } = this.state;

    if (this.props.activeWallet === Config.WALLETS.BANK_WALLET) {
      this.props.preparePayment(parseFloat(amount), this.props.fromAddress, toAddress, parseInt(this.props.sourceTag), parseInt(toDesTag));
    }
    else if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
      this.props.preparePaymentWithPersonalAddress(parseFloat(amount), this.props.fromAddress, toAddress, null, parseInt(toDesTag));
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

  renderSecretField() {
    if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
      return (
        <CustomInput
          placeholder="Secret Key"
          onChangeText={
            (secret) => {
              this.setState({ secret: secret });
            }
          }
          autoCorrect={false}
          autoCapitalize={'none'}
          placeholderTextColor="#6D768B"
          keyboardAppearance={'dark'}
        /> 
      );
    }
    return null;
  }

  onQRScan(e) {
    this.setState({toAddress: e.data, displayQRCodeScanner: false});
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

    if (this.state.displayQRCodeScanner) {
      return <ScanQR handleScan={this.onQRScan} />;
    }

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
            value={this.state.toAddress}
            autoFocus={true}
            autoCorrect={false}
            placeholderTextColor="#6D768B"
            keyboardAppearance={'dark'}
            autoCapitalize={'none'}
        />

        <Text onPress={() => { this.setState({displayQRCodeScanner: true}); }}>SCAN QR CODE!!!</Text>

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
          {this.renderSecretField()}
          <CustomButton
            performAction={"Prepare Payment"}
            buttonColor={this.state.sendButtonDisabled ? "red" : "white"}
            isDisabled={this.state.sendButtonDisabled}
            handlePress={this.prepareTransaction}
          />
        <View style={styles.fee}>
          <Text style={styles.feetext}>
            transaction Fee: {Config.ripplePayFee} XRP
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
