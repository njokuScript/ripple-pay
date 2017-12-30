import { merge } from 'lodash';

var defaultState = {
    toAddress: null,
    toDesTag: null,
    fee: null,
    amount: null
};

//We have to use Object.assign for a shallow merging and merge for a deep merging which would also merge the inner arrays of the object.
module.exports = (state = defaultState, action) => {
    Object.freeze(state);
    switch (action.type) {
        case 'RECEIVED_TRANSACTION':
            return Object.assign({}, state, action.data);
        case 'CLEAR_TRANSACTION':
            return Object.assign({}, state, { toAddress: null, toDesTag: null, fee: null, amount: null })
        default:
            return state;
    }
};