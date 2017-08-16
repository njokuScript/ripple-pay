import React from 'react';
import SearchContainer from '../search/searchContainer';
import Wallet from '../wallet/wallet';
import SendContainer from '../send/sendContainer';
import { unauthUser } from '../../actions';
// import Icon from 'react-native-vector-icons/Octicons';
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
  //Before we were checking if this was ===0 but this is always falsey in javascript so i did > 0 instead
  displayTransactions() {
    if (this.props.transactions.length > 0) {
      console.log(this.props.transactions);
      //Jon - You were talking about some way to allow scrolling here so you can scroll through the transactions.
      const transactions = this.props.transactions.map((transaction, idx) => {
        return (
          <View style={styles.transaction} key={idx}>
            <Text style={styles.transactionFont}>{transaction.otherParty}</Text>
            <Text style={styles.transactionFont}>{transaction.date}</Text>
            <Text style={styles.transactionFont}>{transaction.amount}</Text>
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
    this.props.requestTransactions(this.props.user);
    this.props.requestAddressAndDesTag(this.props.user.user_id);
    this.props.navigator.push({
      title: 'Wallet',
      component: Wallet,
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
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>
                balance and transactions
              </Text>
            </View>
          </View>


            <View style={styles.balanceContainer}>
              <Text style={styles.balance}>
                Ʀ{this.props.balance}
              </Text>
            </View>
              <TouchableOpacity onPress={this.onLogout}>
                <Text>logout</Text>
              </TouchableOpacity>

        </View>

          <View style={styles.transactionsContainer}>
              {this.displayTransactions()}
          </View>

        <Tabs style={styles.tabs} selected={this.state.page}
            onSelect={el=>this.setState({page:el.props.name})}>
        <TouchableOpacity>
          <Text style={styles.tabFont}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity name="source" onPress={this.navSearch.bind(this)} >
            <Text style={styles.tabFont}>Search</Text>
            </TouchableOpacity>
          <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
            <Text style={styles.tabFont}>Deposit</Text>
          </TouchableOpacity>
        <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
            <Text style={styles.tabFont}>Send</Text>
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
     backgroundColor: '#335B7B'
   },
  topContainer: {
    alignItems: 'center',
    backgroundColor: '#335B7B',
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1
    // },
    // shadowRadius: 3,
    // shadowOpacity: .5,
  },
  logoContainer: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: '#335B7B',
  },
  logo: {
    textAlign: 'center',
    marginTop: 25,
    color: 'white',
    fontSize: 15,
    fontFamily: 'Kohinoor Bangla'
  },
   balance: {
     flex: 1,
     textAlign: 'center',
     fontSize: 40,
     color: 'white',
     fontFamily: 'Kohinoor Bangla'
   },
    transactionsContainer: {
      flex: 1,
      // marginTop: 20,
      backgroundColor: 'white'
    },
    transactions: {
      flex: 1,
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
      backgroundColor: '#335B7B',
      borderColor: '#d3d3d3',
      position: 'absolute',
      paddingTop: 15,
      paddingBottom: 10,
      height: 75
    }
});

export default Home;
