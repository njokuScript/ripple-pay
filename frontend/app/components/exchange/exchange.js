// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import transitionContainer from './transitionContainer';
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
      getRates: true,
    }
    this.allCoins = this.allCoins.bind(this);
    this.finishAndBeginExchange = this.finishAndBeginExchange.bind(this);
    this.timer = undefined;
    this.navTransition = this.navTransition.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "didAppear" )
    {
      this.props.requestAllCoins();
    }
    else if (event.id === "didDisappear")
    {
      window.clearTimeout(this.timer);
    }
  }
  finishAndBeginExchange() {
    let that = this;
    this.setState({getRates: false});
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(function(){
      that.setState({getRates: true})
    },20000);
  }

  // componentWillUnmount(){
  //   window.clearTimeout(this.timer);
  // }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  //Whenever we navigate away from this page we are getting rid of the pinger to shapeshifter api.
  navWallet(){
    this.props.navigation.switchToTab({
      tabIndex: 2
    })
  }

  navSendRipple() {
    this.props.navigator.push({
      screen: 'SendRipple',
      animation: true,
      animationType: 'fade'
    });
  }

  navTransition(coin, dir) {
    let toCoin;
    let fromCoin;
    if ( dir === 'send' )
    {
      toCoin = coin;
      fromCoin = 'XRP';
    }
    else
    {
      fromCoin = coin;
      toCoin = 'XRP';
    }
    this.props.navigator.push({
      screen: 'Transition',
      // navigatorStyle: {navBarHidden: true},
      passProps: {toCoin: toCoin, fromCoin: fromCoin, clearSendAmount:this.props.clearSendAmount},
      animation: true,
      animationType: 'fade'
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

//Maybe give these the indexes that they are suppose to have.
  allCoins() {
    const myCoins = this.props.shape.coins;
    let theCoins;
    let line;
    let showCoins = [];
    if ( myCoins )
    {
      Object.keys(myCoins).filter((cn) => myCoins[cn].status === "available" && cn !== "NXT").forEach((coin, idx) => {
        if ( coin === "XRP" )
        {
          showCoins.unshift(
            <View style={styles.coin} key={idx}>
              <Text style={styles.coinFont}>{myCoins[coin].name}</Text>
                <Image
                  style={{width: 50, height: 50}}
                  source={{uri: myCoins[coin].image}}
                />
              <Text onPress={this.navSendRipple.bind(this)} style={styles.coinFont}>Send</Text>
              <Text onPress={this.navWallet.bind(this)} style={styles.coinFont}>Receive</Text>
            </View>
          )
          return;
        }
        if ( this.state.direction )
        {
          line = `${this.props.shape.rates[coin]}   XRP/${myCoins[coin].symbol}`
        }
        else
        {
          line = `${1/this.props.shape.rates[coin]}   ${myCoins[coin].symbol}/XRP`
        }
        if ( coin === "ETH" )
        {
          showCoins.splice(1,0, (
            <View style={styles.coin} key={idx}>
              <Text style={styles.coinFont}>{myCoins[coin].name}</Text>
              <Text style={styles.coinFont}>{line}</Text>
                <Image
                  style={{width: 50, height: 50}}
                  source={{uri: myCoins[coin].image}}
                />
              <Text onPress={()=> this.navTransition(coin, 'send')} style={styles.coinFont}>Send</Text>
              <Text onPress={()=> this.navTransition(coin, 'receive')} style={styles.coinFont}>Receive</Text>
            </View>
          ));
          return;
        }
        showCoins.push(
          <View style={styles.coin} key={idx}>
            <Text style={styles.coinFont}>{myCoins[coin].name}</Text>
            <Text style={styles.coinFont}>{line}</Text>
              <Image
                style={{width: 50, height: 50}}
                source={{uri: myCoins[coin].image}}
              />
              <Text onPress={()=> this.navTransition(coin, 'send')} style={styles.coinFont}>Send</Text>
              <Text onPress={()=> this.navTransition(coin, 'receive')} style={styles.coinFont}>Receive</Text>
          </View>
        );
      });
    }
    else
    {
      showCoins = (
        <View></View>
      )
    }
    return (
      <ScrollView style={styles.coinsContainer}>
        {showCoins}
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
        <TouchableOpacity onPress={() => this.setState({direction: !this.state.direction})}>
          <Text>Change Directions</Text>
        </TouchableOpacity>
        {this.allCoins()}
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
