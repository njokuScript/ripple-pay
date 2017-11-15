// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import CustomInput from '../presentationals/customInput';
import CustomButton from '../presentationals/customButton';
import AlertContainer from '../alerts/AlertContainer';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
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
    if ( !this.props.fromAddress || !this.props.sourceTag)
    {
      this.props.addAlert("Please get a wallet first")
    }
    //This is the REGEX to validate a Ripple Address
    else if(!this.state.toAddress.match(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/))
    {
      this.props.addAlert("Invalid Ripple Address");
    }
    else if (this.props.fromAddress === this.state.toAddress) {
      this.props.addAlert("Can't Send to yourself");
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
      if ( parseFloat(amount) <= 0 || !amount.match(/^\d+$/) )
      {
        this.props.addAlert("Can't send 0 or less Ripple");
        return;
      }
      this.setState({disabled: true});
      this.props.signAndSend(parseFloat(amount), this.props.fromAddress, toAddress, parseInt(this.props.sourceTag), parseInt(toDesTag)).then(()=> this.setState({disabled: false}));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <AlertContainer />
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => this.props.navigator.pop({
            animationType: 'fade'
            })}>
            <Text><Icon name="chevron-left" size={30} color={"white"} /></Text>
          </TouchableOpacity>
        </View>
        <CustomInput
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
        />
        <CustomInput
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
          />
        <CustomInput
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
          />
        <CustomButton
          performAction="Send Payment"
          buttonColor={this.state.disabled ? "red" : "white"}
          isDisabled={this.state.disabled}
          handlePress={this.sendPayment}
        />
        <View style={styles.fee}>
          <Text style={styles.feetext}>
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
  topContainer: {
    marginBottom: -10,
    marginLeft: 10
  },
  feetext: {
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20
  },
  formError: {
    color: 'red'
  }
});

//make this component available to the app
export default SendRipple;
