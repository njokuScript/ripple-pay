// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import sendRippleContainer from './sendRippleContainer';
import transitionContainer from './transitionContainer';
import CustomButton from '../presentationals/customButton';
import Coin from '../presentationals/coin';
import LoadingIcon from '../presentationals/loadingIcon';
import Icon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Font from 'react-native-vector-icons/FontAwesome';
import Promise from 'bluebird';
import Util from '../../utils/util';
import { getAllMarketCoins } from '../../actions';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';

const { width, height } = Dimensions.get('window');
class Exchange extends Component {
  constructor(props){
    super(props);
    this.state = {
      direction: true,
      orderedCoins: [],
      rippleCoin: {}
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
    return this.orderCoinsByMarketRate().then((data) => {
      if (data.rippleCoin) {
        this.setState({ rippleCoin: data.rippleCoin });
      }
      if (data.orderedCoins) {
        this.setState({ orderedCoins: data.orderedCoins });      
        return Promise.each(data.orderedCoins, (coin) => {
          return this.props.requestRate(coin.symbol);
        });
      }
    });
  }

  orderCoinsByMarketRate() {
    return getAllMarketCoins()
    .then((marketCoins) => {
      const shapeShiftCoinSet = this.props.shape.coins;
      const orderedCoins = [];
      let rippleCoin = null;
      marketCoins.forEach((marketCoin) => {
        const coinSymbol = marketCoin.short;
        const shapeShiftCoin = shapeShiftCoinSet[coinSymbol];
        if (coinSymbol === "XRP") {
          rippleCoin = Object.assign({}, shapeShiftCoin, marketCoin);
          return;
        }
        if (shapeShiftCoin && shapeShiftCoin.status === "available" && coinSymbol !== "NXT") {
          orderedCoins.push(Object.assign({}, shapeShiftCoin, marketCoin));
        }
      });
      return Promise.resolve({ orderedCoins: orderedCoins, rippleCoin: rippleCoin });
    })
    .catch((err) => {
      const shapeShiftCoins = this.props.shape.coins;
      return Promise.resolve({ orderedCoins: shapeShiftCoins });
    });
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

  allCoins() {
    const { orderedCoins } = this.state;
    let theCoins;
    let rateLine;
    let showCoins = [];
    showCoins.push(
      <Coin
        key="RippleOne"
        imageSource={require('./images/ripplePic.png')}
        perc={this.state.rippleCoin.perc}
        marketCap={this.state.rippleCoin.mktcap}
        coinName="Ripple"
        sendFunction={this.navSendRipple.bind(this) }
        receiveFunction={this.navWallet.bind(this)}
        rate=""
      />
    );

    if ( orderedCoins.length > 0 )
    {
      orderedCoins.forEach((coin, idx) => {
        if ( this.state.direction )
        {
          rateLine = `${Util.truncate(this.props.shape.rates[coin.symbol], 5)} XRP/${coin.symbol}`;
        }
        else
        {
          rateLine = `${Util.truncate( (1/this.props.shape.rates[coin.symbol]), 5 )} ${coin.symbol}/XRP`;
        }

        showCoins.push(
          <Coin
            key={idx}
            imageSource={{uri: coin.image}}
            perc={coin.perc}
            marketCap={coin.mktcap}
            coinName={coin.name}
            sendFunction={()=> this.navTransition(coin.symbol, 'send')}
            receiveFunction={()=> this.navTransition(coin.symbol, 'receive')}
            rate={rateLine}
          />
        );
      });
    } else {
      showCoins.push(
        <LoadingIcon key="loadIcon" size="large" color="black" />
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
          <Font name="long-arrow-right" size={width/20} color="white" />
          <Font name="bitcoin" size={width/20} color="white" />
        </View>
      );
    } else {
      return (
      <View style={styles.conversionContainer}>
        <Font name="bitcoin" size={width/20} color="white" />
        <Font name="long-arrow-right" size={width/20} color="white" />
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

const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     backgroundColor: 'white',
   },
  topContainer: {
    backgroundColor: '#111F61',
    alignItems: 'center',
    height: height / 5.5,
  },
  conversionContainer: {
    width: width/6,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  directions: {
    color: 'white',
    fontSize: width/20,
    fontFamily: 'Kohinoor Bangla'
  }
});

export default Exchange;
