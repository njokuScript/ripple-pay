//We made our user actions and auth actions all the same, remember this.
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
// import {configureStore} from '../store';
//KINDA HCKY BUT I'M IMPORTING THE ENTIRE STORE.
import {
  SIGNIN_URL,
  SIGNUP_URL,
  BANK_SEND_URL,
  TRANSACTIONS_URL,
  OLDADDR_URL,
  SEARCH_USERS_URL,
  ADDR_URL, SEND_URL,
  WALLETS_URL,
  DEST_URL,
  DEL_WALLET_URL,
  DEL_REGISTER_URL
} from '../api';

import { addAlert } from './alertsActions';

//The following auth stuff will ensure that the slice of state of the store for the user will have his user id and not undefined.
//Look at authreducer for defaultstate of user.
//Log the user out after 7 minutes of inactivity.
let timer;
let finishAndBeginTimer = ()=> {
  // window.clearTimeout(timer);
  // timer = window.setTimeout(function(){
  //   theStore.dispatch(thisunauthUser);
  //   theStore.dispatch(addAlert("Session Timed Out Due to Inactivity"));
  // },9999);
};

let authRequest = (url, data, ...cbs) => {
  return function(dispatch){
    return Keychain.getGenericPassword().then((creds) => {
      const authedAxios = axios.create({
        headers: { authorization: creds.password },
      });
      return authedAxios.post(url, data).then((response) => {
        for (let i = 0; i < cbs.length; i++) {
          let cb = cbs[i];
          dispatch(cb(response));
        }
      });
    });
  };
};

exports.loginUser = (email, password) => {
  return function(dispatch) {
    return axios.post(SIGNIN_URL, {email, password}).then((response) => {
      let { user_id, token, screenName } = response.data;
      console.log(token);
      Keychain.setGenericPassword(user_id, token)
        .then(function() {
          dispatch(authUser(user_id, screenName));
          // finishAndBeginTimer();
        })
      .catch((error) => {
          dispatch(addAlert("Could not log in. keychain"));
        });
    }).catch((error) => {
      dispatch(addAlert("Could not log in. axios"));
    });
  };
};

exports.signupUser = (email, password, screenName) => {
  return function(dispatch) {
    return axios.post(SIGNUP_URL, {email, password, screenName}).then((response) => {
      let {user_id, token} = response.data;
      Keychain.setGenericPassword(user_id, token)
      .then(function() {
        dispatch(authUser(user_id, screenName));
        // finishAndBeginTimer();
      })
      .catch((error) => {
        dispatch(addAlert("Could not log in."));
      });
    }).catch((error) => {
      dispatch(addAlert("Could not sign up."));
    });
  };
};

exports.signAndSend = (amount, fromAddress, toAddress, sourceTag, toDesTag) => {
  // finishAndBeginTimer();
  return authRequest(
    SEND_URL,
    {amount, fromAddress, toAddress, sourceTag, toDesTag},
    (response) => {
      let {message} = response.data;
      let respMessage;
      if ( message === "tesSUCCESS" )
      {
        respMessage = "Payment was Successful";
      }
      else if (message === "terQUEUED")
      {
        respMessage = "Payment placed in Queue";
      }
      else if (message === "tecNO_DST_INSUF_XRP")
      {
        respMessage = "Must send at least 20 ripple to this address";
      }
      else if (message === "tecDST_TAG_NEEDED")
      {
        respMessage = "Sending address requires a destination tag";
      }
      else if (message === "Balance Insufficient")
      {
        respMessage = "Balance Insufficient";
      }
      else if (message === "Someone's Trying to Get into Your Wallet")
      {
        respMessage = "Someone's Trying to Get into Your Wallet";
      }
      else if (message === "Refill and Send Successful"){
        respMessage = "Refill and Send Successful";
      }
      else
      {
        respMessage = "Payment Unsuccessful";
      }
      return addAlert(respMessage);
    }
  );
};

exports.sendInBank = (receiverScreenName, amount) => {
  // finishAndBeginTimer();
  return authRequest(
    BANK_SEND_URL,
    {receiverScreenName, amount},
    (response) => addAlert(response.data.message),
    (response) => receivedBalance(response.data)
  );
};

exports.delWallet = (desTag, cashRegister) => {
  // finishAndBeginTimer();
  return authRequest(DEL_WALLET_URL, {desTag, cashRegister}, (response) => {
    return deltheWallet(response.data);
  });
};

exports.removeCashRegister = () => {
  return authRequest(DEL_REGISTER_URL, {}, (response) => {
    return deltheRegister();
  });
};
exports.requestOnlyDesTag = (cashRegister) => {
  // finishAndBeginTimer();
  return authRequest(DEST_URL, {cashRegister}, (response) => {
    return receivedDesTag(response.data);
  });
};

exports.requestAddress = () => {
  // finishAndBeginTimer();
  return authRequest(ADDR_URL, {}, (response) => {
    return receivedAddress(response.data);
  });
};

exports.requestOldAddress = (user_id) => {
  return function (dispatch) {
    return axios.get(OLDADDR_URL, { params: user_id }).then((response) => {
      dispatch(receivedOldAddress(response.data));
    }).catch((error) => {
    });
  };
};

exports.requestTransactions = (user) => {
  // finishAndBeginTimer();
  return function(dispatch) {
    return axios.get(TRANSACTIONS_URL, { params: user.user_id } ).then((response) => {
      dispatch(receivedTransactions(response.data));
    }).catch((error) => {

    });
  };
};

exports.requestUsers = (item) => {
  return function(dispatch) {
    return axios.get(SEARCH_USERS_URL, {params: item} ).then(users => {
      dispatch(receivedUsers(users));
    }).catch((error) => {
    });
  };
};

exports.requestAllWallets = (user_id) => {
  // finishAndBeginTimer();
  return function(dispatch) {
    return axios.get(WALLETS_URL, { params: user_id } ).then((response) => {
      dispatch(receivedWallets(response.data));
    }).catch((error) => {
    });
  };
};
//Set timedlogout of the sessin to 5 minutes.

// Lets change these from 'AUTH_USER' to just AUTH_USER later like we're used to so we get better errors.

const authUser = (user_id, screenName) => {
  return {
    type: 'AUTH_USER',
    user_id,
    screenName
  };
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


// After we have received transactions from the backend, we can move along with this data
const receivedTransactions = (data) => {
  return {
    type: 'RECEIVED_TRANSACTIONS',
    data
  };
};

const receivedBalance = (data) => {
  return {
    type: 'RECEIVED_BALANCE',
    data
  };
};

const receivedUsers = (users) => {
  return {
    type: 'RECEIVED_USERS',
    users
  };
};

exports.unauthUser = {
  type: 'UNAUTH_USER'
};

const thisunauthUser = {
  type: 'UNAUTH_USER'
};
