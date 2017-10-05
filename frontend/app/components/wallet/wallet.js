import React from 'react';
import HomeContainer from '../home/homeContainer';
import SearchContainer from '../search/searchContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Octicons';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import LinearGradient from 'react-native-linear-gradient'
const myIcon = (<Icon name="search" size={30} color="#900" />)



class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      destTag: undefined
    };
    this.generate = this.generate.bind(this);
    this.remove = this.remove.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  // componentDidMount(){
  // }

  onNavigatorEvent(event){
    if ( event.id === "willAppear" )
    {
      this.props.requestOldAddress(this.props.user.user_id);
      this.props.requestAllWallets(this.props.user.user_id);
    }
  }

  remove(){
    if ( this.props.wallets.length > 0 )
    {
      this.setState({disabled: true});
      this.props.requestTransactions(this.props.user).then(() => this.props.delWallet(this.props.user.user_id, this.props.wallets[0], this.props.cashRegister)).then(()=> this.setState({disabled: false}));
    }
    else
    {
      return;
    }
  }

  //We have to disable the button so they can't generate more than 5 desTags

  generate(){
    let alltheWallets = this.props.wallets;
    if ( alltheWallets.length >= 0 && alltheWallets.length < 5 )
    {
      this.setState({disabled: true});
      if ( alltheWallets.length === 0 )
      {
        this.props.requestAddress(this.props.user.user_id)
        .then(()=> this.props.requestOnlyDesTag(this.props.user.user_id, this.props.cashRegister))
        .then(()=> this.setState({disabled: false}));
      }
      else
      {
        this.props.requestOnlyDesTag(this.props.user.user_id, this.props.cashRegister)
        .then(()=> this.setState({disabled: false}));
      }
    }
    else
    {
      return;
    }
  }


  displayWallets() {
    if (this.props.wallets && this.props.wallets.length > 0) {
      //Jon - You were talking about some way to allow scrolling here so you can scroll through the wallets.
      const allWallets = this.props.wallets.map((wallet, idx) => {
        return (
          <View style={styles.wallet} key={idx}>
            <Text style={styles.walletFont}>{wallet}</Text>
          </View>
        );
      });
      return (
        <View style={styles.walletsContainer}>
          <View style={styles.walletAddress}>
            <Text style={styles.walletintro}>Wallet Address:</Text>
            <Text style={styles.cashRegister}>{this.props.cashRegister}</Text>
          </View>
          <View style={styles.destTag}>
            <Text style={styles.destintro}>Destination Tags:</Text>
          </View>
          {allWallets}
        </View>
      );
    } else {
      return (
        <View style={styles.nowallet}>
          <Text style={styles.walletFont}>no wallets</Text>
        </View>
      );
    }
  }
  // <Text style={styles.title}>{this.props.cashRegister}</Text>
  // <Text style={styles.title}>{this.props.destinationTag}</Text>

  //I am removing wallets form earliest to latest. We can change this to just the one we click on later if we desire.

  render()
  {
    let disabled = this.state.disabled;
    return (
      <View style={styles.mainContainer}>
          <View style={styles.walletsContainer}>
              {this.displayWallets()}
              <View style={styles.balanceContainer}>
                <TouchableOpacity disabled={disabled} onPress={this.generate}>
                  <Text style={disabled ? styles.redd : styles.greenn}>+ New Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={disabled} onPress={this.remove}>
                  <Text style={disabled ? styles.redd : styles.greenn}>- Oldest Wallet</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     flexDirection: 'column',
     backgroundColor: '#111F61',
   },
   balanceContainer: {
     flex: 1,
     justifyContent: 'space-between',
     alignItems: 'flex-start',
     flexDirection: 'row',
     marginLeft: 35,
     marginRight: 35,
     top: 150
   },
   redd: {
     color: 'red',
     fontSize: 20,
     padding: 7,
     borderRadius: 0.4,
     borderWidth: 0.9,

     borderColor: 'white'
   },
   greenn: {
     color: 'green',
     fontSize: 20,
     padding: 7,
     borderRadius: 0.4,
     borderWidth: 0.9,
     borderColor: 'white'
   },
  topContainer: {
    backgroundColor: '#111F61',
  },
  logoContainer: {
    flex: 1,
    paddingBottom: 10,
    // backgroundColor: '#335B7B',
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
     fontFamily: 'Kohinoor Bangla',
     borderColor: 'black',
     borderRadius: 5
   },
   destintro: {
     color: 'white',
     fontSize: 20
   },
    walletsContainer: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#111F61',
      padding: 15
    },
    walletAddress: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      padding: 15
    },
    walletintro: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
    },
    nowallet: {
      backgroundColor: "white",
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 10
    },
    destTag: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // fontSize: 25,
      marginTop: 10,
      padding: 15
    },
    wallets: {
      flex: 1,
      fontFamily: 'Kohinoor Bangla',
    },
    walletFont: {
      color: 'black',
      textAlign: 'center',
      fontSize: 18
    },
    cashRegister: {
      marginTop: 10,
      color: 'white',
      fontSize: 14
    },
    wallet: {
      flex: 1,
      justifyContent: 'center',
      // paddingLeft: 85,
      paddingTop: 20,
      paddingBottom: 20,
      // marginLeft: 70,
      // marginRight: 70,
      marginTop: 10,
      marginBottom: 10,
      // borderBottomWidth: 1,
      // borderColor: '#d3d3d3',
      backgroundColor: 'white',
      borderRadius: 20
    }
});

export default Wallet;
