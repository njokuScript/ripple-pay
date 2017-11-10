// import liraries
import React, { Component } from 'react';
import {connect} from 'react-redux';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import sendAmountContainer from './sendAmountContainer';
import CustomButton from '../presentationals/customButton';
import AlertContainer from '../alerts/AlertContainer';
import { makeShapeshiftTransaction } from '../../actions/authActions';
import { clearSendAmount } from '../../actions/shapeActions';
import { addAlert } from '../../actions/alertsActions';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Octicons';

// create a component
class SendAmount extends Component {
  constructor(props){
    super(props);
    this.state = {
      direction: true,
      fromAmount: "",
      toAmount: "",
      address: "",
      pushed: false,
      time: 600000,
    }
    this.toThisAmount = "";
    this.fromThisAmount = "";
    this.action = this.props.toCoin === "XRP" ? "deposit" : "withdraw";
    this.renderButton = this.renderButton.bind(this);
    this.sendPayment = this.sendPayment.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "didAppear" ) {
      console.log("hellow");
      let that = this;
      this.props.requestMarketInfo(this.props.fromCoin, this.props.toCoin);
      let pair = `${this.props.fromCoin.toLowerCase()}_${this.props.toCoin.toLowerCase()}`;
      if ( this.props.quoted ){
        this.timer = window.setInterval(function(){
          if ( that.state.time === 1000 ){
            that.props.navigator.switchToTab({
              tabIndex: 0
            });
          }
          that.setState({time: that.state.time - 1000})
        }, 1000);
        this.props.sendAmount(this.props.amount, this.props.withdrawal, pair, this.props.returnAddress, this.props.destTag);
      }
      else {
        this.props.shapeshift(this.props.withdrawal, pair, this.props.returnAddress, this.props.destTag);
      }
    }
    else if (event.id === "bottomTabSelected"){
      this.props.clearSendAmount();
      clearInterval(this.timer);
      this.props.navigator.resetTo({
        screen: 'Exchange',
        navigatorStyle: {navBarHidden: true}
      })
    }
    else if (event.id === "willDisappear"){
      this.props.clearSendAmount();
      clearInterval(this.timer);
    }
  }

  componentWillReceiveProps(newProps){
    console.log("componentreceived");
    if (newProps.shape.sendamount.deposit) {
      let otherParty = newProps.fromCoin === "XRP" ? newProps.withdrawal : newProps.returnAddress;
      otherParty = otherParty === '' ? 'Not Entered' : otherParty;
      let returnAddress = newProps.returnAddress === '' ? 'Not Entered' : newProps.returnAddress;
      newProps.makeShapeshiftTransaction(
        newProps.userId,
        `${this.truncate(newProps.shape.sendamount.depositAmount)} ${newProps.fromCoin}`,
        `${this.truncate(newProps.amount)} ${newProps.toCoin}`,
        otherParty,
        newProps.shape.sendamount.deposit,
        returnAddress,
        newProps.shape.sendamount.orderId
      )
    }
  }

  truncate(num){
    return num ? num.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0] : "";
  }

  renderButton(){
    if ( this.props.action === 'withdraw' && this.state.pushed === false )
    {
      return(
        <CustomButton
          performAction="Withdraw"
          buttonColor="white"
          isDisabled={false}
          handlePress={this.sendPayment}
        />
      )
    }
  }

  sendPayment(){
    this.setState({pushed: true});
    let depositString = this.props.shape.sendamount.deposit;
    if ( !depositString )
    {
      this.props.addAlert("There was an error in the transaction");
      return;
    }
    let toDesTag = depositString.match(/\?dt=(\d+)/)[1];
    let toAddress = depositString.match(/\w+/)[0];
    let total;
    if ( this.props.quoted )
    {
      total = this.props.shape.sendamount.depositAmount;
    }
    else
    {
      total = this.props.fromAmount;
    }
    if ( !total )
    {
      this.props.addAlert("There was an error in the transaction");
      return;
    }
    this.props.signAndSend (
      parseFloat(total),
      this.props.returnAddress,
      toAddress,
      parseInt(this.props.destTag),
      parseInt(toDesTag),
      this.props.userId
    );
    this.props.clearSendAmount();
  }

  truncate(num){
    return num ? num.toString().match(/^-?\d+(?:\.\d{0,5})?/)[0] : "";
  }

//Maybe give these the indexes that they are suppose to have.
// XRP withdraw address that ripplePay auto sends to on withdrawals is shown just
// for testing purposes
  render() {
      if ( !this.props.shape.sendamount )
      {
        return (
          <View>
            <Text>Transaction calculation failed. Please try again.</Text>
          </View>
        )
      }
      else {
        return (
          <View style={styles.container}>
            <AlertContainer />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {this.props.action.charAt(0).toUpperCase() + this.props.action.slice(1)} {this.props.toCoin} - {this.props.quoted ? "Precise" : "Approximate"}
              </Text>
              <Text style={styles.timeleft}>Time Left: {new Date(this.state.time).toISOString().substr(14,5)}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.whitetext}>Fee:   {this.props.shape.market.minerFee} {this.props.toCoin}</Text>
              <Text style={styles.whitetext}>Send Minimum:   {this.truncate(this.props.shape.market.minimum)} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>Send Maximum:   {this.props.quoted ? this.truncate(this.props.shape.sendamount.maxLimit) : this.tuncate(this.props.shape.market.maxLimit)} {this.props.fromCoin}</Text>
              { this.props.fromCoin != "XRP" ? <Text style={styles.whitetext}>{this.props.fromCoin} Deposit Address:   {this.props.shape.sendamount.deposit}</Text> : null}
              <Text style={styles.whitetext}>{this.props.toCoin} Withdraw Address:   {this.props.withdrawal}</Text>
              <Text style={styles.whitetext}>Deposit Amount:   {this.props.quoted ? this.truncate(this.props.shape.sendamount.depositAmount) : this.truncate(this.props.fromAmount)} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>Withdraw Amount:   {this.truncate(this.props.amount)} {this.props.toCoin}</Text>
              <Text style={styles.whitetext}>Quoted Rate:   {this.props.shape.sendamount.quotedRate} {this.props.toCoin}/{this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>XRP Dest Tag:   {this.props.shape.sendamount.xrpDestTag}</Text>
            </View>
            {this.renderButton()}
          </View>
        );
      }
    }
  }

// define your styles
const styles = StyleSheet.create({
  whitetext: {
    color: '#F2CFB1',
    textAlign: 'left',
    marginTop: 6,
    fontSize: 19,
  },
  timeleft: {
    color: '#F2CFB1',
    fontSize: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: '#111F61'
  },
  titleContainer: {
    padding: 0,
    alignItems: 'center',
  },
  title: {
    color: '#F2CFB1',
    fontSize: 35,
    marginTop: 40,
    // marginBottom: 20,
    // padding: 20,
    // flex: 1,
    // top: 10,
    fontFamily: 'Kohinoor Bangla'
  },
  infoContainer: {
    marginTop: 20,
    left: 20
  },
});

export default SendAmount;
