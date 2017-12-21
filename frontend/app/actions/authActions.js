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
  AUTH_URL,
  reduxAuthRequest
} from '../api';

import { addAlert } from './alertsActions';

exports.loginUser = (email, password) => {
  return function(dispatch) {
    return axios.post(SIGNIN_URL, {email, password}).then((response) => {
      let { user_id, token, screenName, wallets, cashRegister } = response.data;
      console.log(token);
      Keychain.setGenericPassword(user_id, token)
        .then(function() {
          dispatch(authUser(screenName, wallets, cashRegister));
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
        dispatch(authUser(screenName));
      })
      .catch((error) => {
        dispatch(addAlert("Could not log in."));
      });
    }).catch((error) => {
      dispatch(addAlert("Could not sign up."));
    });
  };
};

exports.comparePassword = function(password) {
  return reduxAuthRequest(
    "POST",
    AUTH_URL,
    { password },
    (response) => {
      return updatePasswordAttempts(response.data);
    }
  )
}

exports.signAndSend = (amount, fromAddress, toAddress, sourceTag, toDesTag) => {
  return reduxAuthRequest(
    "POST",
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
  return reduxAuthRequest(
    "POST",
    BANK_SEND_URL,
    {receiverScreenName, amount},
    (response) => addAlert(response.data.message),
    (response) => receivedBalance(response.data)
  );
};

exports.delWallet = (desTag, cashRegister) => {
  return reduxAuthRequest("POST", DEL_WALLET_URL, {desTag, cashRegister}, (response) => {
    return deltheWallet(response.data);
  });
};

exports.removeCashRegister = () => {
  return reduxAuthRequest("POST", DEL_REGISTER_URL, {}, (response) => {
    return deltheRegister();
  });
};
exports.requestOnlyDesTag = (cashRegister) => {
  return reduxAuthRequest("POST", DEST_URL, {cashRegister}, (response) => {
    return receivedDesTag(response.data);
  });
};

exports.requestAddress = () => {
  return reduxAuthRequest("POST", ADDR_URL, {}, (response) => {
    return receivedAddress(response.data);
  });
};

exports.requestOldAddress = () => {
  return reduxAuthRequest("GET", OLDADDR_URL, {}, (response) => {
    return receivedOldAddress(response.data);
  });
};

exports.requestTransactions = () => {
  return reduxAuthRequest("GET", TRANSACTIONS_URL, {}, (response) => {
    return receivedTransactions(response.data);
  });
};

exports.requestUsers = (item) => {
  return reduxAuthRequest("GET", SEARCH_USERS_URL, {params: item}, (response) => {
    return receivedUsers(response.data);
  });
};

exports.requestAllWallets = () => {
  return reduxAuthRequest("GET", WALLETS_URL, {}, (response) => {
    return receivedWallets(response.data);
  });
};

exports.unauthUser = () => {
  return function(dispatch) {
    dispatch(logout());
  }
}

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

const updatePasswordAttempts = (data) => {
  return {
    type: 'UPDATE_PASSWORD_ATTEMPTS',
    data
  };
};

const logout = () => {
  return {
    type: 'UNAUTH_USER'
  }
};
