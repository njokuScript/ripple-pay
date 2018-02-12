import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';

const TransactionView = (props) => {

    render() {
        let date = new Date(this.props.date);
        let { from, to } = this.props;
        let { fromAmount, fromCoin } = from;
        let { toAmount, toCoin } = to;
        return (
            <ScrollView
                style={styles.infoContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                <Text style={styles.infoText}>{fromCoin === "XRP" ? "send" : "deposit"} {fromAmount} {fromCoin} as {toAmount} {toCoin}</Text>
                <Text style={styles.infoText}>status:  {this.state.status}</Text>
                <Text style={styles.infoText}>send to address: {this.props.otherParty}</Text>
                <Text style={styles.infoText}>send to destination tag: {this.props.toDestTag}</Text>
                <Text style={styles.infoText}>{`${date.toLocaleString("en-us", { month: "short" })} ${date.getDate()}, ${date.getFullYear()} ${this.props.time}`}</Text>
                {/* {this.state.status.error ? <Text style={styles.infoText}>Error:  {this.state.status.error}</Text> : null} */}
                <Text style={styles.infoText}>changelly transaction Id:  {this.props.changellyTxnId}</Text>
                <Text style={styles.infoText}>Ripple ledger transaction id:  {this.state.rippleTxnId}</Text>
                <Text style={styles.infoText}>changelly deposit address:  {this.props.changellyAddress}</Text>
                <Text style={styles.infoText}>changelly deposit destination tag:  {this.props.changellyDestTag}</Text>
                <Text style={styles.infoText}>refund address:  {this.props.refundAddress || 'Not Entered'}</Text>
                <Text style={styles.infoText}>refund destination tag:  {this.props.refundDestTag || 'Not Relevant'}</Text>
            </ScrollView>
        );
    }
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

const mapDispatchToProps = dispatch => ({
    getChangellyRippleTransactionId: (changellyTxnId, refundAddress, refundDestTag, setTransactionId) => dispatch(getChangellyRippleTransactionId(changellyTxnId, refundAddress, refundDestTag, setTransactionId)),
    getChangellyTransactionStatus: (changellyTxnId, setTransactionStatus) => dispatch(getChangellyTransactionStatus(changellyTxnId, setTransactionStatus))
});

export default connect(
    null,
    mapDispatchToProps
)(ChangellyTransactionView);