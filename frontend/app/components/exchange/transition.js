// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import sendAmountContainer from './sendAmountContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
import CustomBackButton from '../presentationals/customBackButton';
import AlertContainer from '../alerts/AlertContainer';
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
      direction: true,
      fromAmount: "",
      toAmount: "",
      editFromAmount: false,
      editToAmount: false,
      address: "",
      quoted: true
    };
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
      this.props.requestOldAddress();
      this.props.requestAllWallets();
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
    if (this.state.fromAmount < this.props.shape.market.minimum){
      this.props.addAlert(`Please ${this.action} more than the minimum allowed`);
      return;
    }
    if (this.state.fromAmount > this.props.shape.market.maxLimit){
      this.props.addAlert(`Please ${this.action} less than the maximum allowed`);
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
    if (this.action === "withdraw" && this.withdrawalAddress === '') {
      this.props.addAlert("Please Enter a Withdrawal Address");
      return;
    }
    this.props.navigator.push({
      screen: 'SendAmount',
      navigatorStyle: { navBarHidden: true, statusBarTextColorScheme: 'light'},
      passProps: {
                 withdrawal: this.withdrawalAddress,
                 returnAddress: this.returnAddress,
                 destTag: this.theDestTag,
                 fromCoin: this.props.fromCoin,
                 toCoin: this.props.toCoin,
                 amount: this.state.toAmount,
                 fromAmount: this.state.fromAmount,
                 action: this.action,
                 quoted: this.state.quoted,
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

  toggleQuoted(){
    this.setState({quoted: !this.state.quoted});
  }

//Maybe give these the indexes that they are suppose to have.
  render() {
    return (
      <View style={styles.container}>
        <AlertContainer />
        <CustomBackButton handlePress={() => this.props.navigator.pop({
          animationType: 'fade'
        })} style={{paddingLeft: 10, marginTop: 80}} />
        <View style={{marginTop: -20}}>
          <CustomButton
            performAction={this.state.quoted ? "Quoted Transaction" : "Approx Transaction"}
            buttonColor="white"
            isDisabled={false}
            handlePress={this.toggleQuoted.bind(this)}
          />
          <View style={styles.customInputContainer}>
          <CustomInput
            placeholder={`from ${this.props.fromCoin}`}
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
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.whitetext}>Shapeshift Fee:   {this.props.shape.market.minerFee} {this.props.toCoin}</Text>
            { !this.state.quoted ? <Text style={styles.whitetext}>Send Minimum:   {this.props.shape.market.minimum} {this.props.fromCoin}</Text> : null }
            { !this.state.quoted ? <Text style={styles.whitetext}>Send Maximum:   {this.props.shape.market.maxLimit} {this.props.fromCoin}</Text> : null }
            <Text style={styles.whitetext}>Rate:   {this.props.shape.market.rate} {this.props.toCoin}/{this.props.fromCoin}</Text>
          </View>
          <CustomButton
            performAction={this.action === 'withdraw' ? 'Continue withdrawal...' : 'Continue deposit...'}
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
