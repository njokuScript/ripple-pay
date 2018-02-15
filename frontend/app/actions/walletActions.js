import {
    OLDADDR_URL,
    ADDR_URL, 
    WALLETS_URL,
    DEST_URL,
    DEL_WALLET_URL,
    authRequest
} from '../api';

import { addAlert } from '../actions';

exports.delWallet = (desTag) => {
    return authRequest("POST", DEL_WALLET_URL, { desTag }, (response) => {
        return deltheWallet(response.data);
    });
};

exports.generateDestTag = () => {
    return authRequest("POST", DEST_URL, {}, (response) => {
        if (response.data.message) {
            return addAlert(response.data.message);
        }
        return receivedDesTag(response.data);
    });
};

exports.requestAddress = () => {
    return authRequest("POST", ADDR_URL, {}, (response) => {
        return receivedAddress(response.data);
    });
};


const deltheWallet = (data) => {
    return {
        type: 'DEL_WALLET',
        data
    };
};

const deltheRegister = () => {
    return {
        type: 'DEL_REGISTER'
    };
};

const receivedWallets = (data) => {
    return {
        type: 'RECEIVED_WALLETS',
        data
    };
};
const receivedDesTag = (data) => {
    return {
        type: 'RECEIVED_DESTAG',
        data
    };
};

const receivedAddress = (data) => {
    return {
        type: 'RECEIVED_ADDRESS',
        data
    };
};
const receivedOldAddress = (data) => {
    return {
        type: 'RECEIVED_OLD_ADDRESS',
        data
    };
};

exports.changeWallet = {
    type: 'CHANGE_WALLET'
};
