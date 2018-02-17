import {
    BANK_SEND_URL,
    TRANSACTIONS_URL,
    SEND_URL,
    PREPARE_PAYMENT_URL,
    NEXT_TRANSACTIONS_URL,
    authRequest
} from '../api';

import { addAlert } from './alertsActions';

const RIPPLE_MESSAGES = {
    "tesSUCCESS": "Payment was successful",
    "terQUEUED": "Payment placed in Queue. Please wait.",
    "tecNO_DST_INSUF_XRP": "Must send at least 20 ripple to new ripple address",
    "tecDST_TAG_NEEDED": "Sending address requires a destination tag",
    "tefMAX_LEDGER": "Payment was submitted too late",
    "tefPAST_SEQ": "Payment was submitted too late",
    // The following error message should never happen
    "tecUNFUNDED_PAYMENT": "Insufficient XRP to send payment",
    "tefBAD_AUTH_MASTER": "Incorrect secret key for wallet",
    // temporary email address
    "bankInsufficientRippleError": "RipplePay cashRegister error. Please contact us at ripplePay@gmail.com"
};

exports.signAndSend = (fromAddress, amount) => {
    return authRequest(
        "POST",
        SEND_URL,
        { fromAddress, amount },
        (response) => {
            let { message } = response.data;
            const alert = RIPPLE_MESSAGES[message];
            if (alert) {
                return addAlert(alert);
            }
            return addAlert("Payment was unsuccessful");
        },
        () => {
            return exports.clearTransaction();
        }
    );
};

exports.preparePayment = (amount, fromAddress, toAddress, sourceTag, toDesTag) => {
    return authRequest(
        "POST",
        PREPARE_PAYMENT_URL,
        { amount, fromAddress, toAddress, sourceTag, toDesTag },
        (response) => {
            if (response.data.message) {
                return addAlert(response.data.message);
            }
            const fee = parseFloat(response.data.fee);
            const transaction = { toAddress, toDesTag, amount, fee };
            return exports.receivedTransaction(transaction);
        }
    );
};

exports.sendInBank = (receiverScreenName, amount) => {
    return authRequest(
        "POST",
        BANK_SEND_URL,
        { receiverScreenName, amount },
        (response) => addAlert(response.data.message)
    );
};

exports.requestTransactions = () => {
    return authRequest("GET", TRANSACTIONS_URL, {}, (response) => {
        return receivedTransactions(response.data);
    });
};

exports.loadNextTransactions = (maxDate) => {
    return authRequest("GET", NEXT_TRANSACTIONS_URL, { params: [maxDate] }, (response) => {
        return receivedNextTransactions(response.data);
    });
};

exports.receivedTransaction = (data) => {
    return {
        type: 'RECEIVED_TRANSACTION',
        data
    };
};

exports.clearTransaction = () => {
    return {
        type: 'CLEAR_TRANSACTION',
    };
};

const receivedTransactions = (data) => {
    return {
        type: 'RECEIVED_TRANSACTIONS',
        data
    };
};

const receivedNextTransactions = (data) => {
    return {
        type: 'RECEIVED_NEXT_TRANSACTIONS',
        data
    };
};


const receivedBalance = (data) => {
    return {
        type: 'RECEIVED_BALANCE',
        data
    };
};

exports.refreshShouldLoadMoreValues = {
    type: 'REFRESH_LOAD_MORE'
};