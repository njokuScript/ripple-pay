import { merge } from 'lodash';

var defaultState = {
  transactions: [],
  shapeshiftTransactions: [],
  users: [],
  balance: 0,
  cashRegister: undefined,
  wallets: [],
  screenName: '',
  passwordAttempts: {tries: 3, attemptSwitch: true}
};

//We have to use Object.assign for a shallow merging and merge for a deep merging which would also merge the inner arrays of the object.
module.exports = (state=defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case 'AUTH_USER':
      return merge({}, state, {
        screenName: action.screenName,
        wallets: action.wallets,
        cashRegister: action.cashRegister
      });
      //Make the user_id undefined after logout.
    case 'UPDATE_PASSWORD_ATTEMPTS':
      const {passwordAttempts: {tries, attemptSwitch}} = state;
      let passwordAttempts = null;
      if (action.data.success) {
        passwordAttempts = {tries: tries, attemptSwitch: !attemptSwitch};
      } 
      else {
        passwordAttempts = {tries: tries - 1, attemptSwitch: !attemptSwitch};
      }
      return Object.assign({}, state, { passwordAttempts });
    case 'UNAUTH_USER':
      return Object.assign({}, state,
        {
          transactions: [],
          users: [],
          balance: 0,
          cashRegister: undefined,
          wallets: [],
          screenName: '',
          shapeshiftTransactions: [],
          passwordAttempts: {tries: 3, attemptSwitch: true}
        });
    case 'RECEIVED_TRANSACTIONS':
      return Object.assign({}, state, {transactions: action.data.transactions, balance: action.data.balance});
    case 'RECEIVED_NEXT_TRANSACTIONS':
      const currentTransactions = state.transactions.slice(0);
      const totalTransactions = currentTransactions.concat(action.data.nextTransactions);
      return Object.assign({}, state, { transactions: totalTransactions });
    case 'RECEIVED_NEXT_SHAPESHIFT_TRANSACTIONS':
      const currentShapeShiftTransactions = state.shapeShiftTransactions.slice(0);
      const totalShapeShiftTransactions = currentShapeShiftTransactions.concat(action.data.nextShapeShiftTransactions);
      return Object.assign({}, state, { shapeShiftTransactions: totalShapeShiftTransactions });
    case 'RECEIVED_BALANCE':
      return Object.assign({}, state, {balance: action.data.balance});
    case 'RECEIVED_USERS':
    console.log(action);
      return Object.assign({}, state, {users: action.users.search});
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
