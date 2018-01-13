//We made our user actions and auth actions all the same, remember this.
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { apiKey } from '../../apiKey';

import {
  SIGNIN_URL,
  SIGNUP_URL,
  SEARCH_USERS_URL,
  AUTH_URL,
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
    const authedAxios = axios.create({
      headers: { apiKey },
    });
    return authedAxios.post(SIGNIN_URL, {email, password})
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
    const authedAxios = axios.create({
      headers: { apiKey },
    });
    return authedAxios.post(SIGNUP_URL, {email, password, screenName})
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

exports.requestUsers = (item) => {
  return authRequest("GET", SEARCH_USERS_URL, {params: item}, (response) => {
    return receivedUsers(response.data);
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
