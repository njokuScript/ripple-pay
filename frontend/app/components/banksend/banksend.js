// import liraries
import React, { Component } from 'react';
import { _ } from 'lodash';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
import CustomBackButton from '../presentationals/customBackButton';
import PasswordLock from '../presentationals/passwordLock';
import AlertContainer from '../alerts/AlertContainer';
import Util from '../../utils/util';
import Validation from '../../utils/validation';
import { getXRPtoUSD } from '../../actions';
import Config from '../../config_enums';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

class BankSend extends Component {
  constructor(props){
    super(props);
    this.setUSD = this.setUSD.bind(this);
    this.sendPayment = this.sendPayment.bind(this);
    this.preparePersonal = this.preparePersonal.bind(this);
    this.sendPersonal = this.sendPersonal.bind(this);
    this.enableSending = this.enableSending.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      amount: "",
      secret: "",
      sendingDisabled: true,
      keyboardHeight: 0,
      usd: 0,
      usdPerXRP: 0
    };
    this.initialState = _.cloneDeep(this.state);
  }

  onNavigatorEvent(event){
    if ( event.id === "willDisappear") {
      this.setState(this.initialState);
    } else if (event.id === "willAppear") {
      getXRPtoUSD(this.props.balance, this.setUSD);
      this.props.clearTransaction();
      this.props.clearAlerts();
    }
    if (event.id === "bottomTabSelected") {
      this.props.clearTransaction();
      this.props.navigator.popToRoot();
    }
  }

  componentWillReceiveProps(nextProps) {
    let { toAddress, toDesTag, fee, amount } = this.props.transaction;
    const prevNotReadyToSend = Boolean(!toAddress || !fee || !amount);

    let { toAddress: nextPropsToAddress, toDestTag: nextPropsToDesTag, fee: nextPropsFee, amount: nextPropsAmount } = nextProps.transaction;
    const nowReadyToSend = Boolean(nextPropsToAddress && nextPropsFee && nextPropsAmount);

    if (prevNotReadyToSend && nowReadyToSend) {
      Alert.alert(
        `Sending Ripple to ${nextProps.receiverScreenName}`,
        'Transaction Details:',
        [
          { text: `To Address: ${nextPropsToAddress}`, onPress: this.props.clearTransaction },
          { text: `To Destination Tag: ${isNaN(nextPropsToDesTag) ? "Not specified" : nextPropsToDesTag}`, onPress: this.props.clearTransaction },
          { text: `Amount: ${nextPropsAmount}`, onPress: this.props.clearTransaction },
          { text: `Fee: ${nextPropsFee + Config.ripplePayFee}`, onPress: this.props.clearTransaction },
          { text: `Send Payment!`, onPress: this.sendPersonal },
          { text: `Cancel Payment!`, onPress: this.props.clearTransaction }
        ],
        { cancelable: false }
      );
    }
  }

  enableSending() {
    this.props.clearAlerts();
    this.setState({
      sendingDisabled: false
    });
  }

  sendPayment() {
    this.props.clearAlerts();
    if (!this.bankSendValidations()) {
      return;
    }
    this.props.addAlert("sending payment...");
    this.setState({ sendingDisabled: true });
    this.props.sendInBank(this.props.receiverScreenName, parseFloat(this.state.amount));
  }

  bankSendValidations() {
    const validationErrors = [];
    validationErrors.push(...Validation.validateInput(Validation.TYPE.MONEY, this.state.amount));

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        this.props.addAlert(error);
      });
      return false;
    }

    if (parseFloat(this.props.balance) - parseFloat(this.state.amount) < 0) {
      this.props.addAlert("balance insufficient");
      return false;
    } 
    return true;
  }

  transactionValidations() {
    if (!this.props.personalAddress) {
      this.props.addAlert("Please get a personal address first");
      return false;
    }
    if (parseFloat(this.props.balance) - parseFloat(this.state.amount) < Config.MIN_XRP_PER_WALLET) {
      this.props.addAlert("balance insufficient");
      return false;
    } 
    const validationErrors = [];
    validationErrors.push(...Validation.validateInput(Validation.TYPE.MONEY, this.state.amount));
    validationErrors.push(...Validation.validateInput(Validation.TYPE.SECRET_KEY, this.state.secret));
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        this.props.addAlert(error);
      });
      return false;
    }
    
    return true;
  }

  preparePersonal() {
    if (!this.transactionValidations()) {
      return;
    }
    let { amount } = this.state;
    this.props.preparePersonalToBank(parseFloat(amount), this.props.personalAddress, this.props.receiverScreenName);
  }

  sendPersonal() {
    this.setState({ sendingDisabled: true });
    if (!this.transactionValidations()) {
      this.props.clearTransaction();
      return;
    }

    const { amount } = this.props.transaction;
    if (amount) {
        this.props.sendPaymentWithPersonalAddress(this.props.personalAddress, this.state.secret, parseFloat(amount));
    } 
    this.props.clearTransaction();
  }

  setUSD(usd, usdPerXRP) {
    this.setState({ usd, usdPerXRP });
  }

  // custom alert styling
  renderAlerts() {
    if (this.props.alerts.length > 0) {
      let alerts = this.props.alerts.map((alert, idx) => {
        let alertText = {
          color: "red",
          textAlign: "center"
        };
        if (alert.text === "Payment was Successful") {
          alertText.color = "lightgreen";
        } else if (alert.text === "sending payment...") {
          alertText.color = "gray";
        }
        return (
          <Text style={alertText} key={idx}>{alert.text.toLowerCase()}</Text>
          );
        });
        return alerts[alerts.length-1];
      }
  }

  topContainer() {
    let balance = Util.truncate(this.props.balance, 2);
    return (
      <View style={styles.topContainer}>
        <CustomBackButton handlePress={() => this.props.navigator.pop({
          animationType: 'fade'
        })} />
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTextField}>
            balance:
            </Text>
          <Text style={styles.balanceText}>
            Ʀ{balance}
          </Text>
        </View>
      </View>
    );
  }

  passwordLock() {
    let usd = Util.truncate(this.state.usd, 2);
    return (
      <View style={styles.container}>
        {this.topContainer()}
        <View style={styles.usdContainer}>
          <Text style={styles.usd}>${usd}</Text>
        </View>
        <PasswordLock enableSending={this.enableSending} />
        <View style={styles.alert}>
          {this.renderAlerts()}
        </View>
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

  render() {
    if (this.state.sendingDisabled === true) {
      return (
          this.passwordLock()
      );
    } 

    let usd = (
      <Text style={styles.usd}>${this.state.usd}</Text>
    );
    if (this.state.amount) {
      usd = (
        <View>
          <Text style={styles.usd}>${Util.truncate(this.state.usdPerXRP * this.state.amount, 2)}</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
      {this.topContainer()}
        <View style={styles.usdContainer}>
          {usd}
        </View>
      <View style={styles.amount}>
        <CustomInput
          placeholder="Amount"
          onChangeText={
            (amt) => {
              getXRPtoUSD(this.props.balance, this.setUSD);
              this.setState({ amount: amt });
            }
          }
          autoCorrect={false}
          autoFocus={true}
          placeholderTextColor="#6D768B"
          autoCapitalize={'none'}
          keyboardType={'decimal-pad'}
          keyboardAppearance={'dark'} />
      </View>
      { this.renderSecretField() }
      <View style={styles.paymentButton}>
        <CustomButton
          performAction={`pay ${this.props.receiverScreenName}`}
          buttonColor={this.state.sendingDisabled ? "red" : "white"}
          isDisabled={this.state.sendingDisabled}
          handlePress={this.props.activeWallet === Config.WALLETS.BANK_WALLET ? this.sendPayment : this.preparePersonal}
        />
      </View>
      <View style={styles.alert}>
        {this.renderAlerts()}
      </View>
    </View>
    );
  }
}

// define your styles
const { width, height } = Dimensions.get('screen');
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
    marginTop: -20
  },
  title: {
   textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'AppleSDGothicNeo-Light',
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
    fontFamily: 'AppleSDGothicNeo-Light',
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
    fontFamily: 'AppleSDGothicNeo-Light'
  },
  balanceTextField: {
    textAlign: 'center',
    fontSize: 11,
    color: 'white',
    fontFamily: 'AppleSDGothicNeo-Light',
    marginTop: 9,
    marginRight: 10
  },
  alert: {
    marginTop: -10
  },
  usdContainer: {
    paddingRight: 35,
  },
  usd: {
    textAlign: "right",
    fontFamily: 'AppleSDGothicNeo-Light',
    fontSize: 16,
    color: "white"
  }
});

export default BankSend;
