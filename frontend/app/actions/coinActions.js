import { XRP_TO_USD_URL, ALL_COINS_MARKET_URL, CRYPTO_COMPARE_COINS_URL } from '../api';
import { requestAllCoins } from '../actions';
import axios from 'axios';
import Promise from 'bluebird';
import Util from '../utils/util';

global.fetch = require('node-fetch');
const cc = require('cryptocompare');

exports.getXRPtoUSD = (xrpBalance, setUSD) => {
    axios.get(XRP_TO_USD_URL).then((response) => {
        const usdPerXRP = response.data.price;
        const usdBalance = usdPerXRP*xrpBalance;
        setUSD(usdBalance, usdPerXRP);
    });
};

exports.getRates = (orderedCoins) => {
    return function(dispatch) {
        return cc.priceMulti(orderedCoins, ['XRP']).then((ratesObj) => {
            return dispatch(mergeRates(ratesObj));
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    };
};

exports.getAllCoinData = (changellyCoinSet) => {
    return function(dispatch) {
        return cc.coinList()
            .then(cryptoCompareData => {

                const cryptoCompareCoinSet = cryptoCompareData.Data || {};
                axios.get(ALL_COINS_MARKET_URL)
                    .then((response) => {
                        const marketCoins = response.data;
    
                        if (!changellyCoinSet || !changellyCoinSet["XRP"]) {
                            return Promise.resolve({ orderedCoins: [], rippleCoin: {} });
                        }
    
                        const orderedCoins = [];
                        const totalCoinsObj = {};

                        marketCoins.forEach((marketCoin) => {
                            const coinSymbol = marketCoin.short.toUpperCase();
                            let changellyCoin = changellyCoinSet[coinSymbol];
    
                            if (changellyCoin && coinSymbol !== "NXT") {
                                let cryptoCompareCoin = cryptoCompareCoinSet[coinSymbol] || {};
                                const totalCoin = Object.assign({}, changellyCoin, marketCoin, cryptoCompareCoin);
        
                                totalCoinsObj[coinSymbol] = totalCoin;

                                if (coinSymbol === "XRP") {
                                    return;
                                }
        
                                orderedCoins.push(coinSymbol);
                            }
                        });
                        
                        return dispatch(setCoinData(orderedCoins, totalCoinsObj));
                    })
                    .catch((err) => {
                        console.log(err);
                        
                        if (!changellyCoinSet || !changellyCoinSet["XRP"]) {
                            return false;
                        }
                        return dispatch(Object.keys(changellyCoinSet), changellyCoinSet);
                    });
                })
            .catch((err) => {
                console.log(err);
                
                if (!changellyCoinSet || !changellyCoinSet["XRP"]) {
                    return false;
                }
                return dispatch(Object.keys(changellyCoinSet), changellyCoinSet);
            });
    };
};

const setCoinData = (orderedCoins, totalCoinsObj) => {
    return {
        type: 'SET_COIN_DATA',
        orderedCoins,
        totalCoinsObj
    };
};

const mergeRates = (ratesObj) => {
    return {
        type: 'MERGE_RATES',
        ratesObj
    };
};