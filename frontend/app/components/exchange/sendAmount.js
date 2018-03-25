// import liraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { _ } from 'lodash';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import sendAmountContainer from './sendAmountContainer';
import CustomButton from '../presentationals/customButton';
import CustomInput from '../presentationals/customInput';
import PasswordLock from '../presentationals/passwordLock';
import AlertContainer from '../alerts/AlertContainer';
import Util from '../../utils/util';
import Validation from '../../utils/validation';
import ExchangeConfig from './exchange_enums';
import Config from '../../config_enums';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Clipboard,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

// create a component
class SendAmount extends Component {
  constructor(props){
    super(props);
    this.toThisAmount = "";
    this.fromThisAmount = "";
    this.changellyLogo = require('./images/changelly-logo.jpg');
    this.renderButton = this.renderButton.bind(this);
    this.sendPayment = this.sendPayment.bind(this);
    this.preparePayment = this.preparePayment.bind(this);
    this.enableSending = this.enableSending.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      pushed: false,
      sendButtonDisabled: true,
      secret: ''
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
        `Convert Ripple to ${nextProps.altCoin}`,
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

  onNavigatorEvent(event){
    if (event.id === "willDisappear"){
      this.setState(this.initialState);
      this.props.clearChangellyTransaction();
      this.props.clearTransaction();
      clearInterval(this.timer);
      this.props.navigator.popToRoot();
    }
  }


  enableSending() {
    this.setState({
      sendButtonDisabled: false
    });
  }

  renderButton(){
    if ( this.props.action === ExchangeConfig.ACTIONS.WITHDRAW && this.state.pushed === false )
    {
      return(
        <View>
          <CustomButton
            performAction="Withdraw"
            buttonColor={this.state.sendButtonDisabled ? "red" : "white"}
            isDisabled={this.state.sendButtonDisabled}
            handlePress={this.preparePayment}
          />
        </View>
      );
    }
  }

  secretKeyValidations() {
    const validationErrors = [];
    validationErrors.push(...Validation.validateInput(Validation.TYPE.SECRET_KEY, this.state.secret));
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        this.props.addAlert(error);
      });
      return false;
    }
    return true;
  }

  prepareTransactionValidations() {
    const { changellyAddress, changellyDestTag, from, refundAddress, refundDestTag, fee } = this.props.changelly.changellyTxn;
    let sourceTag = refundDestTag;
    let fromAddress = refundAddress;

    if (!changellyAddress || !changellyDestTag || !fromAddress || !from.fromAmount) {
      this.props.addAlert("There was an error in the transaction.");
      return false;
    }
    if (this.props.user.activeWallet === Config.WALLETS.BANK_WALLET && !sourceTag) {
      this.props.addAlert("Error occurred. Please get a bank wallet.");
      return false;
    }
    return true;
  }

  preparePayment(){
    this.setState({pushed: true});
    const { changellyAddress, changellyDestTag, from, refundAddress, refundDestTag, fee } = this.props.changelly.changellyTxn;
    let sourceTag = refundDestTag;
    let fromAddress = refundAddress;
    
    if (!this.prepareTransactionValidations()) {
      return;
    }

    if (this.props.user.activeWallet === Config.WALLETS.BANK_WALLET) {
      this.props.preparePayment(
        parseFloat(from.fromAmount),
        fromAddress,
        changellyAddress,
        parseInt(sourceTag),
        parseInt(changellyDestTag)
      );
    }
    else if (this.props.user.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
      this.props.preparePaymentWithPersonalAddress(
        parseFloat(from.fromAmount),
        fromAddress,
        changellyAddress,
        parseInt(sourceTag),
        parseInt(changellyDestTag)
      );
    }

  }

  sendPayment() {
    this.setState({ sendButtonDisabled: true });
    const { amount } = this.props.transaction;
    let fromAddress = this.props.changelly.changellyTxn.refundAddress;
    if (amount) {
      if (this.props.user.activeWallet === Config.WALLETS.BANK_WALLET) {
        this.props.signAndSend(fromAddress, parseFloat(amount));
      }
      else if (this.props.user.activeWallet === Config.WALLETS.PERSONAL_WALLET) {

        if (!this.secretKeyValidations()) {
          return;
        }
        
        this.props.sendPaymentWithPersonalAddress(fromAddress, this.state.secret, parseFloat(amount));
      }
    }

    this.props.clearTransaction();
    this.props.clearChangellyTransaction();
    this.props.navigator.popToRoot();

  }

  renderSecretField() {
    if (this.props.user.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
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

  calculateToAmountAfterFee(toAmount, feePercentage) {
    return toAmount - (feePercentage/100)*toAmount;
  }

  getQRCode(changellyAddress) {
    if (this.props.action === ExchangeConfig.ACTIONS.DEPOSIT) {
      return (
        <TouchableOpacity style={styles.image} underlayColor='#111F61' onPress={() => Util.clipBoardCopy(changellyAddress)}>
          <Image
            style={styles.qrCode}
            source={{ uri: Util.getQRCodeSource(changellyAddress) }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    let { changellyTxnId, changellyAddress, changellyDestTag, date, otherParty, toDestTag, from, to, refundAddress, refundDestTag, fee, message } = this.props.changelly.changellyTxn;
    // message means that the changelly order was unsuccessful
    if (message) {
      this.props.addAlert(message.message);
      this.props.navigator.popToRoot();
      return null;
    }

    if (this.props.action === ExchangeConfig.ACTIONS.WITHDRAW && this.state.sendButtonDisabled) {
      return (
        <View style={styles.bluecontainer}>
          {this.renderSecretField()}
          <PasswordLock enableSending={this.enableSending} />
        </View>
      );
    }

    to = to || {};
    from = from || {};
    let { amount, coin } = this.props.changelly.rate;
      return (
        <View style={styles.container}>
          <AlertContainer />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {this.props.action === ExchangeConfig.ACTIONS.WITHDRAW ? "Withdraw" : "Deposit"} {to.toCoin}
            </Text>
          </View>
          <ScrollView style={styles.infoContainer}>
            <View style={styles.imageContainer}>
              <View style={styles.image}>
                <Image
                  style={styles.changellyLogo}
                  source={this.changellyLogo}
                />
              </View>
            </View>
            { this.props.action === ExchangeConfig.ACTIONS.DEPOSIT ? <Text style={styles.whitetext}>{from.fromCoin} Deposit Address:   {changellyAddress ? changellyAddress : 'Please Wait...' }</Text> : null }
            { this.getQRCode(changellyAddress) }
            <Text style={styles.whitetext}>{to.toCoin} Withdraw Address:   {otherParty}</Text>
            { this.props.action === ExchangeConfig.ACTIONS.DEPOSIT ? <Text style={styles.whitetext}>{to.toCoin} Withdraw Dest Tag:   {toDestTag}</Text> : null }
            <Text style={styles.whitetext}>Send Minimum:   {Util.truncate(this.props.changelly.minimumSend.minAmount, 4)} {from.fromCoin}</Text>
            <Text style={styles.whitetext}>Deposit Amount:   {Util.truncate(from.fromAmount, 4)} {from.fromCoin}</Text>
            <Text style={styles.whitetext}>Approx Withdraw Amount:   {Util.truncate(to.toAmount, 4)} {to.toCoin}</Text>
            <Text style={styles.whitetext}>Rate:   {Util.truncate(this.props.changelly.rate.amount, 4)} {to.toCoin}/{from.fromCoin}</Text>
            <Text style={styles.whitetext}>Changelly Fee:   {fee}% of {to.toCoin} withdrawal</Text>
            <Text style={styles.whitetext}>Approx Withdraw Amount After Fee:   {Util.truncate( this.calculateToAmountAfterFee(to.toAmount, fee), 4 )} {to.toCoin}</Text>
          </ScrollView>
          {this.renderButton()}
        </View>
      ); 
    }
  }

// define your styles
const { width, height } = Dimensions.get('window');
let aspectRatio = width / height;

const styles = StyleSheet.create({
  whitetext: {
    // color: '#F2CFB1',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 16,
    borderBottomWidth: 1,
    padding: 10,

    borderBottomColor: '#d3d3d3'
  },
  timeleft: {
    color: 'white',
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: 'white'
  },
  bluecontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#111F61',
    paddingTop: 20
  },
  titleContainer: {
    // flex: -1,
    backgroundColor: '#111F61',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 25,
    // marginTop: 40,
    // textAlign: 'center'
  },
  infoContainer: {
    marginTop: 20,
    marginLeft: 10
  },
  qrCode: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  image: {
    flex: 1,
    alignItems: "center"
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center'
  },
  changellyLogo: {
    width: width / 1.8,
    height: height / 8,
    borderRadius: 6,
    marginLeft: width / 9
  },
});

export default SendAmount;
