import { merge } from 'lodash';

var defaultState = {
    coins: undefined,
    rates: {},
    minimumSend: 0,
    changellyTxn: {}
};

module.exports = (state = defaultState, action) => {
    Object.freeze(state);
    switch (action.type) {
        case 'RECEIVED_COINS':
            return merge({}, state, { coins: action.data.coins });
        case 'RECEIVED_RATE':
            return merge({}, state, { rates: { [action.coin]: action.data.rate } });
        case 'RECEIVED_MIN_AMOUNT':
            return merge({}, state, { minimumSend: action.data.minAmount });
        case 'CREATED_CHANGELLY_TRANSACTION':
            return Object.assign({}, state, { changellyTxn: action.data });
        case 'CHANGELLY_CLEARANCE':
            return Object.assign({}, state, { changellyTxn: {} });
        default:
            return state;
    }
};