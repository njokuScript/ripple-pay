import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
    CHANGELLY_TRANSACTION_URL,
    GET_CHANGELLY_TXNS_URL,
    CHANGELLY_TXN_STAT_URL,
    GET_RIPPLE_TXNID_CHANGELLY,
    CHANGELLY_RATE_URL,
    CHANGELLY_MINAMOUNT_URL,
    CHANGELLY_COINS_URL,
    NEXT_CHANGELLY_TRANSACTIONS_URL,
    authRequest
} from '../api';
import { addAlert } from '../actions';

// from is an object with { fromCoin, fromAmount }
exports.createChangellyTransaction = (from, to, withdrawalAddress, refundAddress, toDestTag="", refundDestTag=undefined) => {
    return authRequest(
        "POST", 
        CHANGELLY_TRANSACTION_URL, 
        { from, to, withdrawalAddress, refundAddress, toDestTag, refundDestTag }, 
        (response) => {
            if (response.message) {
                return addAlert(response.message);
            }
            return createdChangellyTransaction(response.data);
        }
    );
};

exports.requestChangellyTransactions = () => {
    return authRequest("GET", GET_CHANGELLY_TXNS_URL, {}, (response) => {
        return receivedChangellyTransactions(response.data);
    });
};

exports.loadNextChangellyTransactions = (minDate) => {
    return authRequest("GET", NEXT_CHANGELLY_TRANSACTIONS_URL, { params: [minDate] }, (response) => {
        return receivedNextChangellyTransactions(response.data);
    });
};

exports.getChangellyTransactionStatus = (changellyTxnId, setChangellyStatus) => {
    return authRequest("GET", CHANGELLY_TXN_STAT_URL, { params: [changellyTxnId] }, (response) => {
        const status = response.data.txStat;
        // statusObject params are { txStat, error }
        setChangellyStatus(status);
        return { type: "NON_REDUX" };
    });
};

exports.getChangellyRippleTransactionId = (changellyTxnId, refundAddress, refundDestTag, setTransactionId) => {
    return authRequest(
        "GET",
        GET_RIPPLE_TXNID_CHANGELLY,
        { params: [changellyTxnId, refundAddress, refundDestTag] },
        (response) => {
            console.log(response.data);
            
            setTransactionId(response.data.rippleTxnId || 'Not Found');
            return { type: "NON_REDUX" };
        }
    );
};

exports.requestRate = (coin) => {
    return authRequest(
        "GET",
        CHANGELLY_RATE_URL,
        { params: [coin] },
        (response) => {            
            const rate = parseFloat(response.data.rate);
            return receivedRate(rate, coin);
        }
    );
};

exports.getMinAmount = (fromCoin, toCoin) => {
    return authRequest(
        "GET",
        CHANGELLY_MINAMOUNT_URL,
        { params: [fromCoin, toCoin] },
        (response) => {
            const minAmount = parseFloat(response.data.minAmount);
            return receivedMinAmount(minAmount, fromCoin);
        }
    );
};

exports.requestAllCoins = () => {
    return authRequest(
        "GET",
        CHANGELLY_COINS_URL,
        {},
        (response) => {
            const changellyCoinSet = {};
            response.data.coins.forEach((coin) => {
                if (coin.enabled) {
                    changellyCoinSet[coin.name.toUpperCase()] = coin;
                }
            });
            return receivedCoins(changellyCoinSet);
        }
    );
};

const createdChangellyTransaction = (data) => {
    return {
        type: 'CREATED_CHANGELLY_TRANSACTION',
        data
    };
};

const receivedChangellyTransactions = (data) => {
    return {
        type: 'RECEIVED_CHANGELLY_TRANSACTIONS',
        data
    };
};

const receivedRate = (rate, coin) => {
    return {
        type: 'RECEIVED_CHANGELLY_RATE',
        rate,
        coin
    };
};

const receivedMinAmount = (minAmount, coin) => {
    return {
        type: 'RECEIVED_CHANGELLY_MINAMOUNT',
        minAmount,
        coin
    };
};

const receivedCoins = (changellyCoinSet) => {
    return {
        type: 'RECEIVED_COINS',
        changellyCoinSet
    };
};

const receivedNextChangellyTransactions = (data) => {
    return {
        type: 'RECEIVED_NEXT_CHANGELLY_TRANSACTIONS',
        data
    };
};

exports.clearChangellyTransaction = {
    type: 'CHANGELLY_CLEARANCE'
};