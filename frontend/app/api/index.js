//This is the frontend communication with backend where we go so that we can route to specific URL's that we can go to the controller with.
//The next file to look at is router.js

var API_URL = 'http://localhost:3000/v1';
// var API_URL = 'https://fathomless-reef-57802.herokuapp.com/v1';
exports.ADDRDEST_URL = `${API_URL}/addrs`;
exports.SIGNIN_URL = `${API_URL}/signin`;
exports.SIGNUP_URL = `${API_URL}/signup`;
exports.TRANSACTIONS_URL = `${API_URL}/transactions`;
exports.SEARCH_USERS_URL = `${API_URL}/search`;
