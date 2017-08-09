import axios from 'axios';
import * as Keychain from 'react-native-keychain';

import { SIGNIN_URL, SIGNUP_URL, TRANSACTIONS_URL } from '../api';
import { addAlert } from './alertsActions';

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

exports.signupUser = (email, password) => {
  return function(dispatch) {
    return axios.post(SIGNUP_URL, {email, password}).then((response) => {
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

exports.requestTransactions = (user) => {
  return function(dispatch) {
    return axios.get(TRANSACTIONS_URL, {user}).then((response) => {
      console.log('++++++++++++++++++++++++++');
      console.log(user);
      console.log(response);
      console.log('++++++++++++++++++++++++++');
      dispatch(receivedTransactions(response.data));
    }).catch((error) => {
      dispatch(addAlert("no transaction history"));
    });
  };
};

authUser = (user_id) => {
  return {
    type: 'AUTH_USER',
    user_id
  };
};

let receivedTransactions = (data) => {
  return {
    type: 'RECEIVED_TRANSACTIONS',
    data
  };
};

exports.unauthUser = {
  type: 'UNAUTH_USER'
};
