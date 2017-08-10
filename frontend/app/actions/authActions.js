//We made our user actions and auth actions all the same, remember this.

import axios from 'axios';
import * as Keychain from 'react-native-keychain';

import { SIGNIN_URL, SIGNUP_URL, TRANSACTIONS_URL } from '../api';
import { addAlert } from './alertsActions';

//The following auth stuff will ensure that the slice of state of the store for the user will have his user id and not undefined.
//Look at authreducer for defaultstate of user.


exports.loginUser = (email, password) => {
  return function(dispatch) {
    return axios.post(SIGNIN_URL, {email, password}).then((response) => {
      var {user_id, token} = response.data;
      Keychain.setGenericPassword(user_id, token)
        .then(function() {
          dispatch(authUser(user_id));
        }).catch((error) => {
          dispatch(addAlert("Could not log in."));
        });
    }).catch((error) => {
      dispatch(addAlert("Could not log in."));
    });
  };
};

exports.signupUser = (email, password, screenName) => {
  console.log(screenName);
  return function(dispatch) {
    return axios.post(SIGNUP_URL, {email, password, screenName}).then((response) => {
      var {user_id, token} = response.data;
      Keychain.setGenericPassword(user_id, token)
        .then(function() {
          dispatch(authUser(user_id));
        }).catch((error) => {
          dispatch(addAlert("Could not log in."));
        });
    }).catch((error) => {
      dispatch(addAlert("Could not sign up."));
    });
  };
};

//You can debug this using the debugger you showed me in the browser.
//It is just object deconstruction and can be written another way, but
//user is {user: {user_id: whatever} }
exports.requestTransactions = (user) => {
  return function(dispatch) {

    //user following is {user_id: whatever} since it is deconstructed
    //followup in the gettransactions method in the authenticationController since we go to the backend through the TRANS_URL through
    //index.js and router.js and THEN we finally get to our backend.
    console.log(user);
    return axios.get(TRANSACTIONS_URL, {user}).then((response) => {
      dispatch(receivedTransactions(response.data));
    }).catch((error) => {

    });
  };
};

// Lets change these from 'AUTH_USER' to just AUTH_USER later like we're used to so we get better errors.
authUser = (user_id) => {
  return {
    type: 'AUTH_USER',
    user_id
  };
};


//After we have received transactions from the backend, we can move along with this data
let receivedTransactions = (data) => {
  return {
    type: 'RECEIVED_TRANSACTIONS',
    data
  };
};

exports.unauthUser = {
  type: 'UNAUTH_USER'
};
