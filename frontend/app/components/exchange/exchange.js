// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import AlertContainer from '../alerts/AlertContainer';
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
import ExchangeConfig from './exchange_enums';

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
      conversionDirection: ExchangeConfig.CONVERSION_DIRECTION.RIPPLE_PER_OTHER_COIN,
      orderedCoins: [],
      rippleCoin: {},
      getCoinsFirstTime: true
    };
    this.timer = undefined;
    this.navTransition = this.navTransition.bind(this);
    this.reverseConversionDirection = this.reverseConversionDirection.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      this.setState({
        getCoinsFirstTime: true
      });
      this.props.requestAllCoins();
    }
    else if (event.id === "didDisappear")
    {
      this.setState({
        getCoinsFirstTime: true
      });
      window.clearInterval(this.timer);
    }
  }

  componentWillReceiveProps(newProps) {
    if (!Util.isEmpty(newProps.changelly.totalCoinsObj) && this.state.getCoinsFirstTime) {
      const changellyCoinSet = newProps.changelly.totalCoinsObj;
      this.props.getAllCoinData(changellyCoinSet).then(() => {
        this.setState({
          getCoinsFirstTime: false
        }, () => {
          this.getRates();
          // get rates every minute
          this.timer = window.setInterval(() => {
            this.getRates();
          }, 60000);
        });
      });
    }
  }

  getRates() {
    return this.props.getRates(this.props.changelly.orderedCoins);
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
    if ( dir === ExchangeConfig.PAYMENT_DIRECTION.SENDING_RIPPLE ) {
      toCoin = coin;
      fromCoin = 'XRP';
    }
    else if (dir === ExchangeConfig.PAYMENT_DIRECTION.RECEIVING_RIPPLE) {
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

  displayRate(coinSymbol, coin) {
    if (!coin) {
      return '';
    }
    if (this.state.conversionDirection === ExchangeConfig.CONVERSION_DIRECTION.RIPPLE_PER_OTHER_COIN) {
      return `${Util.truncate(coin["XRP"], 5)} XRP/${coinSymbol}`;
    }
    else if (this.state.conversionDirection === ExchangeConfig.CONVERSION_DIRECTION.OTHER_COIN_PER_RIPPLE) {
      return `${Util.truncate((1 / coin["XRP"]), 5)} ${coinSymbol}/XRP`;
    }
  }

  allCoins() {
    const { orderedCoins, totalCoinsObj } = this.props.changelly;

    let displayCoins = [];
    const rippleCoin = totalCoinsObj["XRP"];

    displayCoins.push(
      <Coin
        key="RippleOne"
        imageSource={require('./images/ripplePic.png')}
        perc={rippleCoin ? rippleCoin.perc : null}
        marketCap={rippleCoin ? rippleCoin.mktcap : null}
        coinSymbol="XRP"
        coinName="Ripple"
        sendFunction={this.navSendRipple.bind(this) }
        receiveFunction={this.navWallet.bind(this)}
        rate=""
      />
    );

    if ( orderedCoins.length > 0 )
    {
      orderedCoins.forEach((coinSymbol, idx) => {

        const coin = totalCoinsObj[coinSymbol];
        const rateDisplay = this.displayRate(coinSymbol, coin);

        const baseImageUrl = "https://www.cryptocompare.com";
        let imageUrl;

        if (coin) {
          imageUrl = baseImageUrl + coin.ImageUrl;
        } else {
          imageUrl = "https://www.jainsusa.com/images/store/landscape/not-available.jpg";
        }

        displayCoins.push(
          <Coin
            key={idx}
            imageSource={{ uri: imageUrl }}
            perc={totalCoinsObj[coinSymbol].perc}
            marketCap={totalCoinsObj[coinSymbol].mktcap}
            coinSymbol={coinSymbol}
            coinName={coin.fullName}
            sendFunction={()=> this.navTransition(coinSymbol, ExchangeConfig.PAYMENT_DIRECTION.SENDING_RIPPLE)}
            receiveFunction={()=> this.navTransition(coinSymbol, ExchangeConfig.PAYMENT_DIRECTION.RECEIVING_RIPPLE)}
            rate={rateDisplay}
          />
        );
      });
    } else {
      displayCoins.push(
        <LoadingIcon 
          key="loadIcon" 
          size="large" 
          color="black" 
        />
      );
    }
    
    return (
      <ScrollView style={styles.coinsContainer}>
        {displayCoins}
      </ScrollView>
    );
  }

  reverseConversionDirection() {
    if (this.state.conversionDirection === ExchangeConfig.CONVERSION_DIRECTION.RIPPLE_PER_OTHER_COIN) {
      this.setState({
        conversionDirection: ExchangeConfig.CONVERSION_DIRECTION.OTHER_COIN_PER_RIPPLE
      });
    } else {
      this.setState({
        conversionDirection: ExchangeConfig.CONVERSION_DIRECTION.RIPPLE_PER_OTHER_COIN
      });
    }
  }

  direction() {
    if (this.state.conversionDirection === ExchangeConfig.CONVERSION_DIRECTION.RIPPLE_PER_OTHER_COIN) {
      return (
        <View style={styles.conversionContainer}>
          <Text style={styles.directions}>Ʀ</Text>
          <Font name="long-arrow-right" size={width/20} color="white" />
          <Font name="bitcoin" size={width/20} color="white" />
        </View>
      );
    } else if (this.state.conversionDirection === ExchangeConfig.CONVERSION_DIRECTION.OTHER_COIN_PER_RIPPLE) {
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
          <TouchableOpacity onPress={this.reverseConversionDirection}>
            {this.direction()}
          </TouchableOpacity>
        </View>

        <ScrollView>
          {this.allCoins()}
        </ScrollView>
        <AlertContainer />
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
