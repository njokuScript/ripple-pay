import React, { Component } from 'react';
import Font from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Pass down props.otherParty,
// the color of transaction is either green or red based on neg or pos
const Transaction = (props) => {
  const { otherParty, ndate, amount, transactionColor } = props;
  let transactionDate;
  let transactionAmount;
  if (ndate && amount) {
    let time;
    if (ndate.getHours() > 12) {
      time = `${ndate.getHours() - 12}:${ndate.getMinutes()} PM` ;
    } else {
      time = `${ndate.getHours()}:${ndate.getMinutes()} AM`;
    }
    const transactionAmountStyle = {
      textAlign: 'center',
      fontWeight: "600",
      fontSize: 14,
      color: transactionColor
    }
    transactionDate = (
      <View style={styles.transactionDate}>
        <Text style={styles.transactionDateText}>
          {`${ndate.toLocaleString("en-us", { month: "short" })} ${ndate.getDate()}, ${ndate.getFullYear()} ${time}`}
        </Text>
      </View>
    )
    transactionAmount = (
      <View style={styles.transactionAmount}>
        <Text style={transactionAmountStyle}>
          {amount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
        </Text>
      </View>
    )
  }
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionInfo}>
        <View style={styles.transactionOtherParty}>
          <Text style={styles.transactionOtherPartyText}>
            { otherParty }
          </Text>
        </View>
        { transactionDate }
      </View>
      { transactionAmount }
    </View>
  )
}

const styles = StyleSheet.create({
  transaction: {
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
    width: 345,
    marginLeft: 15
  },
  transactionInfo: {
    marginLeft: -15
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
})

export default Transaction;
