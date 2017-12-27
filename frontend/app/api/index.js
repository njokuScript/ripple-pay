//This is the frontend communication with backend where we go so that we can route to specific URL's that we can go to the controller with.
//The next file to look at is router.js
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import { addAlert } from '../actions/alertsActions';
// import { unauthUser } from '../actions/authActions';
// currently using localhost. but change to production server later.
var API_URL = 'http://localhost:3000/v1';
var SHAPESHIFT_URL = 'https://shapeshift.io';
var COINCAP_URL = 'https://coincap.io';
// var API_URL = 'https://fathomless-reef-57802.herokuapp.com/v1';
exports.ADDR_URL = `${API_URL}/addrs`;
exports.SIGNIN_URL = `${API_URL}/signin`;
exports.SIGNUP_URL = `${API_URL}/signup`;
exports.TRANSACTIONS_URL = `${API_URL}/transactions`;
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
exports.DEL_REGISTER_URL = `${API_URL}/delRegister`;
exports.AUTH_URL = `${API_URL}/authUrl`;

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

function resolveError(errorStatus, dispatch) {
    return function(dispatch) {
        const AuthActions = require('../actions/authActions');
        const errorMap = {
            401: {"desc": "Unauthorized", "fns": [AuthActions.unauthUser, () => addAlert("Unauthorized attempt!") ] },
            500: {"desc": "Jwt token expired", "fns": [AuthActions.unauthUser, () => addAlert("Session Expired!") ] }
        }
        const errorResponse = errorMap[errorStatus];
        if (errorResponse) {
            errorResponse.fns.forEach((errorTask) => {
                dispatch(errorTask());
            });    
        }
        else {
            dispatch(addAlert("Error making request"));
        }
    }
}

exports.authRequest = (requestType, url, data, ...cbs) => {
    return function (dispatch) {
        return Keychain.getGenericPassword().then((creds) => {

            const authedAxios = axios.create({
                headers: { authorization: creds.password },
            });

            return authedAxios[requestType.toLowerCase()](url, data)
            .then((response) => {
                const token = response.data.token;

                Keychain.setGenericPassword(null, token).then(() => {
                    for (let i = 0; i < cbs.length; i++) {
                        let cb = cbs[i];
                        dispatch(cb(response));
                    }
                })

            })
            .catch((err) => {
                const errorStatus = err.response.status;
                dispatch(resolveError(errorStatus));
            })
        });
    };
};