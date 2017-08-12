const filterReducer = (state = {}, action) => {
  Object.freeze(state);
  if (action.type === 'CHANGE_FILTER') {
    return Object.assign({}, { item: action.item });
  }
  else {
    return state;
  }
};

export default filterReducer;
