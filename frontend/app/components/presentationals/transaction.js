import React, { Component } from 'react';
import Font from 'react-native-vector-icons/FontAwesome';
import Util from '../../utils/util';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

// Pass down props.otherParty,
// the color of transaction is either green or red based on neg or pos
const Transaction = (props) => {
  const { otherParty, date, amount, fromCoin, toCoin, transactionColor, toAmount, time } = props;
  let transactionDate;
  let transactionAmount;
  if (amount) {
    const transactionAmountStyle = {
      textAlign: 'center',
      fontWeight: "600",
      fontSize: 14,
      color: transactionColor,
    };
    transactionDate = (
      <View style={styles.transactionDate}>
        <Text style={styles.transactionDateText}>
          {`${date.toLocaleString("en-us", { month: "short" })} ${date.getDate()}, ${date.getFullYear()} ${time}`}
        </Text>
      </View>
    );
    transactionAmount = (
      <View style={styles.transactionAmount}>
        <Text style={transactionAmountStyle}>
          { Util.truncate(amount, 3) } {fromCoin}
        </Text>
        <Text style={transactionAmountStyle}>
          { Util.truncate(toAmount, 3) } {toCoin}
        </Text>
      </View>
    );
  }
  const transactionData = (
    <View style={styles.transactionInfo}>
      <View style={styles.transactionOtherParty}>
      <Text style={styles.transactionOtherPartyText}>
      { otherParty }
      </Text>
      </View>
      { transactionDate }
    </View>
  );
  if (props.changelly) {
    return (
      <TouchableOpacity onPress={props.handlePress} style={styles.transaction}>
      { transactionData }
      { transactionAmount }
      </TouchableOpacity>
    );
  }
  else {
    return (
      <View style={styles.transaction}>
      { transactionData }
      { transactionAmount }
      </View>
    );
  }
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  transaction: {
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
  transactionInfo: {
    // marginRight: -15
  },
  transactionOtherPartyText: {
    fontWeight: "600",
    fontSize: 13
  },
  transactionDate: {
    paddingTop: 8
  },
  transactionDateText: {
    fontSize: 12
  },
});

export default Transaction;
