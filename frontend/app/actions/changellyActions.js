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

// from is an object with { fromCoin, fromAmount }
exports.createChangellyTransaction = (from, to, withdrawalAddress, refundAddress, toDestTag="", refundDestTag=undefined) => {
    return authRequest(
        CHANGELLY_TRANSACTION_URL, 
        "POST", 
        { from, to, withdrawalAddress, refundAddress, toDestTag, refundDestTag }, 
        (response) => {
            return createdChangellyTransaction(response.data);
        }
    );
};

exports.requestChangellyTransactions = () => {
    return authRequest("GET", GET_CHANGELLY_TXNS_URL, {}, (response) => {
        return receivedChangellyTransactions(response.data);
    });
};

exports.loadNextChangellyTransactions = (maxDate) => {
    return authRequest("GET", NEXT_CHANGELLY_TRANSACTIONS_URL, { params: [maxDate] }, (response) => {
        return receivedNextChangellyTransactions(response.data);
    });
};

exports.getChangellyTransactionStatus = (changellyTxnId, setChangellyStatus) => {
    return authRequest("GET", CHANGELLY_TXN_STAT_URL, { params: [changellyTxnId] }, (response) => {
        const statusObject = response.data;
        // statusObject params are { txStat, error }
        setChangellyStatus(statusObject);
        return true;
    });
};

exports.getChangellyTransactionId = (changellyAddress, date, refundAddress, setTransactionId) => {
    return authRequest(
        "GET",
        GET_RIPPLE_TXNID_CHANGELLY,
        { params: [changellyAddress, date, refundAddress] },
        (response) => {
            setTransactionId(response.data.txnId || 'Not Found');
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
            return receivedRate(response.data, coin);
        }
    );
};

exports.getMinAmount = (fromCoin, toCoin) => {
    return authRequest(
        "GET",
        CHANGELLY_MINAMOUNT_URL,
        { params: [fromCoin, toCoin] },
        (response) => {
            return receivedMinAmount(response.data);
        }
    );
};

exports.requestAllCoins = () => {
    return authRequest(
        "GET",
        CHANGELLY_COINS_URL,
        {},
        (response) => {
            return receivedCoins(response.data);
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

const receivedRate = (data, coin) => {
    return {
        type: 'RECEIVED_RATE',
        data,
        coin
    };
};

const receivedMinAmount = (data) => {
    return {
        type: 'RECEIVED_MIN_AMOUNT',
        data,
    };
};

const receivedCoins = (data) => {
    return {
        type: 'RECEIVED_COINS',
        data
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