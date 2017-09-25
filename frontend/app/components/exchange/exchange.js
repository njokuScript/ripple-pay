// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import transitionContainer from './transitionContainer';
import Icon from 'react-native-vector-icons/Entypo';
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

  navSendRipple() {
    window.clearTimeout(this.timer);
    this.props.navigator.push({
      title: 'SendRipple',
      component: sendRippleContainer,
      navigationBarHidden: true
    });
  }

  navTransition(coin, dir) {
    window.clearTimeout(this.timer);
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
      title: 'Transition',
      component: transitionContainer,
      navigationBarHidden: true,
      passProps: {toCoin: toCoin, fromCoin: fromCoin, clearSendAmount:this.props.clearSendAmount}
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

              <View style={styles.coinType}>
                <Image
                  style={{width: 40, height: 40}}
                  source={{uri: myCoins[coin].image}}
                />
               <Text style={styles.coinFont}>{myCoins[coin].name}</Text>
              </View>

              <Text onPress={this.navSendRipple.bind(this)} style={styles.coinFont}>Send</Text>
              <Text onPrss={this.navWallet.bind(this)} style={styles.coinFont}>Receive</Text>
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

                <View style={styles.coinType}>
                <Image
                  style={{width: 40, height: 40}}
                  source={{uri: myCoins[coin].image}}
                />
                <Text style={styles.coinFont}>{myCoins[coin].name}</Text>
              </View>

              <Text style={styles.coinFont}>{line}</Text>
              <Text onPress={()=> this.navTransition(coin, 'send')} style={styles.coinFont}>Send</Text>
              <Text onPress={()=> this.navTransition(coin, 'receive')} style={styles.coinFont}>Receive</Text>
            </View>
          ));
          return;
        }
        showCoins.push(
          <View style={styles.coin} key={idx}>
              <View style={styles.coinType}>
                <Image
                  style={{width: 40, height: 40}}
                  source={{uri: myCoins[coin].image}}
                />
                <Text style={styles.coinFont}>{myCoins[coin].name}</Text>
              </View>

            <Text style={styles.coinFont}>{line}</Text>
              <Text onPress={()=> this.navTransition(coin, 'send')} style={styles.coinFont}>Send</Text>
              <Text onPress={()=> this.navTransition(coin, 'receive')} style={styles.coinFont}>Receive</Text>
          </View>
        );
      });
    }
    else
    {
      showCoins = (
        <View>Loading...</View>
      );
    }
    return (
      <ScrollView style={styles.coinsContainer}>
        {showCoins}
      </ScrollView>
    );
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

        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => this.setState({direction: !this.state.direction})}>
            <Text style={styles.directions}>Change Directions</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {this.allCoins()}
      </ScrollView>

      <View>
        <Tabs style={styles.tabs} selected={this.state.page}>

          <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
            <Text style={styles.tabFont}><Icon name="home" size={30} color="white" /></Text>
          </TouchableOpacity>
          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
            <Text style={styles.tabFont}><Icon name="magnifying-glass" size={30} color="white" /></Text>
          </TouchableOpacity>
          <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
            <Text style={styles.tabFont}><Icon name="wallet" size={30} color="white" /></Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.tabFont}><Icon name="swap" size={30} color="white" /></Text>
          </TouchableOpacity>
        </Tabs>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    paddingTop: 10,
  },
  coinsContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  coins: {
    flex: 1,
    fontFamily: 'Kohinoor Bangla',
  },
  coin: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 2,
      paddingLeft: 15,
      paddingTop: 15.65,
      paddingBottom: 15.65,
      borderBottomWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: 'white',
      width: 345,
      marginLeft: 15
  },
  coinType: {
    flex: 1,
    // justifyContent: 'center'
  },
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     backgroundColor: 'white'
   },
   coinFont: {
     fontWeight: "600",
     fontSize: 15,
     fontFamily: 'Kohinoor Bangla',
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
