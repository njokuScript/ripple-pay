// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import transitionContainer from './transitionContainer';
import Coin from '../presentationals/coin';
import Icon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
// create a Component
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
    if ( event.id === "willAppear" )
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
      that.setState({getRates: true});
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
    this.props.navigator.push({
      screen: 'Wallet',
      navigatorStyle: { navBarHidden: true, statusBarTextColorScheme: "light"}
    });
  }

  navSendRipple() {
    this.props.navigator.push({
      screen: 'SendRipple',
      animation: true,
      animationType: 'fade',
      navigatorStyle: {
        navBarHidden: true,
      },
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
      passProps: {toCoin: toCoin, fromCoin: fromCoin},
      animation: true,
      animationType: 'fade',
      navigatorStyle: {
        navBarHidden: true,
      },
    });
  }

  // componentDidUpdate(oldProps, oldState){
  //   let alltheCoins = this.props.shape.coins;
  //   if ( alltheCoins && this.state.getRates )
  //   {
  //     Object.keys(alltheCoins).filter((cn)=> alltheCoins[cn].status === "available" && cn !== "NXT").forEach((coin)=>{
  //       this.props.requestRate(coin);
  //     })
      // this.finishAndBeginExchange();
  //   }
  // }

//Maybe give these the indexes that they are suppose to have.
  allCoins() {
    const myCoins = this.props.shape.coins;
    let theCoins;
    let line;
    let showCoins = [];
    showCoins.unshift(
      <Coin
        key="RippleOne"
        imageSource={require('./images/ripplePic.png')}
        coinName="Ripple"
        sendFunction={this.navSendRipple.bind(this) }
        receiveFunction={this.navWallet.bind(this)}
        rate=""
      />
    )
    if ( myCoins )
    {
      Object.keys(myCoins).filter((cn) => myCoins[cn].status === "available" && !["NXT", "XRP"].includes(cn)).forEach((coin, idx) => {
        if ( this.state.direction )
        {
          line = `${this.truncate(this.props.shape.rates[coin])} XRP/${myCoins[coin].symbol}`;
        }
        else
        {
          line = `${this.truncate(1/this.props.shape.rates[coin])} ${myCoins[coin].symbol}/XRP`;
        }
        if ( coin === "ETH" )
        {
          showCoins.splice(2,0, (
            <Coin
              key={idx}
              imageSource={{uri: myCoins[coin].image}}
              coinName={myCoins[coin].name}
              sendFunction={()=> this.navTransition(coin, 'send')}
              receiveFunction={()=> this.navTransition(coin, 'receive')}
              rate={line}
            />
          ));
          return;
        }
        showCoins.push(
          <Coin
            key={idx}
            imageSource={{uri: myCoins[coin].image}}
            coinName={myCoins[coin].name}
            sendFunction={()=> this.navTransition(coin, 'send')}
            receiveFunction={()=> this.navTransition(coin, 'receive')}
            rate={line}
          />
        );
      });
    }
    else
    {
      showCoins = (
        <View><Text>Loading...</Text></View>
      );
    }
    return (
      <ScrollView style={styles.coinsContainer}>
        {showCoins}
      </ScrollView>
    );
  }

  truncate(num){
    return num ? num.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0] : "";
  }

  render() {
    return (
      <View style={styles.mainContainer}>

      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            Exchange
          </Text>
        </View>

        <View style={styles.conversionContainer}>
          <TouchableOpacity onPress={() => this.setState({direction: !this.state.direction})}>
            <Text style={styles.directions}>reverse conversion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {this.allCoins()}
      </ScrollView>
     </View>
    );
  }
}

// define your styles

const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     backgroundColor: 'white'
   },
  topContainer: {
    flex: -1,
    backgroundColor: '#111F61',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: '#111F61'
  },
  logoContainer: {
    backgroundColor: '#111F61',
  },
  logo: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'Kohinoor Bangla'
  },
  directions: {
    textAlign: 'center',
    color: 'white',
    fontSize: 13,
    fontFamily: 'Kohinoor Bangla'
  },
  formError: {
    color: 'red'
  },
  tabFont: {
    fontFamily: 'Kohinoor Bangla',
  },
  tabs: {
    backgroundColor: '#111F61',
    borderColor: '#d3d3d3',
    position: 'absolute',
    paddingTop: 15,
    paddingBottom: 10,
    height: 75
  },
});

// make this component available to the app

export default Exchange;
