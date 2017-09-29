// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import sendAmountContainer from './sendAmountContainer';
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
      time: 600000
    }
    this.toThisAmount = "";
    this.fromThisAmount = "";
    this.action = this.props.toCoin === "XRP" ? "deposit" : "withdraw";
    this.renderButton = this.renderButton.bind(this);
    this.sendPayment = this.sendPayment.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      let that = this;
      this.props.requestMarketInfo(this.props.fromCoin, this.props.toCoin);
      let pair = `${this.props.fromCoin.toLowerCase()}_${this.props.toCoin.toLowerCase()}`;
      if ( this.props.quoted )
      {
        this.timer = window.setInterval(function(){
          if ( that.state.time === 1000 )
          {
            that.props.navigator.switchToTab({
              tabIndex: 0
            });
          }
          that.setState({time: that.state.time - 1000})
        },1000);
        this.props.sendAmount(this.props.amount, this.props.withdrawal, pair, this.props.returnAddress, this.props.destTag);
      }
      else
      {
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
    else if (event.id === "didDisappear"){
      this.props.clearSendAmount();
      clearInterval(this.timer);
    }
  }

  renderButton(){
    if ( this.props.action === 'withdraw' && this.state.pushed === false )
    {
      return(
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.sendPayment}>
            <Text style={styles.button}>
              Withdraw
            </Text>
          </TouchableOpacity>
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
      this.props.userId
    );
    this.props.clearSendAmount();
  }


//Maybe give these the indexes that they are suppose to have.
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {this.props.action.charAt(0).toUpperCase() + this.props.action.slice(1)} {this.props.toCoin} - {this.props.quoted ? "Precise" : "Approximate"}
              </Text>
            </View>
            <View>
              <Text style={styles.whitetext}>Fee: {this.props.shape.market.minerFee} {this.props.toCoin}</Text>
              <Text style={styles.whitetext}>Send Minimum: {this.props.shape.market.minimum} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>Send Maximum: {this.props.quoted ? this.props.shape.sendamount.maxLimit : this.props.shape.market.maxLimit} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>{this.props.fromCoin} Deposit Address: {this.props.shape.sendamount.deposit}</Text>
              <Text style={styles.whitetext}>{this.props.toCoin} Withdraw Address: {this.props.withdrawal}</Text>
              <Text style={styles.whitetext}>Deposit Amount: {this.props.quoted ? this.props.shape.sendamount.depositAmount : this.props.fromAmount} {this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>Withdraw Amount: {this.props.amount} {this.props.toCoin}</Text>
              <Text style={styles.whitetext}>Quoted Rate: {this.props.shape.sendamount.quotedRate} {this.props.toCoin}/{this.props.fromCoin}</Text>
              <Text style={styles.whitetext}>XRP Dest Tag: {this.props.shape.sendamount.xrpDestTag}</Text>
              <Text style={styles.whitetext}>Time Left: {new Date(this.state.time).toISOString().substr(14,5)}</Text>
            </View>
            {this.renderButton()}
          </View>
        );
      }
    }
  }

// define your styles
const styles = StyleSheet.create({
  coinsContainer: {
    flex: 1,
    // marginTop: 20,
    backgroundColor: 'white'
  },
  whitetext: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10
  },
  coins: {
    flex: 1,
    fontFamily: 'Kohinoor Bangla',
  },
  coin: {
    padding: 2,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    backgroundColor: 'white',
  },
  textInput: {
    height: 26,
    fontFamily: 'Kohinoor Bangla'
  },
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#111F61',
   },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: '#111F61'
  },
  field: {
    borderRadius: 5,
    padding: 5,
    paddingLeft: 8,
    margin: 45,
    marginTop: 0,
    top: 40,
    backgroundColor: '#fff'
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

  buttonContainer: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 30
  },
  button: {
    fontSize: 30,
    fontFamily: 'Kohinoor Bangla',
    borderWidth: 1,
    borderRadius: 6,
    color: 'white',
    borderColor: 'white',
    // borderColor: 'green',
    borderBottomWidth: 0,
    shadowOpacity: 0.3,
    padding: 7
  },
  formError: {
    color: 'red'
  },
  tabFont: {
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
  },
  tabs: {
    backgroundColor: '#111F61',
    borderColor: '#d3d3d3',
    position: 'absolute',
    paddingTop: 15,
    paddingBottom: 10,
    height: 75
  }
});

//make this component available to the app
export default SendAmount;
