//This is the frontend communication with backend where we go so that we can route to specific URL's that we can go to the controller with.
//The next file to look at is router.js
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { addAlert, unauthUser } from '../actions';
import { apiKey } from '../../apiKey';
import { API_URL } from '../config_enums';
import Promise from 'bluebird';
// currently using localhost. but change to production server later.
const COINCAP_URL = 'https://coincap.io';

exports.RESPONSE_MESSAGES = {
    FAILURE: 0,
    SUCCESS: 1
};

exports.ADDR_URL = `${API_URL}/addrs`;
exports.SIGNIN_URL = `${API_URL}/signin`;
exports.SIGNUP_URL = `${API_URL}/signup`;
exports.TRANSACTIONS_URL = `${API_URL}/transactions`;
exports.NEXT_TRANSACTIONS_URL = `${API_URL}/nextTransactions`;
exports.SEARCH_USERS_URL = `${API_URL}/search`;
exports.SEND_URL = `${API_URL}/send`;
exports.PREPARE_PAYMENT_URL = `${API_URL}/payment`;
exports.WALLETS_URL = `${API_URL}/wallets`;
exports.DEST_URL = `${API_URL}/dest`;
exports.DEL_WALLET_URL = `${API_URL}/delwallet`;
exports.BANK_SEND_URL = `${API_URL}/banksend`;
exports.MAKESHIFT_URL = `${API_URL}/makeshift`;
exports.GETSHIFTS_URL = `${API_URL}/getshifts`;
exports.GETSHAPEID_URL = `${API_URL}/getShapeId`;
exports.AUTH_URL = `${API_URL}/authUrl`;
exports.CHANGE_PASSWORD_URL = `${API_URL}/changepass`;
exports.GEN_PERSONAL_URL = `${API_URL}/personal`;
exports.REMOVE_PERSONAL_URL = `${API_URL}/delpersonal`;
exports.PERSONAL_TRANSACTIONS_URL = `${API_URL}/personaltrans`;
exports.PREPARE_PAYMENT_PERSONAL_URL = `${API_URL}/personalpayment`;
exports.SEND_PAYMENT_PERSONAL_URL = `${API_URL}/sendpersonal`;
exports.PREPARE_PERSONAL_TO_BANK = `${API_URL}/preparePersonalToBank`;

// coin cap
exports.XRP_TO_USD_URL = `${COINCAP_URL}/page/XRP`;
exports.ALL_COINS_MARKET_URL = `${COINCAP_URL}/front`;

// changelly
exports.CHANGELLY_TRANSACTION_URL = `${API_URL}/makechange`;
exports.GET_CHANGELLY_TXNS_URL = `${API_URL}/getchanges`;
exports.CHANGELLY_TXN_STAT_URL = `${API_URL}/getchangestatus`;
exports.GET_RIPPLE_TXNID_CHANGELLY = `${API_URL}/changellyRippleTxnId`;
exports.NEXT_CHANGELLY_TRANSACTIONS_URL = `${API_URL}/nextchanges`;
exports.CHANGELLY_RATE_URL = `${API_URL}/changellyRate`;
exports.CHANGELLY_MINAMOUNT_URL = `${API_URL}/minAmount`;
exports.CHANGELLY_COINS_URL = `${API_URL}/changellyCoins`;

function resolveError(errorResponse, dispatch) {
    return function(dispatch) {
        const errorStatusMap = {
            401: {"desc": "Unauthorized/session timeout", "fns": [unauthUser, () => dispatch(addAlert("Token expired!")) ] },
            429: {"desc": "Too many requests", "fns": [() => dispatch(addAlert(errorResponse.data.message))]},
            422: {"desc": "Custom Error Code", "fns": [() => {
                
                if (errorResponse.data.error.constructor === String) {
                    dispatch(addAlert(errorResponse.data.error));
                } 
                else if (errorResponse.data.error.constructor === Array) {
                    errorResponse.data.error.forEach((err) => {
                        dispatch(addAlert(err));
                    });
                }

            }]}
        };

        const errorStatusResolution = errorStatusMap[errorResponse.status]; 
        if (errorStatusResolution) {
            errorStatusResolution.fns.forEach((errorTask) => {
               errorTask();
            }); 
            return true;   
        }

        return dispatch(addAlert("Error making request"));
    };
}

exports.authRequest = (requestType, url, data, ...cbs) => {
    return function (dispatch) {
        return Keychain.getGenericPassword()
        .then((creds) => {

            if (!creds.password) {
                return;
            }
            
            const authedAxios = axios.create({
                headers: { authorization: creds.password, apiKey: apiKey },
            });

            return authedAxios[requestType.toLowerCase()](url, data)
            .then((response) => {
                const token = response.data.token;
                delete response.data.token;
                
                Keychain.setGenericPassword(null, token).then(() => {
                    for (let i = 0; i < cbs.length; i++) {
                        let cb = cbs[i];
                        dispatch(cb(response));
                    }
                });
                return Promise.resolve(exports.RESPONSE_MESSAGES.SUCCESS);
            })
            .catch((err) => {
                console.log(err.response);
                
                dispatch(resolveError(err.response));
                return Promise.resolve(exports.RESPONSE_MESSAGES.FAILURE);
            });

        });
    };
};