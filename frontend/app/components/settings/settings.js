import React from 'react';
import HomeContainer from '../home/homeContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import BankSendContainer from '../banksend/banksendContainer';
import CustomInput from '../presentationals/customInput';
import Config from '../../config_enums';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.navChangePassword = this.navChangePassword.bind(this);
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  navChangePassword() {
    this.props.navigator.push({
      backButtonTitle: "",
      screen: 'ChangePassword',
      animation: true,
      animationType: 'fade',
      navigatorStyle: {
        navBarHidden: true, statusBarTextColorScheme: 'light'
      },
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.settings}>
            <Text style={styles.title}>Settings</Text>
          </View>
        </View>
          <View style={styles.listItem}>
            <Text style={styles.text}>
              { this.props.activeWallet === Config.WALLETS.BANK_WALLET ? "Using Bank Wallet" : "Using Personal Wallet" }
            </Text>
          </View>
        <TouchableOpacity style={styles.listItem} onPress={this.props.changeWallet}>
            <Text style={styles.text}>
              { this.props.activeWallet === Config.WALLETS.BANK_WALLET ? "Change to Personal Wallet" : "Change to Bank Wallet" }
            </Text>
          </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={this.navChangePassword}>
            <Text style={styles.text}>Change Password</Text>
          </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={this.props.unauthUser}>
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  text: {
    textAlign: "center",
    color: 'black',
    fontFamily: 'Kohinoor Bangla',
  },
  listItem: {
    paddingTop: 15.65,
    paddingBottom: 15.65,
    borderBottomWidth: 2,
    borderColor: '#d3d3d3',
    backgroundColor: 'white',
    width: width,
  },
  settings: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#111F61'
  },
  title: {
    color: 'white',
    fontSize: width / 20,
    fontFamily: 'Kohinoor Bangla'
  },
  topContainer: {
    backgroundColor: '#111F61',
    alignItems: 'center',
    height: height / 5.5,
  },
});

export default Settings;
