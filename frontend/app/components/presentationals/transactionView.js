import React, { Component } from 'react';
import { connect } from 'react-redux';
import Util from '../../utils/util';

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';

const TransactionView = (props) => {
    let date = new Date(props.date);
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{props.amount < 0 ? "send" : "deposit"} {Math.abs(props.amount)} Ʀ</Text>
            <Text style={styles.infoText}>send to address: {props.otherParty}</Text>
            <Text style={styles.infoText}>send to destination tag: {props.otherPartyTag}</Text>
            <Text style={styles.infoText}>{`${date.toLocaleString("en-us", { month: "short" })} ${date.getDate()}, ${date.getFullYear()} ${props.time}`}</Text>
            <Text style={styles.infoText} onPress={() => Util.clipBoardCopy(props.txnId)}>Ripple Ledger Transaction Id:  {props.txnId}</Text>
        </View>
    );

}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    infoContainer: {
        width: width,
        marginBottom: height / 12
    },
    infoText: {
        fontSize: 13,
        borderWidth: .5,
        borderColor: '#d3d3d3',
        padding: 20,
        fontWeight: "500"
    }
});

export default TransactionView;