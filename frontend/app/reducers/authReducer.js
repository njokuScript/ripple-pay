import { merge } from 'lodash';

//This is our default state of the user.
//Because of this, our User will have a default of all of this.
//Once they are signed in, they will have a user_id and the other stuff will stay the same.
//When they have navigated to the Home page rather than the login Page, Then we go through
//Component did mount in the home component, in which we render default values first, and then AFTER home component is mounted
//we will make a thunk action creator called 'requestTransactions(user_id)'. This will go to the backend and get the transactions AND balance
//and then this will force a re-rendering of the home page with those database values. Look at the authactions for followup documentation

var defaultState = {
  user_id: undefined,
  transactions: [],
  users: [],
  balance: 0
};

module.exports = (state=defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case 'AUTH_USER':
      return merge({}, {user_id: action.user_id});
      //Make the user_id undefined after logout.
    case 'UNAUTH_USER':
      return merge({}, {user_id: undefined});
      //We have action.data.stuff here because we have passed in 'data' from the received_transactions normal/non-thunk action of the
      //authActions.
      //action.data.transactions is an array of all the transactions and the other is the balance.
    case 'RECEIVED_TRANSACTIONS':
      return merge({}, state, {transactions: action.data.transactions, balance: action.data.balance});
    case 'RECEIVED_USERS':
      return merge({}, state, {users: action.users});
    default:
      return state;
  }
};
