import React from 'react';
import {
  View, text, StyleSheet, TouchableOpacity, Image, Dimensions
} from 'react-native';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.walletContainer}>
        <Text style={styles.walletTitle}>
        Hopefully Wallet shows up
        </Text>
      </View>
    )
  }
};
const {width, height} = Dimensions.get('window');
const styles=StyleSheet.create({

});

export default Wallet;
