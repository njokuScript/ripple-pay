import React, { Component } from 'react';
import Font from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from 'react-native';

const Coin = (props) => {
  return (
    <View style={styles.coin}>
      <Image
          style={{width: 60, height: 60}}
          source={props.imageSource}
          defaultSource={require('../exchange/images/no_image.png')}
      />
      <View style={styles.coinType}>
        <Text style={styles.coinFont}>{props.coinName} ({props.coinSymbol})</Text>
        <Text style={styles.coinAmount}>{props.rate}</Text>
        <Text></Text>
        { props.perc ? <Text style={styles.coinAmount}>{props.perc < 0 ? `${props.perc}%` : `+${props.perc}%`}</Text> : null }
        { props.marketCap ? <Text style={styles.coinAmount}>{props.marketCap}</Text> : null }
      </View>
      <View style={styles.sendReceive}>
        <View style={styles.send}>
          <Text onPress={props.sendFunction} style={styles.coinFont}>
            <Font name="send" size={20} color="black" />
          </Text>
        </View>
        <View style={styles.receive}>
          <Text onPress={props.receiveFunction} style={styles.coinFont}>
            <Font name="bank" size={20} color="black" />
          </Text>
        </View>
      </View>
    </View>
  );
};
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  coin: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 2,
      paddingLeft: 15,
      paddingTop: 15.65,
      paddingBottom: 15.65,
      borderBottomWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: 'white',
      width: width
  },
  coinAmount: {
     fontSize: 12
  },
  coinFont: {
    fontWeight: "600",
    fontFamily: 'AppleSDGothicNeo-Light',
    fontSize: 15,
  },
  coinType: {
    flex: 1,
    paddingLeft: 15
  },
  sendReceive: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  receive: {
    paddingLeft: 20,
    paddingRight: 15
  }
});

export default Coin;
