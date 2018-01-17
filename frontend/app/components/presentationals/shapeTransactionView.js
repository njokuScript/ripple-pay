import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { getShapeshiftTransactionStatus, getShapeshiftTransactionId } from '../../actions';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native';

class ShapeTransactionView extends React.Component {
  constructor(props){
    super(props);
    this.setShapeshiftStatus = this.setShapeshiftStatus.bind(this);
    this.setTransactionId = this.setTransactionId.bind(this);
    this.state = {
      txStat: '',
      txnId: 'please wait...'
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
    let status = "no deposit has been made";
    if (!this.state.txStat.status === "no_deposits") {
      status = "complete";
    } 
    return (
      <ScrollView style={styles.infoContainer}>
          <Text style={styles.infoText}>{fromCoin === "XRP" ? "send" : "deposit"} {fromAmount} {fromCoin} as {toAmount} {toCoin}</Text>
          <Text style={styles.infoText}>status:  {status ? status : 'please wait...'}</Text>
          <Text style={styles.infoText}>sent to: {this.props.otherParty}</Text>
          <Text style={styles.infoText}>{`${ndate.toLocaleString("en-us", { month: "short" })} ${ndate.getDate()}, ${ndate.getFullYear()} ${this.props.time}`}</Text>
          {this.state.txStat.error ? <Text style={styles.infoText}>Error:  {this.state.txStat.error}</Text> : null}
          <Text style={styles.infoText}>order id:  {this.props.orderId}</Text>
          <Text style={styles.infoText}>transaction id:  {this.state.txnId}</Text>
          <Text style={styles.infoText}>shapeshift deposit address:  {this.props.shapeShiftAddress}</Text>
          <Text style={styles.infoText}>refund address:  {this.props.refundAddress}</Text>
      </ScrollView>
    );
  }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  infoContainer: {
    width: width,
    marginBottom: height/12
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
  getShapeshiftTransactionId: (shapeShiftAddress, date, refundAddress, setTransactionId) =>  dispatch(getShapeshiftTransactionId(shapeShiftAddress, date, refundAddress, setTransactionId))
});

export default connect(
  null,
  mapDispatchToProps
)(ShapeTransactionView);