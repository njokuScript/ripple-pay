import React, { Component } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class ShapeTransactionView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      txStat: ''
    }
  }

  componentDidMount(){
    axios.get(`https://shapeshift.io/txStat/${encodeURIComponent(this.props.shapeShiftAddress)}`).then((response) => {
      this.setState({txStat: response.data});
    }).catch((err) => console.log(err))
  }

  render(){
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Status:  {this.state.txStat.status ? this.state.txStat.status : 'Please Wait...'}</Text>
        {this.state.txStat.error ? <Text style={styles.infoText}>Error:  {this.state.txStat.error}</Text> : null}
        <Text style={styles.infoText}>orderId:  {this.props.orderId}</Text>
        <Text style={styles.infoText}>txnId:  {this.props.txnId}</Text>
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
    marginTop: 10
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    // marginLeft: 30,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    paddingBottom: 10,
    paddingTop: 10,
    // textAlign: 'center'
  }
})
