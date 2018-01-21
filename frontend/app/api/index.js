//This is the frontend communication with backend where we go so that we can route to specific URL's that we can go to the controller with.
//The next file to look at is router.js
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { addAlert, unauthUser } from '../actions';
import { apiKey } from '../../apiKey';
import { API_URL } from '../config_enums';
// currently using localhost. but change to production server later.
var SHAPESHIFT_URL = 'https://shapeshift.io';
var COINCAP_URL = 'https://coincap.io';

exports.ADDR_URL = `${API_URL}/addrs`;
exports.SIGNIN_URL = `${API_URL}/signin`;
exports.SIGNUP_URL = `${API_URL}/signup`;
exports.TRANSACTIONS_URL = `${API_URL}/transactions`;
exports.NEXT_TRANSACTIONS_URL = `${API_URL}/nextTransactions`;
exports.NEXT_SHAPESHIFT_TRANSACTIONS_URL = `${API_URL}/nextShapeShiftTransactions`;
exports.SEARCH_USERS_URL = `${API_URL}/search`;
exports.SEND_URL = `${API_URL}/send`;
exports.PREPARE_PAYMENT_URL = `${API_URL}/payment`;
exports.WALLETS_URL = `${API_URL}/wallets`;
exports.DEST_URL = `${API_URL}/dest`;
exports.DEL_WALLET_URL = `${API_URL}/delwallet`;
exports.BANK_SEND_URL = `${API_URL}/banksend`;
exports.OLDADDR_URL = `${API_URL}/old`;
exports.MAKESHIFT_URL = `${API_URL}/makeshift`;
exports.GETSHIFTS_URL = `${API_URL}/getshifts`;
exports.GETSHAPEID_URL = `${API_URL}/getShapeId`;
exports.AUTH_URL = `${API_URL}/authUrl`;
exports.GEN_PERSONAL_URL = `${API_URL}/personal`;
exports.REMOVE_PERSONAL_URL = `${API_URL}/delpersonal`;
exports.PERSONAL_TRANSACTIONS_URL = `${API_URL}/personaltrans`;
exports.PREPARE_PAYMENT_PERSONAL_URL = `${API_URL}/personalpayment`;
exports.SEND_PAYMENT_PERSONAL_URL = `${API_URL}/sendpersonal`;

// shape shift
exports.COINS_URL = `${SHAPESHIFT_URL}/getcoins`;
exports.RATE_URL = `${SHAPESHIFT_URL}/rate`;
exports.MARKET_URL = `${SHAPESHIFT_URL}/marketinfo`;
exports.SEND_AMOUNT_URL = `${SHAPESHIFT_URL}/sendamount`;
exports.SHAPER_URL = `${SHAPESHIFT_URL}/shift`;
exports.TIME_URL = `${SHAPESHIFT_URL}/timeremaining`;
exports.SHAPE_TXN_STAT_URL = `${SHAPESHIFT_URL}/txStat`;

// coin cap
exports.XRP_TO_USD_URL = `${COINCAP_URL}/page/XRP`;

function resolveError(errorResponse, dispatch) {
    return function(dispatch) {
        const errorStatusMap = {
            401: {"desc": "Unauthorized", "fns": [unauthUser, () => addAlert("Unauthorized attempt!") ] },
            429: {"desc": "Too many requests", "fns": [() => addAlert(errorResponse.data.message)]},
        };

        const errorStatusResolution = errorStatusMap[errorResponse.status]; 
        if (errorStatusResolution) {
            errorStatusResolution.fns.forEach((errorTask) => {
                dispatch(errorTask());
            }); 
            return true;   
        }

        const errorDataMap = [
            { "regex": /token\ has\ expired/, "desc": "Session Expired!", "fns": [unauthUser, () => addAlert("Session Expired!")] },
        ];

        const errorDataResolution = errorDataMap.find((data) => errorResponse.data.match(data.regex));
        if (errorDataResolution) {
            errorDataResolution.fns.forEach((errorTask) => {
                dispatch(errorTask());
            });
            return true;
        }

        return dispatch(addAlert("Error making request"));
    };
}

exports.authRequest = (requestType, url, data, ...cbs) => {
    return function (dispatch) {
        return Keychain.getGenericPassword().then((creds) => {

            const authedAxios = axios.create({
                headers: { authorization: creds.password, apiKey: apiKey },
            });

            return authedAxios[requestType.toLowerCase()](url, data)
            .then((response) => {
                const token = response.data.token;

                Keychain.setGenericPassword(null, token).then(() => {
                    for (let i = 0; i < cbs.length; i++) {
                        let cb = cbs[i];
                        dispatch(cb(response));
                    }
                });
                return true;
            })
            .catch((err) => {
                return dispatch(resolveError(err.response));
            });
        });
    };
};