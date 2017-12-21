import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
  COINS_URL,
  RATE_URL,
  MARKET_URL,
  SEND_AMOUNT_URL,
  SHAPER_URL,
  MAKESHIFT_URL,
  GETSHIFTS_URL,
  authRequest
 } from '../api';

// const axios = require('axios');
// const { COINS_URL } = require('../api');

exports.requestAllCoins = () => {
  return function(dispatch){
    return axios.get(COINS_URL).then((response)=>{
      dispatch(receivedCoins(response.data));
    });
  };
};

// If direction is true we look at xrp to other coin rate.
// If direction is false we look at other coin to xrp rate.
exports.requestRate = (coin) => {
  return function(dispatch){
    return axios.get(`${RATE_URL}/${coin}_xrp`).then((response)=>{
      dispatch(receivedRate(response.data, coin));
    });
  };
};

exports.requestMarketInfo = (coin1, coin2) => {
  return function(dispatch){
    return axios.get(`${MARKET_URL}/${coin1.toLowerCase()}_${coin2.toLowerCase()}`).then((response)=>{
      dispatch(receivedMarketInfo(response.data));
    });
  };
};

exports.sendAmount = (amount, withdrawal, pair, returnAddress, destTag = "") => {
  return function(dispatch){
    return axios.post(SEND_AMOUNT_URL, {amount, withdrawal, pair, returnAddress, destTag}).then((response) => {
      dispatch(receivedSendAmount(response.data));
    });
  };
};

exports.shapeshift = ( withdrawal, pair, returnAddress, destTag = "") => {
  return function(dispatch){
    return axios.post(SHAPER_URL, { withdrawal, pair, returnAddress, destTag}).then( (response) => {
      dispatch(receivedShapeshift(response.data));
    });
  };
};

exports.makeShapeshiftTransaction = (from, to, otherParty, shapeShiftAddress, refundAddress, orderId) => {
  return authRequest(
    "POST",
    MAKESHIFT_URL,
    {from, to, otherParty, shapeShiftAddress, refundAddress, orderId}
  );
};

exports.requestShifts = () => {
  return authRequest("GET", GETSHIFTS_URL, {}, (response) => {
    return receivedShifts(response.data);
  });
};

const receivedCoins = (data) => {
  return {
    type: 'RECEIVED_COINS',
    data
  };
};

const receivedSendAmount = (data) => {
  return {
    type: 'RECEIVED_SEND_AMOUNT',
    data
  };
};

const receivedShapeshift = (data) => {
  return {
    type: 'RECEIVED_SHAPESHIFT',
    data
  };
};

const receivedRate = (data, coin) => {
  return {
    type: 'RECEIVED_RATE',
    data,
    coin
  };
};

const receivedMarketInfo = (data) => {
  return{
    type: 'MARKET_INFO',
    data
  };
};

const receivedShifts = (data) => {
  return {
    type: 'RECEIVED_SHAPESHIFTS',
    data
  };
};

exports.clearSendAmount = {
  type: 'CLEARANCE'
};
