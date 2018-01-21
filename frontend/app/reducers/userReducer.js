import { merge } from 'lodash';

import Config from '../config_enums';

let defaultState = {
  transactions: [],
  personalTransactions: [],
  shapeshiftTransactions: [],
  users: [],
  balance: 0,
  personalBalance: 0,
  cashRegister: undefined,
  personalAddress: undefined,
  wallets: [],
  screenName: '',
  passwordAttempts: {tries: 3, attemptSwitch: true},
  shouldLoadMoreShapeShiftTransactions: true,
  shouldLoadMoreTransactions: true,
  activeWallet: Config.WALLETS.BANK_WALLET
};

//We have to use Object.assign for a shallow merging and merge for a deep merging which would also merge the inner arrays of the object.
module.exports = (state=defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case 'AUTH_USER':
      return merge({}, state, {
        screenName: action.screenName,
        wallets: action.wallets,
        cashRegister: action.cashRegister,
        personalAddress: action.personalAddress
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
          personalTransactions: [],
          users: [],
          balance: 0,
          personalBalance: 0,
          cashRegister: undefined,
          wallets: [],
          screenName: '',
          shapeshiftTransactions: [],
          passwordAttempts: {tries: 3, attemptSwitch: true},
          shouldLoadMoreShapeShiftTransactions: true,
          shouldLoadMoreTransactions: true,
          personalAddress: undefined,
          activeWallet: Config.WALLETS.BANK_WALLET 
        });
    case 'RECEIVED_TRANSACTIONS':
      return Object.assign({}, state, {transactions: action.data.transactions, balance: action.data.balance});
    case 'RECEIVED_NEXT_TRANSACTIONS':
      const currentTransactions = state.transactions.slice(0);
      const totalTransactions = currentTransactions.concat(action.data.nextTransactions);
      return Object.assign({}, state, { transactions: totalTransactions, shouldLoadMoreTransactions: action.data.shouldLoadMoreTransactions });
    case 'RECEIVED_NEXT_SHAPESHIFT_TRANSACTIONS':
      const currentShapeShiftTransactions = state.shapeshiftTransactions.slice(0);
      const totalShapeShiftTransactions = currentShapeShiftTransactions.concat(action.data.nextShapeShiftTransactions);
      return Object.assign({}, state, { shapeshiftTransactions: totalShapeShiftTransactions, shouldLoadMoreShapeShiftTransactions: action.data.shouldLoadMoreShapeShiftTransactions });
    case 'REFRESH_LOAD_MORE':
      return Object.assign({}, state, { shouldLoadMoreShapeShiftTransactions: true, shouldLoadMoreTransactions: true });
    case 'RECEIVED_BALANCE':
      return Object.assign({}, state, {balance: action.data.balance});
    case 'RECEIVED_USERS':
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
    case 'RECEIVED_PERSONAL_ADDRESS':
      return Object.assign({}, state, { personalAddress: action.data.personalAddress });
    case 'REMOVED_PERSONAL_ADDRESS':
      return Object.assign({}, state, { personalAddress: undefined });
    case 'RECEIVED_PERSONAL_TRANSACTIONS':
      return Object.assign({}, state, { personalBalance: action.personalBalance, personalTransactions: action.personalTransactions });
    case 'RECEIVED_SHAPESHIFTS':
      return Object.assign({}, state, { shapeshiftTransactions: action.data.shapeshiftTransactions });
    case 'CHANGE_WALLET':
      return Object.assign({}, state, { activeWallet: state.activeWallet === Config.WALLETS.BANK_WALLET ? Config.WALLETS.PERSONAL_WALLET : Config.WALLETS.BANK_WALLET });
    default:
      return state;
  }
};
