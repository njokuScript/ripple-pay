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
  }

  componentDidMount(){
    this.props.requestMarketInfo(this.props.fromCoin, this.props.toCoin);
    this.props.requestOldAddress(this.props.user.user_id);
    this.props.requestAllWallets(this.props.user.user_id);
  }

  // componentWillUnmount(){
  //   window.clearTimeout(this.timer);
  // }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  //Whenever we navigate away from this page we are getting rid of the pinger to shapeshifter api.
  navWallet() {
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
      navigationBarHidden: true
    });
  }

  navSearch() {
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }

  navHome() {
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  navSendAmount() {
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
      title: 'SendAmount',
      component: sendAmountContainer,
      navigationBarHidden: true,
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
                 quoted: this.state.quoted
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
          <Text>{this.state.quoted ? "Quoted - Exact Amount" : "Quick - Approximate"}</Text>
        </TouchableOpacity>
        <View style={styles.field}>
          <TextInput
            placeholder="From Amount"
            onChangeText={
              (amt) => {
                this.setState({fromAmount: amt, editFromAmount: false, editToAmount: true});
              }
            }
            autoCorrect={false}
            value={this.state.fromAmount}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            To {this.props.toCoin}
          </Text>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="To Amount"
            onChangeText={
              (amt) => {
                this.setState({toAmount: amt, editToAmount: false, editFromAmount: true});
              }
            }
            value={this.state.toAmount}
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder={this.action === "deposit" ? "Return Address -- Recommended" : "Send To Address"}
            onChangeText={
              (addr) => {
                this.setState({address: addr});
              }
            }
            value={this.state.address}
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View>
          <Text>Rate: {this.props.shape.market.rate} {this.props.toCoin}/{this.props.fromCoin}</Text>
          <Text>Shapeshifter Fee: {this.props.shape.market.minerFee} {this.props.toCoin}</Text>
          <Text>Send Minimum: {this.props.shape.market.minimum} {this.props.fromCoin}</Text>
          <Text>Send Maximum: {this.props.shape.market.maxLimit} {this.props.fromCoin}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.navSendAmount}>
            <Text style={styles.button}>
              {this.action}
            </Text>
          </TouchableOpacity>
        </View>
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}>
          <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
            <Text>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
            <Text>Wallets</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Exchange</Text>
          </TouchableOpacity>
        </Tabs>
     </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  coinsContainer: {
    flex: 1,
    // marginTop: 20,
    backgroundColor: 'white'
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
     backgroundColor: '#335B7B',
   },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: '#335B7B'
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
    marginTop: 20,
    marginBottom: 20,
    padding: 0,
    flex: 1,
    top: 10,
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
    backgroundColor: '#335B7B',
    borderColor: '#d3d3d3',
    position: 'absolute',
    paddingTop: 15,
    paddingBottom: 10,
    height: 75
  }
});

//make this component available to the app
export default Transition;
