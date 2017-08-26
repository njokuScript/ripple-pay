// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
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
class Exchange extends Component {
  constructor(props){
    super(props);
    this.state = {
      direction: true,
      fromAmount: "",
      toAmount: "",
      address: ""
    }
    this.toThisAmount = "";
    this.fromThisAmount = "";
  }

  componentDidMount(){
    this.props.requestMarketInfo(this.props.fromCoin, this.props.toCoin)
  }

  // componentWillUnmount(){
  //   window.clearTimeout(this.timer);
  // }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  //Whenever we navigate away from this page we are getting rid of the pinger to shapeshifter api.
  navWallet() {
    window.clearTimeout(this.timer);
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
      navigationBarHidden: true
    });
  }

  navSearch() {
    window.clearTimeout(this.timer);
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }

  navHome() {
    window.clearTimeout(this.timer);
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  componentDidUpdate(oldProps, oldState){
    if ( oldState.fromAmount !== this.state.fromAmount )
    {
      let x = this.state.fromAmount === "" ? "" : parseFloat(this.state.fromAmount) * this.props.shape.market.rate
      this.setState({toAmount: x.toString()});
    }
    else if (oldState.toAmount !== this.state.toAmount)
    {
      let y = this.state.toAmount === "" ? "" : (parseFloat(this.state.toAmount) / this.props.shape.market.rate)
      this.setState({fromAmount: y.toString()});
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
        <View style={styles.field}>
          <TextInput
            placeholder="From Amount"
            onChangeText={
              (amt) => {
                this.setState({fromAmount: amt});
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
                this.setState({toAmount: amt});
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
            placeholder={this.props.toCoin === "XRP" ? "Return Address -- Recommended" : "Send To Address"}
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
        <TouchableOpacity onPress={() => this.setState({direction: !this.state.direction})}>
          <Text>Change Directions</Text>
        </TouchableOpacity>
        <View>
          <Text>Rate: {this.props.shape.market.rate}</Text>
          <Text>Fee: {this.props.shape.market.minerFee} {this.props.toCoin}</Text>
          <Text>Send Minimum: {this.props.shape.market.minimum}</Text>
          <Text>Send Maximum: {this.props.shape.market.maxLimit}</Text>
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
    padding: 20,
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
    borderColor: 'green',
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
export default Exchange;
