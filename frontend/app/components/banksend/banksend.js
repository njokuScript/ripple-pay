// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import SendContainer from '../send/sendContainer'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Octicons';

// create a component
class BankSend extends Component {
  constructor(props){
    super(props);
    this.sendPayment = this.sendPayment.bind(this);
    this.state = {
      amount: "",
      page: ""
    }
  }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  navWallet() {
    // this.props.requestTransactions(this.props.user);
    // this.props.requestAddressAndDesTag(this.props.user.user_id);
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

  navSearch() {
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }
  //I am not required to do request transactions here because this will happen automatically from componentDidMount in home.js

  navHome() {
    // this.props.requestTransactions(this.props.user);
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  sendPayment(){
    this.props.sendInBank(this.props.sender_id, this.props.receiver_id, parseFloat(this.state.amount));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Sending to {this.props.otherUser}
          </Text>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="Amount"
            onChangeText={
              (amt) => {
                this.setState({amount: amt});
              }
            }
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.sendPayment}>
            <Text style={styles.button}>
              Send Payment
            </Text>
          </TouchableOpacity>
        </View>
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}>
            <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
              <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
              <Text>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
              <Text>Wallets</Text>
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
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#335B7B',
   },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 20,
    backgroundColor: '#335B7B',
  },

  titleContainer: {
    padding: 10,
    alignItems: 'center',
  },

  title: {
    color: '#F2CFB1',
    fontSize: 35,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    flex: 1,
    top: 60,
    fontFamily: 'Kohinoor Bangla'
  },

  field: {
    borderRadius: 5,
    padding: 5,
    paddingLeft: 8,
    margin: 45,
    marginTop: 0,
    top: 80,
    backgroundColor: '#fff'
  },

  textInput: {
    height: 26,
    fontFamily: 'Kohinoor Bangla'
  },

  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 60
  },
  button: {
    fontSize: 30,
    color: '#F2CFB1',
    fontFamily: 'Kohinoor Bangla',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowOpacity: 0.3,
    padding: 7
  },
  formError: {
    color: 'red'
  }
});

//make this component available to the app
export default BankSend;






// import React from 'react';
// import HomeContainer from '../home/homeContainer';
// import SearchContainer from '../search/searchContainer';
// import WalletContainer from '../wallet/walletContainer';
//
// import { View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   TextInput } from 'react-native';
// import Tabs from 'react-native-tabs';
// import Button from 'react-native-buttons';
//
//
// class Send extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {page: 'stream'};
//   }
//
// navHome() {
//   this.props.navigator.push({
//     title: 'Home',
//     component: HomeContainer,
//     navigationBarHidden: true
//   });
// }
//
// navSearch() {
//   this.props.navigator.push({
//     title: 'Search',
//     component: SearchContainer,
//     navigationBarHidden: true
//   });
// }
//
// navWallet() {
//   this.props.navigator.push({
//     title: 'Wallet',
//     component: WalletContainer,
//     navigationBarHidden: true
//   });
// }
//
// sendRipple() {
//   return;
// }
//
// requestRipple() {
//   return;
// }
//
//
//
//   render()
//  {
//    return (
//      <View style={styles.mainContainer}>
//        <View style={styles.buttonContainer}>
//          <Button style={styles.button} onPress={this.sendRipple.bind(this)}>Send</Button>
//          <Button style={styles.button} onPress={this.requestRipple.bind(this)}>Request</Button>
//        </View>
//        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
//            onSelect={el=>this.setState({page:el.props.name})}>
//
//          <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
//            <Text>Home</Text>
//         </TouchableOpacity>
//
//           <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
//           <Text>Search</Text>
//          </TouchableOpacity>
//
//            <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
//              <Text>Deposit</Text>
//            </TouchableOpacity>
//
//            <TouchableOpacity>
//               <Text>Send</Text>
//           </TouchableOpacity>
//      </Tabs>
//
//       <Text style={styles.welcome}>
//         Stream - Send your Ripple
//      </Text>
//       <Text style={styles.instructions}>
//          Selected page: {this.state.page}
//      </Text>
//      </View>
//    );
//  }}
//
//  const {width, height} = Dimensions.get('window');
//  const styles=StyleSheet.create({
//    mainContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#335B7B',
//     },
//     buttonContainer: { //Needs proper flexing from jon
//
//       flexDirection: 'row',
//       // margin: 8
//     },
//     button: {
//
//       justifyContent: 'space-around',
//       padding: 14,
//       margin: 7,
//       backgroundColor: '#E8C25E',
//       borderRadius: 6,
//
//     },
//    welcome: {
//      fontSize: 20,
//      textAlign: 'center',
//      margin: 10,
//    },
//     title: {
//       color: 'white',
//       fontSize: 20,
//       justifyContent: 'center',
//       fontFamily: 'Kohinoor Bangla',
//     },
//     inputContainer: {
//       padding: 5,
//       margin: 10,
//       borderWidth: 2,
//       borderRadius: 10,
//       borderColor: "white",
//       backgroundColor: 'white'
//     },
//     input: {
//       height: 26,
//       backgroundColor: 'white'
//     },
//     instructions: {
//       textAlign: 'center',
//       color: '#333333',
//       marginBottom: 5,
//       fontSize: 15
//     }
//  });
//
//  export default Send;
