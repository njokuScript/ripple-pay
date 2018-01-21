import {
    GEN_PERSONAL_URL,
    REMOVE_PERSONAL_URL,
    PERSONAL_TRANSACTIONS_URL,
    PREPARE_PAYMENT_PERSONAL_URL,
    SEND_PAYMENT_PERSONAL_URL,
    authRequest
} from '../api';

import { addAlert, clearTransaction, receivedTransaction } from '../actions';

const RIPPLE_MESSAGES = {
    "tesSUCCESS": "Payment was successful",
    "terQUEUED": "Payment placed in Queue. Please wait.",
    "tecNO_DST_INSUF_XRP": "Must send at least 20 ripple to new ripple address",
    "tecDST_TAG_NEEDED": "Sending address requires a destination tag",
    "tefMAX_LEDGER": "Payment was submitted too late",
    // The following error message should never happen
    "tecUNFUNDED_PAYMENT": "Insufficient XRP to send payment",
};

// set secret will be sent from the component so the secret is not stored in the redux store, but set in the component's state
exports.genPersonalAddress = (setSecret) => {
    return authRequest("POST", GEN_PERSONAL_URL, {}, (response) => {
        if (response.data.message) {
            return addAlert(response.data.message);
        }
        setSecret(response.data.secret);
        return genPersonal(response.data);
    });
};

exports.removePersonalAddress = () => {
    return authRequest("POST", REMOVE_PERSONAL_URL, {}, 
    (response) => {
        return removePersonal();
    },
    (response) => {
        if (response.data.message) {
            return addAlert(response.data.message);
        }
    });
};

exports.getPersonalAddressTransactions = () => {
    return authRequest("GET", PERSONAL_TRANSACTIONS_URL, {}, (response) => {
        if (response.data.message) {
            return addAlert(response.data.message);
        }
        const { personalAddress, personalAddressBalance, personalAddressTransactions } = response.data;
        const parsedTransactions = parsePersonalTransactions(personalAddress, personalAddressTransactions);
        return receivedPersonalTransactions(personalAddressBalance, parsedTransactions);
    });
};

exports.preparePaymentWithPersonalAddress = (amount, fromAddress, toAddress, sourceTag, toDesTag) => {
    return authRequest(
        "POST", 
        PREPARE_PAYMENT_PERSONAL_URL, 
        { amount, fromAddress, toAddress, sourceTag, toDesTag }, 
        (response) => {
            if (response.data.message) {
                return addAlert(response.data.message);
            }
            const fee = response.data.fee;
            const transaction = { toAddress, toDesTag, amount, fee };
            return receivedTransaction(transaction);
        }
    );
};

exports.sendPaymentWithPersonalAddress = (fromAddress, secret, amount) => {
    return authRequest(
        "POST",
        SEND_PAYMENT_PERSONAL_URL,
        { fromAddress, secret, amount },
        (response) => {
            let { message } = response.data;
            const alert = RIPPLE_MESSAGES[message];
            if (alert) {
                return addAlert(alert);
            }
            return addAlert("Payment was unsuccessful");
        },
        () => {
            return clearTransaction();
        }
    );
};

function parsePersonalTransactions(userAddress, transactions) {
    return transactions.map((transaction) => {
        const transactionData = {};
        transactionData.txnId = transaction.id;
        transactionData.date = new Date(transaction.outcome.timestamp).getTime();
        const balanceChange = parseFloat(transaction.outcome.balanceChanges[userAddress][0].value);
        transactionData.amount = balanceChange;
        const destAddress = transaction.specification.destination.address;
        const destTag = transaction.specification.destination.tag;
        const sourceAddress = transaction.specification.source.address;
        const sourceTag = transaction.specification.source.tag;
        let counterParty, tag, counterPartyTag;

        if (destAddress === userAddress) {
            counterParty = sourceAddress;
            counterPartyTag = sourceTag;
            tag = destTag;
        } else {
            counterParty = destAddress;
            counterPartyTag = destTag;
            tag = sourceTag;
        }

        transactionData.otherParty = counterParty;
        transactionData.otherPartyTag = counterPartyTag;
        return transactionData;
    });
}

const genPersonal = (data) => {
    return {
        type: 'RECEIVED_PERSONAL_ADDRESS',
        data
    };
};

const removePersonal = () => {
    return {
        type: 'REMOVED_PERSONAL_ADDRESS'
    };
};

const receivedPersonalTransactions = (personalBalance, personalTransactions) => {
    return {
        type: 'RECEIVED_PERSONAL_TRANSACTIONS',
        personalBalance,
        personalTransactions
    };
};