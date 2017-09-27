// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import ExchangeContainer from '../exchange/exchangeContainer'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Entypo';

// I DID NOT MAKE SURE THAT THE INPUT FIELDS ARE NUMBERS AND NOT LETTERS BECAUSE THIS WILL BE SOLVED WITH A NUMBERPAD LATER
class BankSend extends Component {
  constructor(props){
    super(props);
    this.sendPayment = this.sendPayment.bind(this);
    this.state = {
      amount: "",
      disabled: false
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "bottomTabSelected" )
    {
      this.props.navigator.resetTo({
        screen: 'Search',
        navigatorStyle: {navBarHidden: true}
      });
    }
  }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.

  //I am not required to do request transactions here because this will happen automatically from componentDidMount in home.js


  sendPayment(){
    if (!parseFloat(this.state.amount))
    {
      this.props.addAlert("Can't send 0 Ripple");
      return;
    }
    this.setState({disabled: true});
    this.props.sendInBank(this.props.sender_id, this.props.receiver_id, parseFloat(this.state.amount)).then(() => {
      this.setState({disabled: false});
      this.navHome.bind(this);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={this.navSearch.bind(this)} >
            <Icon name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Send Ripple to {this.props.otherUser}
            </Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              {this.props.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
            </Text>
          </View>
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
            placeholderTextColor="#6D768B"
            autoFocus={true}
            autoCapitalize={'none'}
            style={styles.textInput}
            keyboardType={'number-pad'}
            keyboardAppearance={'dark'}/>
          <View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.touchableButton} disabled={this.state.disabled} onPress={this.sendPayment}>
            <Text style={this.state.disabled ? styles.redbutton : styles.greenbutton}>
              SEND
            </Text>
          </TouchableOpacity>
        </View>
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
     backgroundColor: '#111F61',
   },
  topContainer: {
    flex: -1,
    backgroundColor: '#111F61',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 90,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#111F61',
  },
  titleContainer: {
    alignItems: 'center',
  },

  title: {
   textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'Kohinoor Bangla'
  },
  field: {
    backgroundColor: '#0F1C52',
    borderRadius: 5,
    padding: 5,
    paddingLeft: 15,
    margin: 30,
    marginTop: 10,
    top: 90
  },
  textInput: {
    height: 40,
    fontFamily: 'Kohinoor Bangla',
    color: '#6D768B',
  },
  touchableButton: {
    backgroundColor: '#0F1C52',
    borderRadius: 50,
    paddingTop: 10,
    paddingBottom: 10,
    width: 250,
    overflow: 'hidden',
  },
  buttonContainer: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 80
  },
  greenbutton: {
    backgroundColor: 'transparent',
    fontWeight: '400',
    fontSize: 20,
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    textAlign: 'center'
  },
  redbutton: {
    backgroundColor: 'transparent',
    fontWeight: '400',
    fontSize: 20,
    color: 'red',
    fontFamily: 'Kohinoor Bangla',
    textAlign: 'center'
  },
  formError: {
    color: 'red'
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
});

// make this component available to the app
export default BankSend;