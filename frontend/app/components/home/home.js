import React from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import { unauthUser } from '../../actions';
import Icon from 'react-native-vector-icons/Entypo';
import StartApp from '../../index.js';
import Transaction from '../presentationals/transaction';
import TopTabs from '../presentationals/topTabs';
import ShapeTransactionView from '../presentationals/shapeTransactionView';

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
    this.handleLeftPress = this.handleLeftPress.bind(this);
    this.handleRightPress = this.handleRightPress.bind(this);
    this.starter = new StartApp();
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      refreshing: false,
      shapeshift: false,
      showshift: ''
    }
    this.onRefresh = this.onRefresh.bind(this);
  }

  //Once this screen appears, all the of transactions are requested
  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      this.props.requestTransactions();
      this.props.requestShifts();
    }
  }

  onRefresh(){
    this.setState({refreshing: true});
    if (this.state.shapeshift) {
      this.props.requestShifts().then(() => {
        this.setState({refreshing: false})
      })
    }
    else {
      this.props.requestTransactions().then(() => {
        this.setState({refreshing: false});
      })
    }
  }

  onLogout() {
    this.props.unauthUser();
    this.starter.startSingleApplication();
  }

  handleLeftPress() {
    this.setState({
      shapeshift: false,
      showshift: false,
    })
  }

  handleRightPress() {
    this.setState({
      shapeshift: true,
      showshift: false,
    })
  }

  show(transaction, time) {
    this.setState({
      showshift: <ShapeTransactionView time={time} {...transaction}/>
    })
  }
  //Before we were checking if this was ===0 but this is always falsey in javascript so i did > 0 instead
  displayTransactions() {
    if (this.state.showshift != '') {
      return this.state.showshift;
    }
    if ((this.state.shapeshift && this.props.shapeshiftTransactions.length > 0) ||
      (!this.state.shapeshift && this.props.transactions.length > 0)) {
      let ndate;
      let transactions;
      if (!this.state.shapeshift) {
        transactions = this.props.transactions.sort((a,b)=>{
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
      }
      else{
        transactions = this.props.shapeshiftTransactions;
      }
      transactions = transactions.map((transaction, idx) => {
        ndate = new Date(transaction.date);
        let time;
        if (ndate.getHours() > 12) {
          time = `${ndate.getHours() - 12}:${ndate.getMinutes()} PM` ;
        } else {
          time = `${ndate.getHours()}:${ndate.getMinutes()} AM`;
        }
        if (!this.state.shapeshift) {
          return (
            <Transaction
            shapeshift={false}
            key={idx}
            otherParty={transaction.otherParty}
            ndate={ndate}
            amount={`${transaction.amount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ`}
            transactionColor={transaction.amount < 0 ? "red" : "green"}
            time={time}
            />
          );
        }
        else {
          return (
            <Transaction
              shapeshift={true}
              key={idx}
              otherParty={`${transaction.otherParty.slice(0,17)}...`}
              ndate={ndate}
              amount={transaction.from}
              toAmount={`to ${transaction.to}`}
              transactionColor={transaction.from.match(/XRP/) ? "red" : "green"}
              handlePress={() => this.show(transaction, time)}
              time={time}
            />
          );
        }
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

      <TopTabs
        handleLeftPress={this.handleLeftPress}
        handleRightPress={this.handleRightPress}
        pressed={this.state.shapeshift}
      />

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
