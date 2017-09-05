import React from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import { unauthUser } from '../../actions';
import Icon from 'react-native-vector-icons/Entypo';
import Tabs from 'react-native-tabs';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    NavigatorIOS
  } from 'react-native';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
    this.state = {page: 'cloud'};
    this.displayTransactions = this.displayTransactions.bind(this);
  }

  onLogout() {
    this.props.unauthUser();
  }
  //Before we were checking if this was ===0 but this is always falsey in javascript so i did > 0 instead
  displayTransactions() {
    if (this.props.transactions.length > 0) {
      //Jon - You were talking about some way to allow scrolling here so you can scroll through the transactions.
      let ndate;
      const transactions = this.props.transactions.map((transaction, idx) => {
        ndate = new Date(transaction.date);
        return (
          <View style={styles.transaction} key={idx}>
            <Text style={styles.transactionFont}>{transaction.otherParty}</Text>
            <Text style={styles.transactionFont}>{ndate.toString()}</Text>
            <Text style={styles.transactionFont}>{transaction.amount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}</Text>
          </View>
        );
      });

      return (
        <View style={styles.transactionContainer}>
          {transactions}
        </View>
      );
    } else {
      return (
        <View style={styles.transaction}>
          <Text style={styles.transactionFont}>no transactions</Text>
        </View>
      );
    }
  }

  // After the component has mounted with 0 for balance and and [] for transactions, we go to the database
  // with this thunk action creator to make sure this is indeed the same or if there are transactions or a balance or if not.
  componentDidMount() {
    this.props.requestTransactions(this.props.user);
  }

  navSearch() {
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }

  navWallet() {
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
      navigationBarHidden: true
    });
  }

  navExchange() {
    this.props.navigator.push({
      title: "Exchange",
      component: ExchangeContainer,
      navigationBarHidden: true
    });
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

      {/* <View> */}
        <ScrollView style={styles.transactionsContainer}>
            {this.displayTransactions()}
        </ScrollView>
      {/* </View> */}

      <View>
        <Tabs style={styles.tabs} selected={this.state.page} onSelect={el=>this.setState({page:el.props.name})}>
          <TouchableOpacity>
              <Text style={styles.tabFont}><Icon name="home" size={30} color="white" /></Text>
          </TouchableOpacity>
          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)} >
              <Text style={styles.tabFont}><Icon name="magnifying-glass" size={30} color="white" /></Text>
              </TouchableOpacity>
          <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
              <Text style={styles.tabFont}><Icon name="wallet" size={30} color="white" /></Text>
          </TouchableOpacity>
          <TouchableOpacity name="Stream" onPress={this.navExchange.bind(this)}>
              <Text style={styles.tabFont}><Icon name="swap" size={30} color="white" /></Text>
          </TouchableOpacity>
        </Tabs>
      </View>

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
     backgroundColor: '#111F61'
   },
  topContainer: {
    flex: -1,
    backgroundColor: '#111F61',
    // backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100,
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
    transactionsContainer: {
      // flex: 1,
    },
    transactions: {
      // flex: 1,
      fontFamily: 'Kohinoor Bangla',
    },
    transaction: {
      padding: 2,
      paddingLeft: 15,
      paddingTop: 15,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: 'white',
    },
    tabFont: {
      color: 'white',
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
    signOut: {
      transform: [{ rotate: '180deg' }]
    }
});

export default Home;
