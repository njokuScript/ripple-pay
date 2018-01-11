//We made our user actions and auth actions all the same, remember this.
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
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
  DEL_REGISTER_URL,
  PREPARE_PAYMENT_URL,
  AUTH_URL,
  NEXT_TRANSACTIONS_URL,
  NEXT_SHAPESHIFT_TRANSACTIONS_URL,
  authRequest
} from '../api';

import { addAlert, clearAlerts } from './alertsActions';
import starter from '../index.js';

const ERRORS = {
  "LOGIN": [
    { regex: /Wrong\ email\/password\ combination/, msg: "Wrong email/password combination!" }
  ],
  "SIGNUP": [
    { regex: /MongoError.+duplicate\ key\ error.+screenName/, msg: "Screen name already exists. Please try again" },
    { regex: /MongoError.+duplicate\ key\ error.+email/, msg: "Email already exists. Please try again" },
    { regex: /ValidationError.+screenName/, msg: "Please enter a valid screen name (no symbols)" },
    { regex: /ValidationError.+email/, msg: "Please enter a valid email" }
  ]
}; 

const RIPPLE_MESSAGES = {
  "tesSUCCESS": "Payment was successful",
  "terQUEUED": "Payment placed in Queue. Please wait.",
  "tecNO_DST_INSUF_XRP": "Must send at least 20 ripple to new ripple address",
  "tecDST_TAG_NEEDED": "Sending address requires a destination tag",
  "tefMAX_LEDGER": "Payment was submitted too late",
  "tecUNFUNDED_PAYMENT": "Insufficient XRP to send payment",
};

function resolveError(action, errorData) {
  if (typeof errorData === 'object') {
    return errorData.message || errorData.error;
  }
  for (let index = 0; index < ERRORS[action].length; index++) {
    const type = ERRORS[action][index];
    if (errorData.match(type.regex)) {
      return type.msg;
    } 
  }
  return null;
}

exports.loginUser = (email, password) => {
  return function(dispatch) {
    return axios.post(SIGNIN_URL, {email, password})
    .then((response) => {
      let { token, screenName, wallets, cashRegister } = response.data;
      const usernameCred = null;
      const passwordCred = token;
      Keychain.setGenericPassword(null, passwordCred)
        .then(function() {
          dispatch(authUser(screenName, wallets, cashRegister));
        })
      .catch((error) => {
          dispatch(addAlert("Could not log in. keychain issue."));
        });
    })
    .catch((error) => {
      const errorMessage = resolveError("LOGIN", error.response.data);
      errorMessage ? dispatch(addAlert(errorMessage)) : dispatch(addAlert("Could not log in"));
    });
  };
};

exports.signupUser = (email, password, screenName) => {
  return function(dispatch) {
    return axios.post(SIGNUP_URL, {email, password, screenName})
    .then((response) => {
      let { token } = response.data;
      const usernameCred = null;
      const passwordCred = token;
      Keychain.setGenericPassword(usernameCred, passwordCred)
      .then(function() {
        dispatch(authUser(screenName));
      })
      .catch((error) => {
        dispatch(addAlert("Could not sign up. keychain issue."));
      });
    })
    .catch((error) => {
      const errorMessage = resolveError("SIGNUP", error.response.data);

      if (errorMessage.constructor === String) {
        dispatch(addAlert(errorMessage));
        return;
      }

      if (errorMessage.constructor === Array) {
        errorMessage.forEach((message) => {
          dispatch(addAlert(message));
        });
        return;
      }

      dispatch(addAlert("Could not sign up"));
    });
  };
};

exports.comparePassword = function(password) {
  return authRequest(
    "POST",
    AUTH_URL,
    { password },
    (response) => {
      return updatePasswordAttempts(response.data);
    }
  );
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
        return addAlert(alert)
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
      const fee = response.data.fee;
      const transaction = { toAddress, toDesTag, amount, fee }
      return receivedTransaction(transaction);
    } 
  );
};

exports.sendInBank = (receiverScreenName, amount) => {
  return authRequest(
    "POST",
    BANK_SEND_URL,
    {receiverScreenName, amount},
    (response) => addAlert(response.data.message),
    (response) => receivedBalance(response.data)
  );
};

exports.delWallet = (desTag, cashRegister) => {
  return authRequest("POST", DEL_WALLET_URL, {desTag, cashRegister}, (response) => {
    return deltheWallet(response.data);
  });
};

exports.removeCashRegister = () => {
  return authRequest("POST", DEL_REGISTER_URL, {}, (response) => {
    return deltheRegister();
  });
};
exports.requestOnlyDesTag = (cashRegister) => {
  return authRequest("POST", DEST_URL, {cashRegister}, (response) => {
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

exports.requestOldAddress = () => {
  return authRequest("GET", OLDADDR_URL, {}, (response) => {
    return receivedOldAddress(response.data);
  });
};

exports.requestTransactions = () => {
  return authRequest("GET", TRANSACTIONS_URL, {}, (response) => {
    return receivedTransactions(response.data);
  });
};

exports.loadNextTransactions = (maxDate) => {
  return authRequest("GET", NEXT_TRANSACTIONS_URL, {params: [maxDate]}, (response) => {
    return receivedNextTransactions(response.data);
  });
};

exports.loadNextShapeShiftTransactions = (maxDate) => {
  return authRequest("GET", NEXT_SHAPESHIFT_TRANSACTIONS_URL, {params: [maxDate]}, (response) => {
    return receivedNextShapeShiftTransactions(response.data);
  });
};

exports.requestUsers = (item) => {
  return authRequest("GET", SEARCH_USERS_URL, {params: item}, (response) => {
    return receivedUsers(response.data);
  });
};

exports.requestAllWallets = () => {
  return authRequest("GET", WALLETS_URL, {}, (response) => {
    return receivedWallets(response.data);
  });
};

exports.unauthUser = () => {
  return function(dispatch) {
    starter.startSingleApplication();
    dispatch(clearAlerts());
    dispatch(logout());
  };
};

const logout = () => {
  return {
    type: 'UNAUTH_USER'
  };
};

const authUser = (screenName, wallets, cashRegister) => {
  return {
    type: 'AUTH_USER',
    screenName,
    wallets,
    cashRegister
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

const receivedTransaction = (data) => {
  return  {
    type: 'RECEIVED_TRANSACTION',
    data
  };
};

exports.clearTransaction = () => {
  return {
    type: 'CLEAR_TRANSACTION',
  };
};

// After we have received transactions from the backend, we can move along with this data
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

const receivedNextShapeShiftTransactions = (data) => {
  return {
    type: 'RECEIVED_NEXT_SHAPESHIFT_TRANSACTIONS',
    data
  };
};

exports.refreshShouldLoadMoreValues = {
    type: 'REFRESH_LOAD_MORE'
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

const updatePasswordAttempts = (data) => {
  return {
    type: 'UPDATE_PASSWORD_ATTEMPTS',
    data
  };
};
