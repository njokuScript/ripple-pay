import axios from 'axios';
import { COINS_URL, RATE_URL, MARKET_URL, SEND_AMOUNT_URL, SHAPER_URL } from '../api';

// const axios = require('axios');
// const { COINS_URL } = require('../api');

exports.requestAllCoins = () => {
  return function(dispatch){
    return axios.get(COINS_URL).then((response)=>{
      dispatch(receivedCoins(response.data));
    })
  }
}

//If direction is true we look at xrp to other coin rate.
//If direction is false we look at other coin to xrp rate.
exports.requestRate = (coin) => {
  return function(dispatch){
    return axios.get(`${RATE_URL}/${coin}_xrp`).then((response)=>{
      dispatch(receivedRate(response.data, coin));
    })
  }
}

exports.requestMarketInfo = (coin1, coin2) => {
  return function(dispatch){
    return axios.get(`${MARKET_URL}/${coin1.toLowerCase()}_${coin2.toLowerCase()}`).then((response)=>{
      dispatch(receivedMarketInfo(response.data));
    })
  }
}

exports.sendAmount = (amount, withdrawal, pair, returnAddress, destTag = "") => {
  return function(dispatch){
    return axios.post(SEND_AMOUNT_URL, {amount, withdrawal, pair, returnAddress, destTag}).then((response)=>{
      dispatch(receivedSendAmount(response.data));
    })
  }
}
exports.shapeshift = ( withdrawal, pair, returnAddress, destTag = "") => {
  return function(dispatch){
    return axios.post(SHAPER_URL, { withdrawal, pair, returnAddress, destTag}).then((response)=>{
      dispatch(receivedShapeshift(response.data));
    })
  }
}


receivedCoins = (data) => {
  return {
    type: 'RECEIVED_COINS',
    data
  }
}

receivedSendAmount = (data) => {
  return {
    type: 'RECEIVED_SEND_AMOUNT',
    data
  }
}
receivedShapeshift = (data) => {
  return {
    type: 'RECEIVED_SHAPESHIFT',
    data
  }
}

receivedRate = (data, coin) => {
  return {
    type: 'RECEIVED_RATE',
    data,
    coin
  }
}

receivedMarketInfo = (data) => {
  return{
    type: 'MARKET_INFO',
    data
  }
}