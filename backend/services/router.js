// We can use our URL's to the backend and then make promises that will start controller actions.
// Go to authenticationController next.

const passport = require('passport');

const AuthenticationController = require('../controllers/authentication_controller');
const BankController = require('../controllers/banks_controller');
const WalletController = require('../controllers/wallets_controller');
const ShapeshiftController = require('../controllers/shapeshift_controller');
// the following will take passport and will make some requirements on it
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
router.route('/banksend')
  .post(requireAuth, BankController.inBankSend);
router.route('/send')
  .post(requireAuth, BankController.sendMoney);
router.get('/search', AuthenticationController.search);
router.get('/transactions', BankController.getTransactions);

router.route('/delwallet')
  .post([requireAuth, WalletController.deleteWallet]);
router.route('/delRegister')
  .post(requireAuth, WalletController.removeCashRegister);
router.route('/dest')
  .post(requireAuth, WalletController.receiveOnlyDesTag);
router.get('/addrs', WalletController.generateRegister);
router.get('/wallets', WalletController.receiveAllWallets);
router.get('/old', WalletController.findOldAddress);

router.route('/makeshift')
  .post(requireAuth, ShapeshiftController.createShapeshiftTransaction);
router.get('/getshifts', ShapeshiftController.getShapeshiftTransactions);
router.get('/getShapeId', ShapeshiftController.getShapeshiftTransactionId);

// xxx Routes
// -----------------------------------------------------------------------------
// router.route('/protected')
//   .get(requireAuth, protected);

// Ripple API

module.exports = router;
