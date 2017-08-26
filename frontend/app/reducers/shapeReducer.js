import { merge } from 'lodash';

//This is our default state of the user.
//Because of this, our User will have a default of all of this.
//Once they are signed in, they will have a user_id and the other stuff will stay the same.
//When they have navigated to the Home page rather than the login Page, Then we go through
//Component did mount in the home component, in which we render default values first, and then AFTER home component is mounted
//we will make a thunk action creator called 'requestTransactions(user_id)'. This will go to the backend and get the transactions AND balance
//and then this will force a re-rendering of the home page with those database values. Look at the authactions for followup documentation

var defaultState = {
  coins: undefined,
  rates: {},
  market: {}
};

//We have to use Object.assign for a shallow merging and merge for a deep merging which would also merge the inner arrays of the object.
module.exports = (state=defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case 'RECEIVED_COINS':
      return merge({}, state, {coins: action.data});
      //Make the user_id undefined after logout.
    case 'RECEIVED_RATE':
      return merge({}, state, {rates: {[action.coin]: action.data.rate}})
    case 'MARKET_INFO':
      return merge({}, state, {market: action.data})
    default:
      return state;
  }
};
