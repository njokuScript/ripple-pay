import axios from 'axios';
import { COINS_URL, RATE_URL } from '../api';

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
exports.requestRate = (coin, direction) => {
  return function(dispatch){
    if ( direction )
    {
      return axios.get(`${RATE_URL}/xrp_${coin}`).then((response)=>{
        dispatch(receivedRate(response.data));
      })
    }
    else
    {
      return axios.get(`${RATE_URL}/${coin}_xrp`).then((response)=>{
        dispatch(receivedRate(response.data, coin));
      })
    }
  }
}

receivedCoins = (data) => {
  return {
    type: 'RECEIVED_COINS',
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
