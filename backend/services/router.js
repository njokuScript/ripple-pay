// We can use our URL's to the backend and then make promises that will start controller actions.
// Go to authenticationController next.

const passport = require('passport');

const AuthenticationController = require('../controllers/authentication_controller');
const BankController = require('../controllers/banks_controller');
const passportService = require('./passport');

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});
var router = require('express').Router();


// Auth Routes`
// -----------------------------------------------------------------------------
router.route('/signup')
  .post(AuthenticationController.signup);
router.route('/signin')
  .post([requireLogin, AuthenticationController.signin]);
// router.route('/transactions')
//   .get(AuthenticationController.getTransactions);
router.post('/send', BankController.sendMoney);
router.get('/addrs', BankController.generateRegisterAndDesTag);
router.get('/transactions', BankController.getTransactions);
router.get('/search', AuthenticationController.search);

// xxx Routes
// -----------------------------------------------------------------------------
// router.route('/protected')
//   .get(requireAuth, protected);

// Ripple API

module.exports = router;
