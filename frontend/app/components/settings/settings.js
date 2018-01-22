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
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  render() {
    return (
      <View style={styles.mainContainer}>
          <Text style={styles.text}>
            { this.props.activeWallet === Config.WALLETS.BANK_WALLET ? "Using Bank Wallet" : "Using Personal Wallet" }
          </Text>
          <TouchableOpacity onPress={this.props.changeWallet}>
            <Text style={styles.text}>
              { this.props.activeWallet === Config.WALLETS.BANK_WALLET ? "Change to Personal Wallet" : "Change to Bank Wallet" }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.unauthUser}>
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
    justifyContent: "center",
  },
  text: {
    textAlign: "center"
  }
});

export default Settings;
