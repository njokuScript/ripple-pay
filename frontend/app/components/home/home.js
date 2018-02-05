import React from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import { getXRPtoUSD, unauthUser, addAlert } from '../../actions';
import Icon from 'react-native-vector-icons/Entypo.js';
import Transaction from '../presentationals/transaction';
import LoadMoreDataButton from '../presentationals/loadMoreDataButton';
import LoadingIcon from '../presentationals/loadingIcon';
import TopTabs from '../presentationals/topTabs';
import ChangellyTransactionView from '../presentationals/changellyTransactionView';
import AlertContainer from '../alerts/AlertContainer';
import Promise from 'bluebird';
import Util from '../../utils/util';
import Config from '../../config_enums';

import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
  StatusBar
  } from 'react-native';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
    this.displayTransactions = this.displayTransactions.bind(this);
    this.loadNextTransactions = this.loadNextTransactions.bind(this);
    this.loadNextChangellyTransactions = this.loadNextChangellyTransactions.bind(this);
    this.handleLeftPress = this.handleLeftPress.bind(this);
    this.handleRightPress = this.handleRightPress.bind(this);
    this.setUSD = this.setUSD.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      refreshing: false,
      changelly: false,
      showChange: null,
      showScreen: false,
      usd: 0,
      usdPerXRP: 0,
      personalTransactionLimit: 10
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      const initializations = [];
      if (this.props.activeWallet === Config.WALLETS.BANK_WALLET) {
        this.props.requestTransactions()
          .then(() => this.setState({showScreen: true}));
      }
      else if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
        this.props.getPersonalAddressTransactions(this.state.personalTransactionLimit)
          .then(() => this.setState({showScreen: true}));
      }
      this.props.requestChangellyTransactions();
      this.props.refreshShouldLoadMoreValues();
      this.props.clearAlerts();
    }
    if (event.id === "didDisappear") {
      this.setState({
        showScreen: false,
        personalTransactionLimit: 10
      });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.activeWallet === Config.WALLETS.BANK_WALLET && nextProps.balance) {
      getXRPtoUSD(nextProps.balance, this.setUSD);
    }
    if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET && nextProps.personalBalance) {
      getXRPtoUSD(nextProps.personalBalance, this.setUSD);
    }
  }

  onRefresh(){
    this.props.refreshShouldLoadMoreValues();
    
    this.setState({refreshing: true});
    if (this.showChangellyTransactions()) {
      this.props.requestChangellyTransactions().then(() => {
        this.setState({refreshing: false});
      });
    }
    else if (this.showNormalTransactions()) {
      if (this.props.activeWallet === Config.WALLETS.BANK_WALLET) {
        this.props.requestTransactions().then(() => {
          this.setState({refreshing: false});
          if (this.props.balance) {
            getXRPtoUSD(this.props.balance, this.setUSD);
          }
        });
      }
      else if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
        this.props.getPersonalAddressTransactions(this.state.personalTransactionLimit).then(() => {
          this.setState({ refreshing: false });
          if (this.props.personalBalance) {
            getXRPtoUSD(this.props.personalBalance, this.setUSD);
          }
        });
      }
    }
  }

  onLogout() {
    this.props.unauthUser();
  }

  handleLeftPress() {
    this.setState({
      changelly: false,
      showChange: false,
    });
  }

  handleRightPress() {
    this.setState({
      changelly: true,
      showChange: false,
    });
  }

  setUSD(usd, usdPerXRP) {
    this.setState({ usd, usdPerXRP});
  }

  loadNextTransactions() {
    if (this.props.activeWallet === Config.WALLETS.BANK_WALLET && this.props.shouldLoadMoreTransactions) {
      const { transactions } = this.props;
      const lastTransaction = transactions[transactions.length - 1];
      if (lastTransaction) {
        this.props.loadNextTransactions(lastTransaction.date);
      }
    }
    if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
      this.setState({ personalTransactionLimit: this.state.personalTransactionLimit + 10 }, () => {
        this.props.getPersonalAddressTransactions(this.state.personalTransactionLimit);
      }); 
    }
  }

  loadNextChangellyTransactions() {
    if (this.props.shouldLoadMoreChangellyTransactions) {
      const { changellyTransactions } = this.props;
      const lastChangellyTransaction = changellyTransactions[changellyTransactions.length - 1];
      if (lastChangellyTransaction) {
        this.props.loadNextChangellyTransactions(lastChangellyTransaction.date);
      }   
    }
  }

  showChangellyTransactions() {
    return this.state.changelly;
  }

  showNormalTransactions() {
    return !this.state.changelly;
  }

  showChangellyTransaction(transaction, time) {
    this.setState({
      showChange: <ChangellyTransactionView time={time} {...transaction}/>
    });
  }

  determineTransactions() {
    let transactions = [];

    if (this.showChangellyTransactions() && this.props.changellyTransactions.length > 0) {
      transactions = this.props.changellyTransactions;
    }
    if (this.showNormalTransactions()) {

      if (this.props.activeWallet === Config.WALLETS.BANK_WALLET) {
        if (this.props.transactions.length > 0) {
          transactions = this.props.transactions;
        }
      }

      if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
        if (this.props.personalTransactions.length > 0) {
          transactions = this.props.personalTransactions;
        }
      }

    }
    return transactions;
  }

  displayTransactions() {
    if (this.state.showChange) { return this.state.showChange; }

    const transactions = this.determineTransactions();

    if (transactions.length === 0) {
      return (
        <Transaction
          otherParty="no transactions"
        />
      );
    }

    const transactionComponents = transactions.map((transaction, idx) => {
      const date = new Date(transaction.date);
      let time;
      let minutes;
      if (date.getMinutes() < 10) {
        minutes = "0" + date.getMinutes();
      } else {
        minutes = date.getMinutes();
      }
      if (date.getHours() > 12) {
        time = `${date.getHours() - 12}:${minutes} PM` ;
      } else {
        time = `${date.getHours()}:${minutes} AM`;
      }
      if (this.showNormalTransactions()) {
        return (
          <Transaction
          changelly={false}
          key={idx}
          otherParty={transaction.otherParty}
          date={date}
          amount={transaction.amount}
          fromCoin={"Ʀ"}
          transactionColor={transaction.amount < 0 ? "red" : "green"}
          time={time}
          />
        );
      }
      if (this.showChangellyTransactions()) {
        return (
          <Transaction
            changelly={true}
            key={idx}
            otherParty={`${transaction.otherParty.slice(0,17)}...`}
            date={date}
            amount={transaction.from.fromAmount}
            fromCoin={transaction.from.fromCoin}
            toAmount={transaction.to.toAmount}
            toCoin={transaction.to.toCoin}
            transactionColor={transaction.from.fromCoin === "XRP" ? "red" : "green"}
            handlePress={() => this.showChangellyTransaction(transaction, time)}
            time={time}
          />
        );
      }
    });
    if (transactionComponents.length >= 10) {
      let performAction = "load more";
      if (!this.props.shouldLoadMoreTransactions) {
        performAction = "no more transactions";
      }
      transactionComponents.push(
        <View key={"7t8ui"} style={styles.loadTransactions}>
          <LoadMoreDataButton
            performAction="caret-down"
            iconColor="#2A4CED"
            isDisabled={false}
            handlePress={this.state.changelly ? this.loadNextChangellyTransactions : this.loadNextTransactions}
          />
        </View>
      );
    }
    return (
      <ScrollView style={styles.transactionsContainer}>
        { transactionComponents }
      </ScrollView>
    );
  }

  render()
  {
    if (!this.state.showScreen) {
      return (
        <LoadingIcon size="large" color="black"/>
      );
    } else {
      return (
        <View style={styles.mainContainer}>
          <StatusBar
            barStyle="light-content"
          />
          <View style={styles.topContainer}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceText}>
                Ʀ{this.props.activeWallet === Config.WALLETS.BANK_WALLET ? Util.truncate(this.props.balance, 2) : Util.truncate(this.props.personalBalance, 2)}
              </Text>
              <Text style={styles.usdText}>
                ${Util.truncate(this.state.usd, 2)}
              </Text>
              {/* <Text style={styles.usdText}>
                ${Util.truncate(this.state.usdPerXRP, 2)} = 1 XRP
              </Text> */}
            </View>
          </View>

          <TopTabs
            handleLeftPress={this.handleLeftPress}
            handleRightPress={this.handleRightPress}
            pressed={this.state.changelly}
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
          <AlertContainer />
        </View>
      );
    }
}
}

// define your styles
const { width, height } = Dimensions.get('window');
let aspectRatio = width/height;

const styles = StyleSheet.create({
  mainContainer: {
     backgroundColor: 'white'
   },
  scrollViewContainer: {
    height: height/1.3
  },
  topContainer: {
    backgroundColor: '#111F61',
    alignItems: 'center',
    height: height/5.5,
    justifyContent: "center"
  },
   balanceText: {
     textAlign: 'center',
     fontSize: 30,
     color: 'white',
     fontFamily: 'AppleSDGothicNeo-Light'
   },
   usdText: {
     textAlign: 'center',
     fontSize: 15,
     color: 'white',
     fontFamily: 'AppleSDGothicNeo-Light',
   },
  loadTransactions: {
      marginBottom: height/12
    },
});

export default Home;
