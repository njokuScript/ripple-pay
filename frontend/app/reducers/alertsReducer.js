import uuid from 'uuid';

let defaultState = [];

module.exports = (state=defaultState, action) => {
  switch(action.type) {
    case 'ADD_ALERT':
      return [
        ...state,
        {
          text: action.text,
          id: uuid.v4()
        }
      ];

    case 'REMOVE_ALERT':
      return state.filter((alert) => {
        if (alert.id === action.id) {
          return false;
        } else {
          return true;
        }
      });

    default:
      return state;
  }
}
