// import liraries
import React, { Component } from 'react';
import {connect} from 'react-redux';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import sendAmountContainer from './sendAmountContainer';
import CustomButton from '../presentationals/customButton';
import PasswordLock from '../presentationals/passwordLock';
import AlertContainer from '../alerts/AlertContainer';
import { makeShapeshiftTransaction } from '../../actions/authActions';
import { clearSendAmount, getTimeRemaining } from '../../actions/shapeActions';
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
import Icon from 'react-native-vector-icons/Octicons';

// create a component
class SendAmount extends Component {
  constructor(props){
    super(props);
    this.toThisAmount = "";
    this.fromThisAmount = "";
    this.action = this.props.toCoin === "XRP" ? "deposit" : "withdraw";
    this.setTimer = this.setTimer.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.sendPayment = this.sendPayment.bind(this);
    this.enableSending = this.enableSending.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      direction: true,
      fromAmount: "",
      toAmount: "",
      address: "",
      pushed: false,
      time: 600000,
      sendButtonDisabled: true
    }
  }

  onNavigatorEvent(event){
    if ( event.id === "didAppear" ) {
      this.props.requestMarketInfo(this.props.fromCoin, this.props.toCoin);
      let pair = `${this.props.fromCoin.toLowerCase()}_${this.props.toCoin.toLowerCase()}`;
      if ( this.props.quoted ){
        this.props.sendAmount(this.props.amount, this.props.withdrawal, pair, this.props.returnAddress, this.props.destTag);
      }
      if (!this.props.quoted) {
        this.props.shapeshift(this.props.withdrawal, pair, this.props.returnAddress, this.props.destTag);
      }
    }
    else if (event.id === "willDisappear"){
      this.setState({
        sendButtonDisabled: true
      });
      this.props.clearSendAmount();
      clearInterval(this.timer);
      this.props.navigator.resetTo({
        screen: 'Exchange',
        navigatorStyle: {navBarHidden: true}
      })
    }
  }
  
  setTimer(time) {
    if (!time) {
      this.props.addAlert("There was a problem with shapeshift!")
      that.props.navigator.switchToTab({
        tabIndex: 0
      });
    }
    this.setState({ time }, () => {
      let that = this;
      this.timer = window.setInterval(function(){
        if ( that.state.time === 1000 ){
          that.props.navigator.switchToTab({
            tabIndex: 0
          });
        }
        that.setState({time: that.state.time - 1000})
      }, 1000);
    })
  }

  enableSending() {
    this.setState({
      sendButtonDisabled: false
    })
  }

  componentWillReceiveProps(newProps){
    if (
      this.props.shape.sendamount &&
      Object.keys(this.props.shape.sendamount).length === 0 &&
      newProps.shape.sendamount &&
      newProps.shape.sendamount.deposit
    ) {
      let otherParty = newProps.fromCoin === "XRP" ? newProps.withdrawal : newProps.returnAddress;
      otherParty = otherParty === '' ? 'Not Entered' : otherParty;
      let returnAddress = newProps.returnAddress === '' ? 'Not Entered' : newProps.returnAddress;
      newProps.makeShapeshiftTransaction(
        `${this.truncate(newProps.shape.sendamount.depositAmount)} ${newProps.fromCoin}`,
        `${this.truncate(newProps.amount)} ${newProps.toCoin}`,
        otherParty,
        newProps.shape.sendamount.deposit,
        returnAddress,
        newProps.shape.sendamount.orderId
      )
      if (this.props.quoted) {
        getTimeRemaining(newProps.shape.sendamount.deposit, this.setTimer);  
      }
    }
  }

  truncate(num){
    return num ? num.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0] : "";
  }

  renderButton(){
    if ( this.props.action === 'withdraw' && this.state.pushed === false )
    {
      return(
        <View>
          <CustomButton
            performAction="Withdraw"
            buttonColor={this.state.sendButtonDisabled ? "red" : "white"}
            isDisabled={this.state.sendButtonDisabled}
            handlePress={this.sendPayment}
          />
          <PasswordLock enableSending={this.enableSending} />
        </View>
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
    );
    this.props.clearSendAmount();
  }

  truncate(num){
    return num ? parseFloat(num).toString().match(/^-?\d+(?:\.\d{0,5})?/)[0] : "";
  }

//Maybe give these the indexes that they are suppose to have.
// XRP withdraw address that ripplePay auto sends to on withdrawals is shown just
// for testing purposes
  render() {
      if ( !this.props.shape.sendamount ) {
        return (
          <View>
            <Text>Error Making Transaction....</Text>
          </View>
        )
      }
      else if (this.props.shape.sendamount.error) {
        return (
          <View>
            <Text>Error Making Transaction because {this.props.shape.sendamount.error}</Text>
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
              {this.props.quoted ? <Text style={styles.timeleft}>Time Left: {new Date(this.state.time).toISOString().substr(14,5)}</Text> : null}
            </View>
            <ScrollView style={styles.infoContainer}>
              { this.props.fromCoin != "XRP" ? <Text style={styles.whitetext}>{this.props.fromCoin} Deposit Address:   {this.props.shape.sendamount.deposit ? this.props.shape.sendamount.deposit : 'Please Wait...' }</Text> : null}
              <Text style={styles.whitetext}>{this.props.toCoin} Withdraw Address:   {this.props.withdrawal}</Text>
              <Text style={styles.whitetext}>Send Minimum:   {this.truncate(this.props.shape.market.minimum)} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>Send Maximum:   {this.truncate(this.props.shape.market.maxLimit)} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>Deposit Amount:   {this.props.quoted ? this.truncate(this.props.shape.sendamount.depositAmount) : this.truncate(this.props.fromAmount)} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>Withdraw Amount:   {this.truncate(this.props.amount)} {this.props.toCoin}</Text>
              <Text style={styles.whitetext}>Quoted Rate:   {this.props.shape.sendamount.quotedRate} {this.props.toCoin}/{this.props.fromCoin}</Text>
              {this.props.fromCoin != "XRP" ? <Text style={styles.whitetext}>XRP Dest Tag:   {this.props.shape.sendamount.xrpDestTag}</Text> : null}
              <Text style={styles.whitetext}>Fee:   {this.props.shape.market.minerFee} {this.props.toCoin}</Text>
            </ScrollView>
            {this.renderButton()}
          </View>
        );
      }
    }
  }

// define your styles
const styles = StyleSheet.create({
  whitetext: {
    // color: '#F2CFB1',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 16,
    borderBottomWidth: 1,
    padding: 20,

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
  titleContainer: {
    flex: -1,
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
    // fontFamily: 'Kohinoor Bangla',
    // textAlign: 'center'
  },
  infoContainer: {
    marginTop: 20,
    marginLeft: 10
  },
});

export default SendAmount;
