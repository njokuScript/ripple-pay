// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
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
class Send extends Component {
  constructor(props){
    super(props);
    this.sendPayment = this.sendPayment.bind(this);
    this.state = {
      toAddress: "",
      toDesTag: undefined,
      amount: ""
    }
  }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.
  navWallet() {
    this.props.requestTransactions(this.props.user);
    this.props.requestAddressAndDesTag(this.props.user.user_id);
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
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

  navHome() {
    this.props.requestTransactions(this.props.user);
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  sendPayment(){
    if ( !this.props.fromAddress && !this.props.sourceTag)
    {
      this.props.addAlert("Please press deposit first")
    }
    else if(!this.props.fromAddress){
      this.props.addAlert("Please press deposit to get an address")
    }
    else if(!this.props.sourceTag){
      this.props.addAlert("Please press deposit to get an dTag")
    }
    else{
      let array = Object.keys(this.state);
      for (let i = 0; i < array.length; i++)
      //there does not need to be a destination tag
      {
        if ( this.state[array[i]] === "" && array[i] !== "toDesTag")
        {
          this.props.addAlert("Please Try Again");
          return;
        }
      }
      let {toDesTag, toAddress, amount} = this.state;
      this.props.signAndSend(parseFloat(amount), this.props.fromAddress, toAddress, parseInt(this.props.sourceTag), parseInt(toDesTag), this.props.user.user_id);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Send Your Ripple
          </Text>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="Destination Address"
            onChangeText={
              (toAddr) => {
                this.setState({toAddress: toAddr});
              }
            }
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="Destination Tag - optional"
            onChangeText={
              (des) => {
                this.setState({toDesTag: des});
              }
            }
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
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
              <Text>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity>
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
export default Send;
