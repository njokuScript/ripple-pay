exports.addAlert = (text) => {
  return {
    type: 'ADD_ALERT',
    text
  };
};

exports.removeAlert = (id) => {
  return {
    type: 'REMOVE_ALERT',
    id
  };
};

exports.clearAlerts = (id) => {
  return {
    type: 'CLEAR_ALERTS'
  };
};
