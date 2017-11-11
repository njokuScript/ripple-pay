import React, { Component } from 'react';
import axios from 'axios';
import {
  GETSHAPEID_URL,
  SHAPE_TXTSTAT_URL
} from '../../api';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class ShapeTransactionView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      txStat: '',
      txnId: null
    }
  }

  // Maybe store the transaction id in a shapeshift transaction model to prevent this action.
  componentDidMount(){
    if (this.props.from.match(/XRP/)) {
      axios.get(GETSHAPEID_URL, {params: [this.props.shapeShiftAddress, this.props.date, this.props.refundAddress]}).then((response) => {
        this.setState({txnId: response.data.txnId || 'Not Found'})
      })
    }
    else {
      this.setState({txnId: 'Check other wallet'})
    }
    axios.get(`${SHAPE_TXTSTAT_URL}/${encodeURIComponent(this.props.shapeShiftAddress)}`).then((response) => {
      this.setState({txStat: response.data})
    })
  }

  render(){
    let ndate = new Date(this.props.date);
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Date:  {`${ndate.toLocaleString("en-us", { month: "short" })} ${ndate.getDate()}, ${ndate.getFullYear()} ${this.props.time}`}</Text>
        <Text style={styles.infoText}>Status:  {this.state.txStat.status ? this.state.txStat.status : 'Please Wait...'}</Text>
        {this.state.txStat.error ? <Text style={styles.infoText}>Error:  {this.state.txStat.error}</Text> : null}
        <Text style={styles.infoText}>orderId:  {this.props.orderId}</Text>
        <Text style={styles.infoText}>txnId:  {this.state.txnId}</Text>
        <Text style={styles.infoText}>Shapeshift Deposit Address:  {this.props.shapeShiftAddress}</Text>
        <Text style={styles.infoText}>Refund Address:  {this.props.refundAddress}</Text>
        <Text style={styles.infoText}>Other Party:  {this.props.otherParty}</Text>
        <Text style={styles.infoText}>{this.props.from.match(/XRP/) ? "Withdraw" : "Deposit"} {this.props.from} to {this.props.to}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  infoContainer: {
    marginTop: 10,
    marginLeft: 35,
    width: 340
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    // marginLeft: 30,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    paddingBottom: 13,
    paddingTop: 13,
    // textAlign: 'center'
  }
})
