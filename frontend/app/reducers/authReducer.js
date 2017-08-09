import { merge } from 'lodash';

var defaultState = {
  user_id: undefined,
  transactions: [],
  balance: 0
};

module.exports = (state=defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case 'AUTH_USER':
      return merge({}, {user_id: action.user_id});
    case 'UNAUTH_USER':
      return merge({}, {user_id: undefined});
    case 'RECEIVED_TRANSACTIONS':
      console.log('+++++++++++++++++++++++++++++++++');
      console.log(action);
      console.log('+++++++++++++++++++++++++++++++++');
      return merge({}, state, {transactions: action.data.transactions, balance: action.data.balance});
    default:
      return state;
  }
};
