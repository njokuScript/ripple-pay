// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
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
//I DID NOT MAKE SURE THAT THE INPUT FIELDS ARE NUMBERS AND NOT LETTERS BECAUSE THIS WILL BE SOLVED WITH A NUMBERPAD LATER
class Exchange extends Component {
  constructor(props){
    super(props);
    this.state = {
      disabled: false,
      direction: true,
      getRates: true
    }
    this.allCoins = this.allCoins.bind(this);
    this.finishAndBeginExchange = this.finishAndBeginExchange.bind(this);
    this.timer = undefined;
  }

  componentDidMount(){
    this.props.requestAllCoins();
  }

  finishAndBeginExchange() {
    let that = this;
    this.setState({getRates: false});
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(function(){
      that.setState({getRates: true})
    },20000);
  }

  componentWillUnmount(){
    window.clearTimeout(this.timer);
  }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
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

  componentDidUpdate(oldProps, oldState){
    let alltheCoins = this.props.shape.coins;
    if ( alltheCoins && this.state.getRates )
    {
      Object.keys(alltheCoins).filter((cn)=> alltheCoins[cn].status === "available" && cn !== "NXT").forEach((coin)=>{
        this.props.requestRate(coin);
      })
      this.finishAndBeginExchange();
    }
  }

  allCoins() {
    const myCoins = this.props.shape.coins;
    let theCoins;
    if ( myCoins )
    {
      theCoins = Object.keys(myCoins).filter((cn) => myCoins[cn].status === "available" && cn !== "NXT").map((coin, idx) => {
        return (
          <View style={styles.coin} key={idx}>
            <Text style={styles.coinFont}>{myCoins[coin].name}</Text>
            <Text style={styles.coinFont}>{myCoins[coin].symbol}</Text>
            <Text style={styles.coinFont}>{this.props.shape.rates[coin]}</Text>
              <Image
                style={{width: 50, height: 50}}
                source={{uri: myCoins[coin].imageSmall}}
              />
          </View>
        );
      });
    }
    else
    {
      theCoins = (
        <View></View>
      )
    }
    return (
      <ScrollView style={styles.coinsContainer}>
        {theCoins}
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Exchange
          </Text>
        </View>
        {this.allCoins()}


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
