import { requestUsers } from './authActions';

exports.updateFilter = (item) => (dispatch, getState) => {
  dispatch(changeFilter(item));
  return requestUsers(getState().filters)(dispatch);
};

let changeFilter = (item) => {
  return {
    type: 'CHANGE_FILTER',
    item
  };
};