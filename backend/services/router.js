// We can use our URL's to the backend and then make promises that will start controller actions.
// Go to authenticationController next.

const passport = require('passport');

const AuthenticationController = require('../controllers/authentication_controller');
const BankController = require('../controllers/banks_controller');
const WalletController = require('../controllers/wallets_controller');
const ShapeshiftController = require('../controllers/shapeshift_controller');
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
router.get('/search', AuthenticationController.search);
router.post('/banksend', BankController.inBankSend);
router.post('/send', BankController.sendMoney);
router.get('/transactions', BankController.getTransactions);

router.get('/addrs', WalletController.generateRegister);
router.get('/wallets', WalletController.receiveAllWallets);
router.post('/dest', WalletController.receiveOnlyDesTag);
router.post('/delwallet', WalletController.deleteWallet);
router.get('/old', WalletController.findOldAddress);

router.post('/makeshift', ShapeshiftController.createShapeshiftTransaction);
router.get('/getshifts', ShapeshiftController.getShapeshiftTransactions);

// xxx Routes
// -----------------------------------------------------------------------------
// router.route('/protected')
//   .get(requireAuth, protected);

// Ripple API

module.exports = router;
