//We made our user actions and auth actions all the same, remember this.
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
// import {configureStore} from '../store';
//KINDA HCKY BUT I'M IMPORTING THE ENTIRE STORE.
import { SIGNIN_URL, SIGNUP_URL, BANK_SEND_URL, TRANSACTIONS_URL, OLDADDR_URL, SEARCH_USERS_URL, ADDR_URL, SEND_URL, WALLETS_URL, DEST_URL, DEL_WALLET_URL } from '../api';
import { addAlert } from './alertsActions';

//The following auth stuff will ensure that the slice of state of the store for the user will have his user id and not undefined.
//Look at authreducer for defaultstate of user.
//Log the user out after 7 minutes of inactivity.
let timer;
finishAndBeginTimer = ()=> {
  // window.clearTimeout(timer);
  // timer = window.setTimeout(function(){
  //   theStore.dispatch(thisunauthUser);
  //   theStore.dispatch(addAlert("Session Timed Out Due to Inactivity"));
  // },9999);
}

exports.loginUser = (email, password) => {
  return function(dispatch) {
    return axios.post(SIGNIN_URL, {email, password}).then((response) => {
      console.log('hliadlfkjs');
      let {user_id, token} = response.data;
      // Keychain.setGenericPassword(user_id, token)
      //   .then(function() {
          dispatch(authUser(user_id))
          finishAndBeginTimer();
        // })
      // .catch((error) => {
      //     dispatch(addAlert("Could not log in. keychain"));
      //   });
    }).catch((error) => {
      dispatch(addAlert("Could not log in. axios"));
    });
  };
};

exports.requestOldAddress = (user_id) => {
  return function (dispatch) {
    return axios.get(OLDADDR_URL, { params: user_id }).then((response) => {
      dispatch(receivedOldAddress(response.data));
    }).catch((error) => {
    });
  };
}


exports.signupUser = (email, password, screenName) => {
  return function(dispatch) {
    return axios.post(SIGNUP_URL, {email, password, screenName}).then((response) => {
      console.log('hliadlfkjs');
      let {user_id, token} = response.data;
      // Keychain.setGenericPassword(user_id, token)
      //   .then(function() {
          dispatch(authUser(user_id));
          finishAndBeginTimer();
        // })
        // .catch((error) => {
        //   dispatch(addAlert("Could not log in."));
        // });
    }).catch((error) => {
      dispatch(addAlert("Could not sign up."));
    });
  };
};

exports.signAndSend = (amount, fromAddress, toAddress, sourceTag, toDesTag, userId) => {
  finishAndBeginTimer();
  return function(dispatch) {
    return axios.post(SEND_URL, {amount, fromAddress, toAddress, sourceTag, toDesTag, userId}).then((response) => {
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
      dispatch(addAlert(respMessage));
    }).catch((error) => {
      dispatch(addAlert("Could Not Send."));
    });
  };
};

exports.sendInBank = (sender_id, receiver_id, amount) => {
  finishAndBeginTimer();
  return function(dispatch){
    return axios.post(BANK_SEND_URL, {sender_id, receiver_id, amount}).then((response)=>{
      let {message} = response.data;
      dispatch(addAlert(message));
    })
  }
}

//You can debug this using the debugger you showed me in the browser.
//It is just object deconstruction and can be written another way, but
//user is {user: {user_id: whatever} }
//I'M PASSING THE ENTIRE USER IN HERE EVEN THOUGH IT MAY SEEM COUNTERINTUITIVE BECAUSE I'LL HAVE TO COMBINE
//THEM LATER WITH THE IN-BANK TRANSACTIONS.
exports.requestTransactions = (user) => {
  finishAndBeginTimer();
  return function(dispatch) {
    // user following is {user_id: whatever} since it is deconstructed
    // followup in the gettransactions method in the authenticationController since we go to the backend through the TRANS_URL through
    // index.js and router.js and THEN we finally get to our backend.
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
      // might be users.data
    }).catch((error) => {

    });
  };
};

exports.requestAddress = (user_id) => {
  finishAndBeginTimer();
  return function(dispatch) {
    // user following is {user_id: whatever} since it is deconstructed
    // followup in the gettransactions method in the authenticationController since we go to the backend through the TRANS_URL through
    // index.js and router.js and THEN we finally get to our backend.
    return axios.get(ADDR_URL, { params: user_id } ).then((response) => {
      dispatch(receivedAddress(response.data));
    }).catch((error) => {
    });
  };
}
exports.requestAllWallets = (user_id) => {
  finishAndBeginTimer();
  return function(dispatch) {
    // user following is {user_id: whatever} since it is deconstructed
    // followup in the gettransactions method in the authenticationController since we go to the backend through the TRANS_URL through
    // index.js and router.js and THEN we finally get to our backend.
    return axios.get(WALLETS_URL, { params: user_id } ).then((response) => {
      dispatch(receivedWallets(response.data));
    }).catch((error) => {
    });
  };
}
exports.requestOnlyDesTag = (user_id, cashRegister) => {
  finishAndBeginTimer();
  return function(dispatch) {
    // user following is {user_id: whatever} since it is deconstructed
    // followup in the gettransactions method in the authenticationController since we go to the backend through the TRANS_URL through
    // index.js and router.js and THEN we finally get to our backend.
    return axios.post(DEST_URL, { user_id, cashRegister } ).then((response) => {
      dispatch(receivedDesTag(response.data));
    }).catch((error) => {
    });
  };
}
exports.delWallet = (user_id, desTag, cashRegister) => {
  finishAndBeginTimer();
  return function(dispatch) {
    // user following is {user_id: whatever} since it is deconstructed
    // followup in the gettransactions method in the authenticationController since we go to the backend through the TRANS_URL through
    // index.js and router.js and THEN we finally get to our backend.
    return axios.post(DEL_WALLET_URL, { user_id, desTag, cashRegister } ).then((response) => {
      dispatch(deltheWallet(response.data));
    }).catch((error) => {
    });
  };
}

//Set timedlogout of the sessin to 5 minutes.

// Lets change these from 'AUTH_USER' to just AUTH_USER later like we're used to so we get better errors.

authUser = (user_id) => {
  return {
    type: 'AUTH_USER',
    user_id
  };
};

deltheWallet = (data) => {
  return {
    type: 'DEL_WALLET',
    data
  }
}

let receivedWallets = (data) => {
  return {
    type: 'RECEIVED_WALLETS',
    data
  };
};
let receivedDesTag = (data) => {
  return {
    type: 'RECEIVED_DESTAG',
    data
  };
};

let receivedAddress = (data) => {
  return {
    type: 'RECEIVED_ADDRESS',
    data
  };
};
let receivedOldAddress = (data) => {
  return {
    type: 'RECEIVED_OLD_ADDRESS',
    data
  };
};


// After we have received transactions from the backend, we can move along with this data
let receivedTransactions = (data) => {
  return {
    type: 'RECEIVED_TRANSACTIONS',
    data
  };
};

let receivedUsers = (users) => {
  return {
    type: 'RECEIVED_USERS',
    users
  };
};

exports.unauthUser = {
  type: 'UNAUTH_USER'
};

let thisunauthUser = {
  type: 'UNAUTH_USER'
};
