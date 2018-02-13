import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import AlertContainer from '../alerts/AlertContainer';
import CustomButton from '../presentationals/customButton';
import Icon from 'react-native-vector-icons/Entypo';
import WalletTabs from '../presentationals/walletTabs';
import Api from '../../api';
import Util from '../../utils/util';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      destTag: undefined,
    };
    this.generate = this.generate.bind(this);
    this.remove = this.remove.bind(this);
    this.qrOne = require('./QRcodes/one.jpg');
    this.qrTwo = require('./QRcodes/two.jpg');
    this.qrThree = require('./QRcodes/three.jpg');
    this.qrFour = require('./QRcodes/four.jpg');
    this.qrFive = require('./QRcodes/five.jpg');
  }

  remove(){
    if (!this.state.disabled) {
      if ( this.props.wallets.length > 0 )
      {
        this.setState({disabled: true});
        this.props.requestTransactions(this.props.user)
        .then((response) => { 

          if (response === Api.RESPONSE_MESSAGES.SUCCESS) {
            return this.props.delWallet(this.props.wallets[0], this.props.cashRegister);
          } else if (response === Api.RESPONSE_MESSAGES.FAILURE) {
            return null;
          }
        })
        .then(()=> this.setState({disabled: false}));
      }
    }
  }

  //We have to disable the button so they can't generate more than 5 desTags

  generate(){
    if (!this.state.disabled) {
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
          <TouchableOpacity key={idx} onPress={() => Util.clipBoardCopy(wallet.toString())}>
            <View style={styles.destTagContainer}>
              <Text style={styles.destTag}>{wallet}</Text>
            </View>
          </TouchableOpacity>
        );
      });
      const imageSource = this.getQRCode();
      return (
          <View style={styles.walletDisplay}>
            <View style={styles.imageContainer}>
                <TouchableOpacity style={styles.image} underlayColor='#111F61' onPress={() => Util.clipBoardCopy(this.props.cashRegister)}>
                  <Image
                    style={styles.qrCode}
                    source={imageSource}
                  />
                  <View>
                    <Text style={styles.addressFont}>{this.props.cashRegister}</Text>
                  </View>
                </TouchableOpacity>
            </View>
            <WalletTabs
              disabled={this.state.disabled}
              handleLeftPress={this.generate}
              handleRightPress={this.remove}
            />
            <ScrollView
              automaticallyAdjustContentInsets={false}
              contentContainerStyle={styles.scrollViewContainer}>
              {allWallets}
            </ScrollView>
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
        <StatusBar
          barStyle="light-content"
        />
          {this.displayWallets()}
        <AlertContainer />
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    flex: 1,
    paddingTop: height / 25,
    alignItems: 'center',
    backgroundColor: '#111F61',
  },
  image: {
    flex: 1,
    alignItems: "center"
  },
  qrCode: {
    width: height / 3,
    height: height / 3,
  },
  walletDisplay: {
    flex: 1,
    flexDirection: "column",
  },
  noWalletsButtonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  addressFont: {
    color: 'white',
    fontSize: height/50,
    textAlign: 'center',
    marginTop: height/50
  },
  destTag: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: 'center',
    color: "black"
  },
  destTagContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15.65,
    paddingBottom: 15.65,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    backgroundColor: 'white',
    width: width,
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
  },
});

export default Wallet;
