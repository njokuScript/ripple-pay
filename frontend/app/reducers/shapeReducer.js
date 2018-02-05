import { merge } from 'lodash';

var defaultState = {
  coins: undefined,
  rates: {},
  market: {},
  sendamount: {}
};

//We have to use Object.assign for a shallow merging and merge for a deep merging which would also merge the inner arrays of the object.
module.exports = (state=defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case 'RECEIVED_COINS':
      return merge({}, state, {coins: action.data});
      //Make the user_id undefined after logout.
    case 'RECEIVED_RATE':
      return merge({}, state, {rates: {[action.coin]: action.data.rate}});
    case 'MARKET_INFO':
      return merge({}, state, {market: action.data});
    case 'RECEIVED_SEND_AMOUNT':
      return Object.assign({}, state, { sendamount: action.data.success ? action.data.success : action.data });
    case 'RECEIVED_SHAPESHIFT':
      return Object.assign({}, state, {sendamount: action.data});
    case 'CLEARANCE':
      return Object.assign({}, state, {sendamount: {}});
    default:
      return state;
  }
};
