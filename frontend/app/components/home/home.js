import React from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import { unauthUser } from '../../actions';
import Icon from 'react-native-vector-icons/Entypo';
import Tabs from 'react-native-tabs';
import StartApp from '../../index.js';
import Transaction from '../presentationals/transaction';
import TopTabs from '../presentationals/topTabs';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    RefreshControl
  } from 'react-native';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
    this.displayTransactions = this.displayTransactions.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.starter = new StartApp();
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      refreshing: false,
      pressed: true,
    }
    this.onRefresh = this.onRefresh.bind(this);
  }

  //Once this screen appears, all the of transactions are requested
  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      this.props.requestTransactions(this.props.user);
    }
  }

  onRefresh(){
    this.setState({refreshing: true});
    this.props.requestTransactions(this.props.user).then(() => {
      this.setState({refreshing: false});
    })
  }

  onLogout() {
    this.props.unauthUser();
    this.starter.startSingleApplication();
  }

  handlePress() {
    this.setState({
      pressed: !this.state.pressed
    })
  }
  //Before we were checking if this was ===0 but this is always falsey in javascript so i did > 0 instead
  displayTransactions() {
    if (this.props.transactions.length > 0) {
      let ndate;
      let transactions = this.props.transactions.sort((a,b)=>{
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      transactions = transactions.map((transaction, idx) => {
        ndate = new Date(transaction.date);
        return (
          <Transaction
            key={idx}
            otherParty={transaction.otherParty}
            ndate={ndate}
            amount={transaction.amount}
            transactionColor={transaction.amount < 0 ? "red" : "green"}
          />
        );
      });
      return (
        <ScrollView style={styles.transactionsContainer}>
          {transactions}
        </ScrollView>
      );
    } else {
      return (
        <Transaction
          otherParty="no transactions"
        />
      );
    }
  }

// THE REGEX IS BEING USED TO TRUNCATE THE LENGTH OF THE BALANCE TO 2 DIGITS WITHOUT ROUNDING
  render()
  {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>

          <View style={styles.signOut}>
            <TouchableOpacity onPress={this.onLogout}>
              <Icon name="log-out" size={20} color="white"/>
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              Balance & Transactions
            </Text>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              {this.props.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
            </Text>
          </View>
      </View>

      <TopTabs handlePress={this.handlePress} pressed={this.state.pressed}/>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}/>
        }
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={styles.scrollViewContainer}>
        {this.displayTransactions()}
      </ScrollView>
      </View>
    );
  }
}

// define your styles
const { width, height } = Dimensions.get('window');
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
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    paddingTop: 10,
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
  balanceContainer: {
    borderRadius: 50,
    borderColor: 'white',
    backgroundColor: 'rgba(53, 58, 83, .5)',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
   balanceText: {
     textAlign: 'center',
     fontSize: 16,
     color: 'white',
     fontFamily: 'Kohinoor Bangla'
   },
    signOut: {
      transform: [{ rotate: '180deg' }],
      marginBottom: 3
    },
    transactionsContainer: {
      marginBottom: 75,
      // marginTop: -5
    },
});

export default Home;
