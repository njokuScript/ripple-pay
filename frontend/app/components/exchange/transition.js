// import liraries
import React, { Component } from 'react';
import { _ } from 'lodash';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import sendAmountContainer from './sendAmountContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
import CustomBackButton from '../presentationals/customBackButton';
import ScanQR from '../presentationals/scanQR';
import AlertContainer from '../alerts/AlertContainer';
import ExchangeConfig from './exchange_enums';
import Config from '../../config_enums';
import Util from '../../utils/util';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

// create a component
class Transition extends Component {
  constructor(props){
    super(props);
    this.state = {
      fromAmount: "",
      toAmount: "",
      editFromAmount: false,
      editToAmount: false,
      address: "",
      displayQRCodeScanner: false
      // quoted: true
    };
    this.initialState = _.cloneDeep(this.state);
    this.navSendAmount = this.navSendAmount.bind(this);
    this.onQRScan = this.onQRScan.bind(this);
    this.toThisAmount = "";
    this.fromThisAmount = "";
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "willAppear" ) {

      if (this.props.toCoin === "XRP") {
        this.action = ExchangeConfig.ACTIONS.DEPOSIT;
        this.actionString = "deposit";
        this.altCoin = this.props.fromCoin;
      }
      else if (this.props.fromCoin === "XRP") {
        this.action = ExchangeConfig.ACTIONS.WITHDRAW;
        this.actionString = "withdraw";
        this.altCoin = this.props.toCoin;
      }

      this.props.requestRate(this.altCoin);
      this.props.getMinAmount(this.props.fromCoin, this.props.toCoin);
    }
    else if ( event.id === "willDisappear" ) {
      this.setState(this.initialState);
    }
  }

  processDeposit() {
    this.refundAddress = this.state.address;
    this.refundDestTag = undefined;

    if (this.props.activeWallet === Config.WALLETS.BANK_WALLET && this.props.user.wallets.length > 0) {
      this.withdrawalAddress = this.props.user.cashRegister;
      this.toDestTag = this.props.user.wallets[this.props.user.wallets.length - 1];
      return;
    }
    else if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
      this.withdrawalAddress = this.props.user.personalAddress;
      this.toDestTag = undefined;
      return;
    }

    this.props.addAlert("Please Get a Wallet First");
  }

  processWithdrawal() {
    this.withdrawalAddress = this.state.address;
    this.toDestTag = undefined;

    if (this.props.activeWallet === Config.WALLETS.BANK_WALLET && this.props.user.wallets.length > 0) {
      this.refundAddress = this.props.user.cashRegister;
      this.refundDestTag = this.props.user.wallets[this.props.user.wallets.length - 1];
      return;
    }
    else if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
      this.refundAddress = this.props.user.personalAddress;
      this.refundDestTag = undefined;
      return;
    }

    this.props.addAlert("Please Get a Wallet First");
  }

  navSendAmount() {

    if (!this.props.changelly.minimumSend.minAmount) {
      return this.props.addAlert(`Please wait for minimum amount calculation...`);
    }
    else if (this.state.fromAmount < this.props.changelly.minimumSend.minAmount){
      return this.props.addAlert(`Please ${this.actionString} more than the minimum allowed`);
    }

    if ( this.action === ExchangeConfig.ACTIONS.DEPOSIT ) {
      this.processDeposit();
    }
    else if (this.action === ExchangeConfig.ACTIONS.WITHDRAW) {
      this.processWithdrawal();
    }

    if (this.action === ExchangeConfig.ACTIONS.WITHDRAW && this.withdrawalAddress === '') {
      this.props.addAlert("Please Enter a Withdrawal Address");
      return;
    }
    const from = { fromCoin: this.props.fromCoin, fromAmount: this.state.fromAmount };
    const to = { toCoin: this.props.toCoin, toAmount: this.state.toAmount };
    console.log(from, to);
    
    this.props.createChangellyTransaction(from, to, this.withdrawalAddress, this.refundAddress, this.toDestTag, this.refundDestTag);
    this.props.navigator.push({
      screen: 'SendAmount',
      navigatorStyle: { navBarHidden: true, statusBarTextColorScheme: 'light'},
      passProps: {
        action: this.action,
        altCoin: this.altCoin
      }
    });
  }

  componentDidUpdate(oldProps, oldState){
    let toAmount, fromAmount;
    if ( this.state.editToAmount  )
    {

      if (this.action === ExchangeConfig.ACTIONS.DEPOSIT) {
        toAmount = this.state.fromAmount === "" ? "" : parseFloat(this.state.fromAmount) * this.props.changelly.rate.amount;
      }
      else if (this.action === ExchangeConfig.ACTIONS.WITHDRAW) {
        toAmount = this.state.fromAmount === "" ? "" : parseFloat(this.state.fromAmount) / this.props.changelly.rate.amount;
      }

      this.setState({toAmount: toAmount.toString(), editFromAmount: false, editToAmount: false});
    }
    else if ( this.state.editFromAmount )
    {

      if (this.action === ExchangeConfig.ACTIONS.DEPOSIT) {
        fromAmount = this.state.toAmount === "" ? "" : parseFloat(this.state.toAmount) / this.props.changelly.rate.amount;
      }
      else if (this.action === ExchangeConfig.ACTIONS.WITHDRAW) {
        fromAmount = this.state.toAmount === "" ? "" : parseFloat(this.state.toAmount) * this.props.changelly.rate.amount;
      }

      this.setState({fromAmount: fromAmount.toString(), editFromAmount: false, editToAmount: false});
    }
  }

  onQRScan(e) {
    this.setState({ address: e.data, displayQRCodeScanner: false });
  }

  render() {
    if (this.state.displayQRCodeScanner) {
      return <ScanQR handleScan={this.onQRScan} />;
    }

    return (
      <View style={styles.container}>
        <AlertContainer />
        <CustomBackButton handlePress={() => this.props.navigator.pop({
          animationType: 'fade'
        })} style={{paddingLeft: 10, marginTop: 80}} />
        <View style={{marginTop: -20}}>
          <View style={styles.customInputContainer}>
          <CustomInput
            placeholder={`from ${this.props.fromCoin}`}
            placeholderTextColor="#6D768B"
            onChangeText={
              (amt) => {
                this.setState({fromAmount: amt, editToAmount: true, editFromAmount: false});
              }
            }
            autoCorrect={false}
            value={this.state.fromAmount}
            autoCapitalize={'none'}
          />
          <CustomInput
            placeholder={`to ${this.props.toCoin}`}
            placeholderTextColor="#6D768B"
            onChangeText={
              (amt) => {
                this.setState({toAmount: amt, editToAmount: false, editFromAmount: true});
              }
            }
            value={this.state.toAmount}
            autoCorrect={false}
            autoCapitalize={'none'}
          />
          <CustomInput
            placeholder={this.action === ExchangeConfig.ACTIONS.DEPOSIT ? "Return Address -- Recommended" : "Send To Address"}
            placeholderTextColor="#6D768B"
            onChangeText={
              (addr) => {
                this.setState({address: addr});
              }
            }
            value={this.state.address}
            autoCorrect={false}
            autoCapitalize={'none'}
          />
          <Text onPress={() => { this.setState({ displayQRCodeScanner: true }); }}>SCAN QR CODE!!!</Text>
        </View>
          <View style={styles.infoContainer}>
            <Text style={styles.whitetext}>Send Minimum:   {Util.truncate(this.props.changelly.minimumSend.minAmount, 4)} {this.props.fromCoin}</Text>
            <Text style={styles.whitetext}>Rate:   {Util.truncate(this.props.changelly.rate.amount, 4)} XRP/{this.altCoin}</Text>
          </View>
          <CustomButton
            performAction={`Continue ${this.actionString}...`}
            buttonColor="white"
            isDisabled={false}
            handlePress={this.navSendAmount}
          />
        </View>
     </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  topContainer: {
    flex: -1,
    backgroundColor: '#111F61',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 90,
    paddingTop: 10
  },
  whitetext: {
    color: 'white',
    // marginTop: 10,
    fontSize: 16
  },
  redText: {
    color: 'red',
    // marginTop: 10,
    fontSize: 16
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    marginTop: -60,
    backgroundColor: '#111F61'
  },
  infoContainer: {
    marginTop: 20,
    left: 37
  },
  customInputContainer: {
    marginTop: -30
  }
});

export default Transition;
