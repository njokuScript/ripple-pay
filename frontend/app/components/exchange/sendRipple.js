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
  TouchableOpacity,
  Image
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Entypo';

// create a component
//I DID NOT MAKE SURE THAT THE INPUT FIELDS ARE NUMBERS AND NOT LETTERS BECAUSE THIS WILL BE SOLVED WITH A NUMBERPAD LATER
class SendRipple extends Component {
  constructor(props){
    super(props);
    this.sendPayment = this.sendPayment.bind(this);
    this.state = {
      toAddress: "",
      toDesTag: undefined,
      amount: "",
      disabled: false,
    }
  }

  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.

  sendPayment(){
    console.log('hi');
    if ( !this.props.fromAddress || !this.props.sourceTag)
    {
      this.props.addAlert("Please get a wallet first")
    }
    //This is the REGEX to validate a Ripple Address
    else if(!this.state.toAddress.match(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/))
    {
      this.props.addAlert("Invalid Ripple Address");
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
      if ( !parseFloat(amount) )
      {
        this.props.addAlert("Can't send 0 XRP");
        return;
      }
      this.setState({disabled: true});
      this.props.signAndSend(parseFloat(amount), this.props.fromAddress, toAddress, parseInt(this.props.sourceTag), parseInt(toDesTag), this.props.user.user_id).then(()=> this.setState({disabled: false}));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => this.props.navigator.pop({
            animationType: 'fade'
            })}>
            <Text><Icon name="chevron-left" size={30} color={"white"} /></Text>
          </TouchableOpacity>
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
            placeholderTextColor="#6D768B"
            keyboardAppearance={'dark'}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.inputField}>
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
              placeholderTextColor="#6D768B"
              keyboardType={'number-pad'}
              keyboardAppearance={'dark'}
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
                placeholderTextColor="#6D768B"
                autoCapitalize={'none'}
                keyboardType={'number-pad'}
                keyboardAppearance={'dark'}
                style={styles.textInput}/>
            </View>
          </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.touchableButton} disabled={this.state.disabled} onPress={this.sendPayment}>
            <Text style={this.state.disabled ? styles.redbutton : styles.greenbutton}>
              Send Payment
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fee}>
          <Text style={styles.redtoptext}>
            transaction Fee: 0.02 XRP
          </Text>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#111F61',
    paddingTop: 20
  },
  inputField: {
    marginBottom: -100
  },
  topContainer: {
    marginBottom: -10,
    marginLeft: 10
  },
  field: {
    backgroundColor: '#0F1C52',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 15,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
  },
  textInput: {
    height: 26,
    fontFamily: 'Kohinoor Bangla'
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
    top: 200
  },
  redtext: {
    color: 'red',
    fontSize: 15,
    marginTop: 20,
    textAlign: 'center',
    paddingRight: 10,
    paddingLeft: 10
  },
  redtoptext: {
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 50
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
  fee: {
    marginTop: 30
  }
});

//make this component available to the app
export default SendRipple;
