import React from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import SendContainer from '../send/sendContainer';
import { unauthUser } from '../../actions';
import Tabs from 'react-native-tabs';
import {
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

  displayTransactions() {
    if (!this.props.transactions.length === 0) {
      const transactions = this.props.transactions.map(function(transaction, idx) {
        return (
          <Text style={styles.transactions}key={idx}>{transaction}</Text>
        );
      });

      return (
        <View>
          {transactions}
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.transactions}>no transactions</Text>
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

  navSend() {
    this.props.navigator.push({
      title: "Send",
      component: SendContainer,
      navigationBarHidden: true
    });
  }

  render()
  {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              ripplePay
            </Text>
          </View>
        </View>
        <View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balance}>
                  {this.props.balance} XRP
              </Text>
            </View>
        </View>
          <View style={styles.transactionsContainer}>
              {this.displayTransactions()}
          </View>
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
            onSelect={el=>this.setState({page:el.props.name})}>
        <TouchableOpacity>
            <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity name="source" onPress={this.navSearch.bind(this)} >
          <Text>Search</Text></TouchableOpacity>
          <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
            <Text>Deposit</Text>
          </TouchableOpacity>
        <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
          <Text>Send</Text>
          </TouchableOpacity>
        </Tabs> 
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
     flexDirection: 'column',
     backgroundColor: 'white'
   },
  topContainer: {
    alignItems: 'center',
    backgroundColor: '#335B7B'
  },
  logoContainer: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: '#335B7B'
  },
  logo: {
    textAlign: 'center',
    marginTop: 25,
    color: 'white',
    fontSize: 15
  },
  balanceContainer: {
    flex: 1,
    marginTop: 10,
    width: 350,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 3,
    shadowOpacity: 1.0
  },
   balance: {
     flex: 1,
     textAlign: 'center',
     fontSize: 25,
     color: 'black',
   },
    transactionsContainer: {
      flex: 1,
      borderTopWidth: 1,
      borderColor: 'white',
      marginTop: 25,
      paddingTop: 10,
      paddingLeft: 10
    },
    transactions: {
      flex: 1,
      color: 'white'
    }
});

export default Home;
