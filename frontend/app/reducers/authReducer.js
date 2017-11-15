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
  shapeshiftTransactions: [],
  users: [],
  balance: 0,
  cashRegister: undefined,
  wallets: [],
  screenName: ''
};

//We have to use Object.assign for a shallow merging and merge for a deep merging which would also merge the inner arrays of the object.
module.exports = (state=defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case 'AUTH_USER':
      return merge({}, state, {user_id: action.user_id, screenName: action.screenName});
      //Make the user_id undefined after logout.
    case 'UNAUTH_USER':
      return Object.assign({}, state,
        {user_id: undefined,
          transactions: [],
          users: [],
          balance: 0,
          cashRegister: undefined,
          wallets: [],
          screenName: '',
          shapeshiftTransactions: []
        });
    case 'RECEIVED_TRANSACTIONS':
      return Object.assign({}, state, {transactions: action.data.transactions, balance: action.data.balance});
    case 'RECEIVED_BALANCE':
      return Object.assign({}, state, {balance: action.data.balance})
    case 'RECEIVED_USERS':
      return Object.assign({}, state, {users: action.users.data.search});
    case 'RECEIVED_WALLETS':
      return Object.assign({}, state, {wallets: action.data.wallets});
    case 'DEL_WALLET':
      let x = state.wallets.slice(0);
      x.shift();
      return Object.assign({}, state, {wallets: x});
    case 'DEL_REGISTER':
      return Object.assign({}, state, {cashRegister: undefined});
    case 'RECEIVED_DESTAG':
      let walls = state.wallets.slice(0);
      walls.push(action.data.destinationTag);
      return Object.assign({}, state, {wallets: walls});
    case 'RECEIVED_ADDRESS':
      return Object.assign({}, state, {cashRegister: action.data.cashRegister});
    case 'RECEIVED_OLD_ADDRESS':
      return Object.assign({}, state, { cashRegister: action.data.cashRegister });
    case 'RECEIVED_SHAPESHIFTS':
      return Object.assign({}, state, { shapeshiftTransactions: action.data.shapeshiftTransactions.reverse()})
    default:
      return state;
  }
};
