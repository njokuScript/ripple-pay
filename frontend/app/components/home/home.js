import React from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import { unauthUser } from '../../actions/authActions';
import { getXRPtoUSD } from '../../actions/coincapActions';
import Icon from 'react-native-vector-icons/Entypo.js';
import Transaction from '../presentationals/transaction';
import CustomButton from '../presentationals/customButton';
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
    this.loadNextTransactions = this.loadNextTransactions.bind(this);
    this.loadNextShapeShiftTransactions = this.loadNextShapeShiftTransactions.bind(this);
    this.handleLeftPress = this.handleLeftPress.bind(this);
    this.handleRightPress = this.handleRightPress.bind(this);
    this.setUSD = this.setUSD.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      refreshing: false,
      shapeshift: false,
      showshift: '',
      usd: 0
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  //Once this screen appears, all the of transactions are requested
  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      this.props.requestTransactions();
      this.props.requestShifts();
      this.props.refreshShouldLoadMoreValues();
    }
  }

  onRefresh(){
    this.props.refreshShouldLoadMoreValues();
    
    this.setState({refreshing: true});
    if (this.state.shapeshift) {
      this.props.requestShifts().then(() => {
        this.setState({refreshing: false});
      });
    }
    else {

      this.props.requestTransactions().then(() => {
        this.setState({refreshing: false});
      });
    }
    if (this.props.balance) {
      getXRPtoUSD(this.props.balance, this.setUSD);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.balance) {
      getXRPtoUSD(nextProps.balance, this.setUSD);
    }
  }

  onLogout() {
    this.props.unauthUser();
  }

  handleLeftPress() {
    this.setState({
      shapeshift: false,
      showshift: false,
    });
  }

  handleRightPress() {
    this.setState({
      shapeshift: true,
      showshift: false,
    });
  }

  setUSD(usd) {
    this.setState({ usd });
  }

  loadNextTransactions() {
    if (this.props.shouldLoadMoreTransactions) {
      const { transactions } = this.props;
      const lastTransaction = transactions[transactions.length - 1];
      if (lastTransaction) {
        this.props.loadNextTransactions(lastTransaction.date);
      }
    }
  }

  loadNextShapeShiftTransactions() {
    if (this.props.shouldLoadMoreShapeShiftTransactions) {
      const { shapeshiftTransactions } = this.props;
      const lastShapeShiftTransaction = shapeshiftTransactions[shapeshiftTransactions.length - 1];
      if (lastShapeShiftTransaction) {
        this.props.loadNextShapeShiftTransactions(lastShapeShiftTransaction.date);
      }   
    }
  }

  showShapeshiftTransaction(transaction, time) {
    this.setState({
      showshift: <ShapeTransactionView time={time} {...transaction}/>
    });
  }
  // Before we were checking if this was ===0 but this is always falsey in javascript so i did > 0 instead
  displayTransactions() {
    if (this.state.showshift != '') {
      return this.state.showshift;
    }
    if ((this.state.shapeshift && this.props.shapeshiftTransactions.length > 0) ||
      (!this.state.shapeshift && this.props.transactions.length > 0)) {
      let transactions;
      if (this.state.shapeshift) { 
        transactions = this.props.shapeshiftTransactions;
      }
      else{
        transactions = this.props.transactions;
      }
      transactions = transactions.map((transaction, idx) => {
        const date = new Date(transaction.date);
        let time;
        if (date.getHours() > 12) {
          time = `${date.getHours() - 12}:${date.getMinutes()} PM` ;
        } else {
          time = `${date.getHours()}:${date.getMinutes()} AM`;
        }
        if (!this.state.shapeshift) {
          return (
            <Transaction
            shapeshift={false}
            key={idx}
            otherParty={transaction.otherParty}
            date={date}
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
              date={date}
              amount={transaction.from}
              toAmount={`to ${transaction.to}`}
              transactionColor={transaction.from.match(/XRP/) ? "red" : "green"}
              handlePress={() => this.showShapeshiftTransaction(transaction, time)}
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
          otherParty="no transactions - pull down to refresh"
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

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceTextField}>
              balance:
            </Text>
            <Text style={styles.balanceText}>
              {this.props.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
            </Text>
            <Text style={styles.balanceText}>
              $ {this.state.usd}
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
      <CustomButton
        performAction="Load more transactions"
        buttonColor="white"
        isDisabled={false}
        handlePress={ this.state.shapeshift ? this.loadNextShapeShiftTransactions : this.loadNextTransactions }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 20
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
    // backgroundColor: 'rgba(53, 58, 83, .5)',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row"
  },
   balanceText: {
     textAlign: 'center',
     fontSize: 20,
     color: 'white',
     fontFamily: 'Kohinoor Bangla'
   },
  balanceTextField: {
     textAlign: 'center',
     fontSize: 11,
     color: 'white',
     fontFamily: 'Kohinoor Bangla',
     marginTop: 9,
     marginRight: 10
   },
    signOut: {
      transform: [{ rotate: '180deg' }],
      marginBottom: 3
    },
    transactionsContainer: {
      marginBottom: 75
    },
});

export default Home;
