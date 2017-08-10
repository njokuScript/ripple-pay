import React from 'react';
import SearchContainer from '../search/search';
import Wallet from '../wallet/wallet';
import { unauthUser } from '../../actions';
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
  }

  onLogout() {
    this.props.unauthUser();
  }

  //After the component has mounted with 0 for balance and and [] for transactions, we go to the database
  //with this thunk action creator to make sure this is indeed the same or if there are transactions or a balance or if not.

  componentDidMount() {
    this.props.requestTransactions(this.props.user);
  }

  navSearch() {
    //  <SearchContainer /> ;
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }

  navWallet() {
    this.props.navigator.push({
      title: 'Wallet',
      component: Wallet
    });
  }


  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={this.navWallet.bind(this)}>
            <Image style={{width: 30, height: 30}} source={require('./deposit.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.navSearch.bind(this)}>
            <Image
              style={{ width: 30, height: 30 }} source={require('./sendRequest.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.xrpDisplay}>
            {this.props.balance} XRP
          </Text>
        </View>
        <View style={styles.transactions}>
          <Text style={styles.xrpDisplay}>
            {this.props.transactions || []}
          </Text>
        </View>
         {/* temp logout button for develpment */}
          <View style={styles.navContainer}>
            <TouchableOpacity onPress={this.onLogout}>
              <Text>logout</Text>
            </TouchableOpacity>
         </View>
      </View>
    );
  }
}

// define your styles
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1/4,
    backgroundColor: '#335B7B',
  },
  image: {
    resizeMode: 'contain'
  },
  nav: {
    flex: 1/16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  profileContainer: {
  flex: 1,
  alignItems: 'center'
},
  xrpDisplay: {
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    fontSize: 25
  }
});

export default Home;
