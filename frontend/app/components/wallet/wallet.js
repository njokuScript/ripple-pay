import React from 'react';
import HomeContainer from '../home/homeContainer';
import SearchContainer from '../search/searchContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import AlertContainer from '../alerts/AlertContainer';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Clipboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

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
      this.props.requestOldAddress();
      this.props.requestAllWallets();
    }
  }

  remove(){
    if ( this.props.wallets.length > 0 )
    {
      this.setState({disabled: true});
      this.props.requestTransactions(this.props.user)
      .then(() => this.props.delWallet(this.props.wallets[0], this.props.cashRegister))
      .then(()=> this.setState({disabled: false}));
    }
  }

  //We have to disable the button so they can't generate more than 5 desTags

  generate(){
    let alltheWallets = this.props.wallets;
    if ( alltheWallets.length >= 0 && alltheWallets.length < 5 )
    {
      this.setState({disabled: true});
      if (this.props.cashRegister)
      {
        this.props.requestOnlyDesTag(this.props.cashRegister).then(()=> this.setState({disabled: false}));
      }
      else
      {
        this.props.requestAddress()
        .then(()=> this.props.requestOnlyDesTag(this.props.cashRegister))
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
    });
  }

  // Dynamically requiring files is not possible, so unfortunately, any time you change the addresses
  // You will also have to change this function to match the addresses and images
  getQRCode(){
    let { cashRegister } = this.props;
    if (cashRegister) {
      switch (this.props.cashRegister.slice(0,6)){
        case "r4QDfk":
          return this.qrOne;
        case "r9bxkP":
          return this.qrTwo;
        case "rPN2Nz":
          return this.qrThree;
        case "rPxkAQ":
          return this.qrFour;
        case "rs1DXn":
          return this.qrFive;
      }
    }
    return "";
  }
  displayWallets() {
    const disabled = this.state.disabled;
    if (this.props.cashRegister) {
      const allWallets = this.props.wallets.map((wallet, idx) => {
        return (
          <View style={styles.wallet} key={idx}>
            <Text style={styles.walletFont}>{idx+1}.</Text>
            <Text style={styles.walletFont}>{wallet}</Text>
            <TouchableOpacity onPress={() => this.clipBoardCopy(wallet.toString())} style={styles.clipBoardContainer}>
              <Icon name="clipboard" size={25} color="gray" />
            </TouchableOpacity>
          </View>
        );
      });
      const imageSource = this.getQRCode();
      return (
          <View style={styles.walletDisplay}>
          
            <View style={styles.address}>
              <TouchableOpacity onPress={() => this.clipBoardCopy(this.props.cashRegister)} style={styles.clipBoardContainer}>
                <Icon  name="clipboard" size={25} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.qrCode}
                source={imageSource}
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity disabled={disabled} onPress={this.generate}>
                  <Text style={disabled ? styles.redButton : styles.greenButton}>+ New Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={disabled} onPress={this.remove}>
                  <Text style={disabled ? styles.redButton : styles.greenButton}>- Old Wallet</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={styles.destTag}>
              <Text style={styles.walletFont}>{this.props.cashRegister}</Text>
                <Text style={styles.destintro}>Destination Tags:</Text>
              </View>
              <View style={styles.walletsContainer}>
                {allWallets}
              </View>
            </View>
          </View>
      );
    } 
    else {
      return (
        <View style={styles.noWalletsButtonsContainer}>
          <TouchableOpacity disabled={disabled} onPress={this.generate}>
            <Text style={disabled ? styles.redButton : styles.greenButton}>+  New Wallet</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render()
  {
    return (
      <View style={styles.mainContainer}>
          <AlertContainer />
          {this.displayWallets()}
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    mainContainer: {
     flex: 1,
      backgroundColor: '#111F61',
    },
  walletDisplay: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 30,
  },
   buttonsContainer: {
     flex: 1,
     justifyContent: 'space-between',
     alignItems: 'flex-start',
     flexDirection: 'column',
     marginLeft: 35,
     marginRight: 35,
   },
   redButton: {
     fontFamily: 'Kohinoor Bangla',
     color: 'red',
     backgroundColor: '#0F1C52',
     borderRadius: 25,
     padding: 16,
     width: 150,
     overflow: 'hidden',
     textAlign: 'center',
     fontSize: 15,
    //  marginLeft: 15
   },
   greenButton: {
     fontFamily: 'Kohinoor Bangla',
     backgroundColor: '#0F1C52',
     borderRadius: 25,
     padding: 16,
     width: 150,
     overflow: 'hidden',
     textAlign: 'center',
     color: 'white',
     fontSize: 15,
    //  marginLeft: 10
   },
   destintro: {
     color: 'white',
     fontSize: 20
   },
    walletsContainer: {
      flex: -1,
      flexDirection: 'column',
      marginTop: 190,
      width: 330,
      marginLeft: 20,
    },
    walletAddress: {
      color: 'white',
      textAlign: 'center',
      fontSize: 15,
    },
    walletintro: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
    },
    noWalletsButtonsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    destTag: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      top: 180,
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
      fontSize: 16,
    },
    address: {
      flex: -1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: 370,
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
      borderBottomWidth: 1,
      paddingBottom: 10,
      width: 330,
      marginTop: 10,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'space-between',
      position: 'absolute',
      flexDirection: 'row',
      // top: 40,
      left: 25,
    },
    qrCode: {
      width: 140,
      height: 140,
      borderRadius: 10,
    }
});

export default Wallet;
