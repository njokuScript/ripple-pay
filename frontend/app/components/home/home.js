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
    })
  }

  render()
  {
    return (
      <View style={styles.mainContainer}>
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
            selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>
          <Text>Cloud</Text>
          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)} ><Text>Source</Text></TouchableOpacity>
            <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
              <Text>Pool</Text>
            </TouchableOpacity>
          <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}><Text>Stream</Text></TouchableOpacity>

      </Tabs>
        <Text style={styles.welcome}>
            Welcome to Ripple Pay
        </Text>
        <Text style={styles.instructions}>
            Balance: 10 XRP
        </Text>
        <Text style={styles.instructions}>
            Selected page: {this.state.page}
        </Text>
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
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#335B7B',
   },
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
     fontSize: 15
   },
});

export default Home;
