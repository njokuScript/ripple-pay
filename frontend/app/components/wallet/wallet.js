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
  Dimensions,
  Clipboard
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Entypo';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import LinearGradient from 'react-native-linear-gradient'

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
    this.qrOne = require('./QRcodes/one.jpg');
    this.qrTwo = require('./QRcodes/two.jpg');
    this.qrThree = require('./QRcodes/three.jpg');
    this.qrFour = require('./QRcodes/four.jpg');
    this.qrFive = require('./QRcodes/five.jpg');
  }

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

  clipBoardCopy(string){
    Clipboard.setString(string);
    Clipboard.getString().then((str)=>{
      return str;
    })
  }

  //Dynamically requiring files is not possible, so unfortunately, any time you change the addresses
  // You will also have to change this function to match the addresses and images
  getQRCode(){
    switch (this.props.cashRegister.slice(0,6)){
      case "r4QDfk":
        return this.qrOne;
      case "r9bxkP":
        return this.qrTwo;
      case "rpN2Nz":
        return this.qrThree;
      case "rPxkAQ":
        return this.qrFour;
      case "rs1DXn":
        return this.qrFive;
    }
  }
  displayWallets() {
    const disabled = this.state.disabled;
    if (this.props.wallets && this.props.wallets.length > 0) {
      //Jon - You were talking about some way to allow scrolling here so you can scroll through the wallets.
      const allWallets = this.props.wallets.map((wallet, idx) => {
        return (
          <View style={styles.wallet} key={idx}>
            <Text style={styles.walletFont}>{idx+1}.</Text>
            <Text style={styles.walletFont}>{wallet}</Text>
            <TouchableOpacity onPress={() => this.clipBoardCopy(wallet.toString())} style={styles.clipBoardContainer}>
              <Icon name="clipboard" size={25} color="brown" />
            </TouchableOpacity>
          </View>
        );
      });
      const imageSource = this.getQRCode();
      return (
          <View style={styles.walletDisplay}>
            <Text style={styles.walletAddress}>Wallet Address:</Text>
            <View style={styles.address}>
              <Text style={styles.cashRegister}>{this.props.cashRegister}</Text>
              <TouchableOpacity onPress={() => this.clipBoardCopy(this.props.cashRegister)} style={styles.clipBoardContainer}>
                <Icon  name="clipboard" size={25} color="brown" />
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.qrCode}
                source={imageSource}
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity disabled={disabled} onPress={this.generate}>
                  <Text style={disabled ? styles.redd : styles.greenn}>+ New Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={disabled} onPress={this.remove}>
                  <Text style={disabled ? styles.redd : styles.greenn}>- Oldest Wallet</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.destTag}>
              <Text style={styles.destintro}>Destination Tags:</Text>
            </View>
            <View style={styles.walletsContainer}>
              {allWallets}
            </View>
          </View>
      );
    } else {
      return (
        <View style={styles.noWalletContainer}>
          <Text style={styles.noWallet}>Please get a Wallet</Text>
          <View style={styles.noWalletsButtonsContainer}>
            <TouchableOpacity disabled={disabled} onPress={this.generate}>
              <Text style={disabled ? styles.redd : styles.greenn}>+ New Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
  // <Text style={styles.title}>{this.props.cashRegister}</Text>
  // <Text style={styles.title}>{this.props.destinationTag}</Text>

  //I am removing wallets form earliest to latest. We can change this to just the one we click on later if we desire.

  render()
  {
    return (
      <View style={styles.mainContainer}>
          {this.displayWallets()}
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
    //  justifyContent: 'center',
    //  flexDirection: 'column',
     backgroundColor: '#111F61',
   },
   buttonsContainer: {
     flex: 1,
     justifyContent: 'space-between',
     alignItems: 'flex-start',
     flexDirection: 'column',
     marginLeft: 35,
     marginRight: 35,
    //  top: 140,
    //  left: 230,
    //  position: 'absolute'
   },
   redd: {
     color: 'white',
     backgroundColor: 'red',
     fontSize: 20,
     padding: 7,
     borderRadius: 3,
     borderWidth: 0.9,
     borderColor: 'white',
     width: 150,
     textAlign: 'center'
   },
   greenn: {
     color: 'white',
     fontSize: 20,
     padding: 7,
     borderRadius: 3,
     backgroundColor: 'green',
     borderWidth: 0.9,
     borderColor: 'white',
     width: 150,
     textAlign: 'center'
   },
   destintro: {
     color: 'white',
     fontSize: 20
   },
    walletsContainer: {
      flex: -1,
      flexDirection: 'column',
      // backgroundColor: 'yellow',
      // top: 20,
      // padding: 15
    },
    walletAddress: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
    },
    walletintro: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
    },
    walletDisplay: {
      top: 30
    },
    noWallet: {
      color: 'white',
      fontSize: 25,
      textAlign: 'center',
      marginTop: 20
    },
    noWalletsButtonsContainer: {
      flex: -1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: 200,
      marginLeft: 32,
      marginRight: 35,
    },
    destTag: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // fontSize: 25,
      marginTop: 150,
      padding: 15
    },
    wallets: {
      flex: 1,
      fontFamily: 'Kohinoor Bangla',
    },
    walletFont: {
      color: 'white',
      textAlign: 'center',
      fontSize: 18,
    },
    cashRegister: {
      marginTop: 10,
      color: 'white',
      fontSize: 16
    },
    address: {
      flex: -1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      // padding: 3,
      width: 370,
      left: 20,
    },
    clipBoardContainer: {
      borderColor: 'white',
      borderWidth: 1,
      padding: 1,
      borderRadius: 3,
      backgroundColor: 'white'
    },
    wallet: {
      flex: -1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderColor: 'white',
      borderWidth: 1,
      padding: 6,
      width: 370,
      left: 20,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: 'black'
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'space-between',
      position: 'absolute',
      flexDirection: 'row',
      top: 80,
      left: 60
    },
    qrCode: {
      width: 120,
      height: 120,
      borderRadius: 10,
      // left: 140,
      // marginTop: 84,
      // position: 'absolute'
    }
});

export default Wallet;
