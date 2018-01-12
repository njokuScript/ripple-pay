import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { getShapeshiftTransactionStatus, getShapeshiftTransactionId } from '../../actions';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class ShapeTransactionView extends React.Component {
  constructor(props){
    super(props);
    this.setShapeshiftStatus = this.setShapeshiftStatus.bind(this);
    this.setTransactionId = this.setTransactionId.bind(this);
    this.state = {
      txStat: '',
      txnId: 'Please Wait...'
    };
  }

  // Maybe store the transaction id in a shapeshift transaction model to prevent this action.
  componentDidMount(){
    const { shapeShiftAddress, date, refundAddress } = this.props;
    if (this.props.from.fromCoin === "XRP") {
      this.props.getShapeshiftTransactionId(shapeShiftAddress, date, refundAddress, this.setTransactionId);
    }
    else {
      this.setTransactionId('Non-XRP deposit. Check other wallet.');
    }
    getShapeshiftTransactionStatus(shapeShiftAddress, this.setShapeshiftStatus);
  }

  setShapeshiftStatus(statusObject) {
    this.setState({ txStat: statusObject });
  }

  setTransactionId(txnId) {
    this.setState({ txnId });
  }

  render(){
    let ndate = new Date(this.props.date);
    let { from, to} = this.props;
    let { fromAmount, fromCoin } = from;
    let { toAmount, toCoin } = to;
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Status:  {this.state.txStat.status ? this.state.txStat.status : 'Please Wait...'}</Text>
        <Text style={styles.infoText}>Other Party:  {this.props.otherParty}</Text>
        <Text style={styles.infoText}>Date:  {`${ndate.toLocaleString("en-us", { month: "short" })} ${ndate.getDate()}, ${ndate.getFullYear()} ${this.props.time}`}</Text>
        <Text style={styles.infoText}>{fromCoin === "XRP" ? "Withdraw" : "Deposit"} {fromAmount} {fromCoin} to {toAmount} {toCoin}</Text>
        {this.state.txStat.error ? <Text style={styles.infoText}>Error:  {this.state.txStat.error}</Text> : null}
        <Text style={styles.infoText}>orderId:  {this.props.orderId}</Text>
        <Text style={styles.infoText}>txnId:  {this.state.txnId}</Text>
        <Text style={styles.infoText}>Shapeshift Deposit Address:  {this.props.shapeShiftAddress}</Text>
        <Text style={styles.infoText}>Refund Address:  {this.props.refundAddress}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoContainer: {
    // marginTop: 10,
    // marginLeft: 35,
    // width: 340
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    // marginLeft: 30,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    padding: 20
    // textAlign: 'center'
  }
});

const mapDispatchToProps = dispatch => ({
  getShapeshiftTransactionId: (shapeShiftAddress, date, refundAddress, setTransactionId) =>  dispatch(getShapeshiftTransactionId(shapeShiftAddress, date, refundAddress, setTransactionId))
});

export default connect(
  null,
  mapDispatchToProps
)(ShapeTransactionView);