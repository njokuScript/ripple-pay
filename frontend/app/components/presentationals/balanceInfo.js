import React, { Component } from 'react';
import Font from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('screen');
const BalanceInfo = (props) => {
  return (
    <View style={styles.topContainer}>
    <CustomBackButton handlePress={() => this.props.navigator.pop({
      animationType: 'fade'
    })} />
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceTextField}>
        balance:
        </Text>
      <Text style={styles.balanceText}>
        Ʀ{props.balance}
      </Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
    topContainer: {
      backgroundColor: '#111F61',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 70,
      paddingTop: 20,
      paddingLeft: 30,
      paddingRight: 20
    },
    balanceContainer: {
        borderRadius: 50,
        borderColor: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: "row"
      },
      balanceText: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        fontFamily: 'AppleSDGothicNeo-Light'
      },
      balanceTextField: {
        textAlign: 'center',
        fontSize: 11,
        color: 'white',
        fontFamily: 'AppleSDGothicNeo-Light',
        marginTop: 9,
        marginRight: 10
      }
});


export default BalanceInfo;
