import { merge } from 'lodash';

var defaultState = {
    orderedCoins: [],
    totalCoinsObj: {},
    minimumSend: {},
    changellyTxn: {},
    rate: {}
};

module.exports = (state = defaultState, action) => {
    Object.freeze(state);
    switch (action.type) {
        case 'RECEIVED_COINS':
            const { changellyCoinSet } = action;
            return Object.assign({}, state, { orderedCoins: Object.keys(changellyCoinSet), totalCoinsObj: action.changellyCoinSet });
        case 'RECEIVED_MIN_AMOUNT':
            return Object.assign({}, state, { minimumSend: action.data.minAmount });
        case 'CREATED_CHANGELLY_TRANSACTION':
            return Object.assign({}, state, { changellyTxn: action.data });
        case 'CHANGELLY_CLEARANCE':
            return Object.assign({}, state, { changellyTxn: {} });
        case 'SET_COIN_DATA':
            let updatedState = Object.assign({}, state, { orderedCoins: action.orderedCoins });
            return merge({}, updatedState, { totalCoinsObj: action.totalCoinsObj });
        case 'RECEIVED_CHANGELLY_RATE':
            return Object.assign({}, state, { rate: { amount: action.rate, coin: action.coin } });
        case 'RECEIVED_CHANGELLY_MINAMOUNT':
            return Object.assign({}, state, { minimumSend: { minAmount: action.minAmount, coin: action.coin } });
        case 'MERGE_RATES':
            return merge({}, state, { totalCoinsObj: action.ratesObj });
        default:
            return state;
    }
};