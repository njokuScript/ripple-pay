//This is the frontend communication with backend where we go so that we can route to specific URL's that we can go to the controller with.
//The next file to look at is router.js
import * as Keychain from 'react-native-keychain';
import axios from 'axios';

var API_URL = 'http://localhost:3000/v1';
var SHAPESHIFT_URL = 'https://shapeshift.io';
// var API_URL = 'https://fathomless-reef-57802.herokuapp.com/v1';
exports.ADDR_URL = `${API_URL}/addrs`;
exports.SIGNIN_URL = `${API_URL}/signin`;
exports.SIGNUP_URL = `${API_URL}/signup`;
exports.TRANSACTIONS_URL = `${API_URL}/transactions`;
exports.SEARCH_USERS_URL = `${API_URL}/search`;
exports.SEND_URL = `${API_URL}/send`;
exports.WALLETS_URL = `${API_URL}/wallets`;
exports.DEST_URL = `${API_URL}/dest`;
exports.DEL_WALLET_URL = `${API_URL}/delwallet`;
exports.BANK_SEND_URL = `${API_URL}/banksend`;
exports.OLDADDR_URL = `${API_URL}/old`;
exports.MAKESHIFT_URL = `${API_URL}/makeshift`;
exports.GETSHIFTS_URL = `${API_URL}/getshifts`;
exports.GETSHAPEID_URL = `${API_URL}/getShapeId`;
exports.DEL_REGISTER_URL = `${API_URL}/delRegister`;
exports.AUTH_URL = `${API_URL}/authUrl`;

// shape shift
exports.COINS_URL = `${SHAPESHIFT_URL}/getcoins`;
exports.RATE_URL = `${SHAPESHIFT_URL}/rate`;
exports.MARKET_URL = `${SHAPESHIFT_URL}/marketinfo`;
exports.SEND_AMOUNT_URL = `${SHAPESHIFT_URL}/sendamount`;
exports.SHAPER_URL = `${SHAPESHIFT_URL}/shift`;
exports.SHAPE_TXN_STAT_URL = `${SHAPESHIFT_URL}/txStat`;

exports.reduxAuthRequest = (requestType, url, data, ...cbs) => {
    return function (dispatch) {
        return Keychain.getGenericPassword().then((creds) => {
            const authedAxios = axios.create({
                headers: { authorization: creds.password },
            });
            return authedAxios[requestType.toLowerCase()](url, data).then((response) => {
                for (let i = 0; i < cbs.length; i++) {
                    let cb = cbs[i];
                    dispatch(cb(response));
                }
            })
            .catch((err) => {
                // logout logic
            })
        });
    };
};

exports.authRequest = (requestType, url, data, ...cbs) => {
    return Keychain.getGenericPassword().then((creds) => {
        const authedAxios = axios.create({
            headers: { authorization: creds.password },
        });
        return authedAxios[requestType.toLowerCase()](url, data).then((response) => {
            for (let i = 0; i < cbs.length; i++) {
                let cb = cbs[i];
                cb(response);
            }
        })
        .catch((err) => {
            // logout logic
        })
    });
};