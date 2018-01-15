// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import transitionContainer from './transitionContainer';
import CustomButton from '../presentationals/customButton';
import Coin from '../presentationals/coin';
import Icon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/FontAwesome';
import Promise from 'bluebird';
import Util from '../../utils/util';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
// create a Component
class Exchange extends Component {
  constructor(props){
    super(props);
    this.state = {
      direction: true,
    };
    this.timer = undefined;
    this.navTransition = this.navTransition.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      this.props.requestAllCoins().then(() => {

        this.getRates();
        // get rates every minute
        this.timer = window.setInterval(() => {
          this.getRates();
        }, 60000);

      });
    }
    else if (event.id === "didDisappear")
    {
      window.clearInterval(this.timer);
    }
  }

  getRates() {
    let allCoins = this.props.shape.coins;
    if (allCoins) {
      Promise.each(Object.keys(allCoins), (coin) => {
        if (allCoins[coin].status === "available" && !['NXT', 'XRP'].includes(coin)) {
          return this.props.requestRate(coin);
        }
      });
    }
  }

  navWallet(){
    window.clearInterval(this.timer);
    this.props.navigator.push({
      screen: 'Wallet',
      navigatorStyle: {navBarHidden: true}
    });
  }

  navSendRipple() {
    window.clearInterval(this.timer);
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
    window.clearInterval(this.timer);
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

// Maybe give these the indexes that they are suppose to have.
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
    );
    if ( myCoins )
    {
      Object.keys(myCoins).filter((cn) => myCoins[cn].status === "available" && !["NXT", "XRP"].includes(cn)).forEach((coin, idx) => {
        if ( this.state.direction )
        {
          line = `${Util.truncate(this.props.shape.rates[coin], 5)} XRP/${myCoins[coin].symbol}`;
        }
        else
        {
          line = `${Util.truncate( (1/this.props.shape.rates[coin]), 5 )} ${myCoins[coin].symbol}/XRP`;
        }
        // this won't be good if ethereum moves in position
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

  direction() {
    if (this.state.direction) {
      return (
        <View style={styles.conversionContainer}>
          <Text style={styles.directions}>Ʀ</Text>
          <Font name="long-arrow-right" size={20} color="white" />
          <Font name="bitcoin" size={20} color="white" />
        </View>
      );
    } else {
      return (
      <View style={styles.conversionContainer}>
        <Font name="bitcoin" size={20} color="white" />
        <Font name="long-arrow-right" size={20} color="white" />
        <Text style={styles.directions}>Ʀ</Text>
      </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
            <TouchableOpacity onPress={() => this.setState({direction: !this.state.direction})}>
              {this.direction()}
            </TouchableOpacity>
        </View>

        <ScrollView>
          {this.allCoins()}
        </ScrollView>
      </View>
    );
  }
}
const { width, height } = Dimensions.get('window');
const aspectRatio = width/height;
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     backgroundColor: 'white'
   },
  topContainer: {
    flex: -1,
    backgroundColor: '#111F61',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: height/8,
    paddingTop: (height/8)/2
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#111F61'
  },
  conversionContainer: {
    width: 80,
    paddingRight: 15,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  directions: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
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
