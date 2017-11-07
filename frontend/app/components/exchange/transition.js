// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import sendAmountContainer from './sendAmountContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
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
class Transition extends Component {
  constructor(props){
    super(props);
    this.state = {
      direction: true,
      fromAmount: "",
      toAmount: "",
      editFromAmount: false,
      editToAmount: false,
      address: "",
      quoted: true
    }
    this.navSendAmount = this.navSendAmount.bind(this);
    this.toThisAmount = "";
    this.fromThisAmount = "";
    this.action = this.props.toCoin === "XRP" ? "deposit" : "withdraw";
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      this.props.requestMarketInfo(this.props.fromCoin, this.props.toCoin);
      this.props.requestOldAddress(this.props.user.user_id);
      this.props.requestAllWallets(this.props.user.user_id);
    }
    else if (event.id === "bottomTabSelected")
    {
      this.props.navigator.resetTo({
        screen: 'Exchange',
        navigatorStyle: {navBarHidden: true}
      })
    }
  }

  // componentWillUnmount(){
  //   window.clearTimeout(this.timer);
  // }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  //Whenever we navigate away from this page we are getting rid of the pinger to shapeshifter api.

  navSendAmount() {
    console.log("i got pushed");
    if ( this.state.fromAmount > this.props.shape.market.maxLimit )
    {
      this.props.addAlert(`Please ${this.action} less than the maximum allowed`);
      return;
    }
    else if (this.state.fromAmount < this.props.shape.market.minimum){
      this.props.addAlert(`Please ${this.action} more than the minimum allowed`);
      return;
    }
    if ( this.action === "deposit" )
    {
      this.returnAddress = this.state.address;
      if ( this.props.user.wallets.length > 0 && this.props.user.cashRegister )
      {
        this.withdrawalAddress = this.props.user.cashRegister;
        this.theDestTag = this.props.user.wallets[this.props.user.wallets.length-1];
      }
      else
      {
        this.props.addAlert("Please Get a Wallet First");
        return;
      }
    }
    else
    {
      this.withdrawalAddress = this.state.address;
      if ( this.props.user.wallets.length > 0 && this.props.user.cashRegister)
      {
        this.returnAddress = this.props.user.cashRegister;
        this.theDestTag = this.props.user.wallets[this.props.user.wallets.length-1];
      }
      else
      {
        this.props.addAlert("Please Get a Wallet First");
        return;
      }
    }
    this.props.navigator.push({
      screen: 'SendAmount',
      navigatorStyle: {navBarHidden: true},
      passProps: {
                 withdrawal: this.withdrawalAddress,
                 returnAddress: this.returnAddress,
                 destTag: this.theDestTag,
                 fromCoin: this.props.fromCoin,
                 toCoin: this.props.toCoin,
                 amount: this.state.toAmount,
                 fromAmount: this.state.fromAmount,
                 action: this.action,
                 userId: this.props.user.user_id,
                 quoted: this.state.quoted,
                 addAlert: this.props.addAlert,
                 clearSendAmount: this.props.clearSendAmount
               }
    });
  }

  componentDidUpdate(oldProps, oldState){
    if ( this.state.editToAmount  )
    {
      let x = this.state.fromAmount === "" ? "" : parseFloat(this.state.fromAmount) * this.props.shape.market.rate;
      this.setState({toAmount: x.toString(), editFromAmount: false, editToAmount: false});
    }
    else if ( this.state.editFromAmount )
    {
      let y = this.state.toAmount === "" ? "" : (parseFloat(this.state.toAmount) / this.props.shape.market.rate);
      this.setState({fromAmount: y.toString(), editFromAmount: false, editToAmount: false});
    }
  }

//Maybe give these the indexes that they are suppose to have.
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            From {this.props.fromCoin}
          </Text>
        </View>
        <TouchableOpacity onPress={() => this.setState({quoted: !this.state.quoted})}>
          <Text style={styles.whitetext}>{this.state.quoted ? "Quoted - Exact Amount" : "Quick - Approximate"}</Text>
        </TouchableOpacity>
        <CustomInput
          placeholder="From Amount"
          placeholderTextColor="#6D768B"
          onChangeText={
            (amt) => {
              this.setState({fromAmount: amt, editFromAmount: false, editToAmount: true});
            }
          }
          autoCorrect={false}
          value={this.state.fromAmount}
          autoCapitalize={'none'}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            To {this.props.toCoin}
          </Text>
        </View>
        <CustomInput
          placeholder="To Amount"
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
          placeholder={this.action === "deposit" ? "Return Address -- Recommended" : "Send To Address"}
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
        <View>
          <Text style={styles.whitetext}>Rate: {this.props.shape.market.rate} {this.props.toCoin}/{this.props.fromCoin}</Text>
          <Text style={styles.whitetext}>Shapeshifter Fee: {this.props.shape.market.minerFee} {this.props.toCoin}</Text>
          <Text style={styles.whitetext}>Send Minimum: {this.props.shape.market.minimum} {this.props.fromCoin}</Text>
          <Text style={styles.whitetext}>Send Maximum: {this.props.shape.market.maxLimit} {this.props.fromCoin}</Text>
        </View>
        <CustomButton
          performAction={this.action}
          buttonColor="white"
          isDisabled={false}
          handlePress={this.navSendAmount}
        />
     </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  whitetext: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: '#111F61'
  },
  titleContainer: {
    // padding: 0,
    // alignItems: 'center',
  },
  title: {
    color: '#F2CFB1',
    fontSize: 35,
    textAlign: 'center',
    // marginTop: 20,
    // marginBottom: 20,
    // padding: 0,
    // flex: 1,
    // top: 10,
    fontFamily: 'Kohinoor Bangla'
  },
  formError: {
    color: 'red'
  },
});

//make this component available to the app
export default Transition;
