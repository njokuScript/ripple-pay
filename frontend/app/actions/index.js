import UserActions from './userActions';
import AlertsActions from './alertsActions';
import CoinActions from './coinActions';
// import ShapeActions from './shapeActions';
import ChangellyActions from './changellyActions';
import TransactionActions from './transactionActions';
import WalletActions from './walletActions';
import PersonalWalletActions from './personalWalletActions';

// USER ACTIONS
exports.loginUser = UserActions.loginUser;
exports.signupUser = UserActions.signupUser;
exports.comparePassword = UserActions.comparePassword;
exports.changePassword = UserActions.changePassword;
exports.requestUsers = UserActions.requestUsers;
exports.unauthUser = UserActions.unauthUser;

// SHAPESHIFT ACTIONS
// exports.requestAllCoins = ShapeActions.requestAllCoins;
// exports.requestRate = ShapeActions.requestRate;
// exports.requestMarketInfo = ShapeActions.requestMarketInfo;
// exports.sendAmount = ShapeActions.sendAmount;
// exports.shapeshift = ShapeActions.shapeshift;
// exports.makeShapeShiftTransaction = ShapeActions.makeShapeshiftTransaction;
// exports.requestShifts = ShapeActions.requestShifts;
// exports.getShapeshiftTransactionStatus = ShapeActions.getShapeshiftTransactionStatus;
// exports.getTimeRemaining = ShapeActions.getTimeRemaining;
// exports.getShapeshiftTransactionId = ShapeActions.getShapeshiftTransactionId;

// TRANSACTION ACTIONS
exports.signAndSend = TransactionActions.signAndSend;
exports.preparePayment = TransactionActions.preparePayment;
exports.sendInBank = TransactionActions.sendInBank;
exports.requestTransactions = TransactionActions.requestTransactions;
exports.loadNextTransactions = TransactionActions.loadNextTransactions;
// exports.loadNextShapeShiftTransactions = TransactionActions.loadNextShapeShiftTransactions;
exports.clearTransaction = TransactionActions.clearTransaction;
exports.refreshShouldLoadMoreValues = TransactionActions.refreshShouldLoadMoreValues;
exports.receivedTransaction = TransactionActions.receivedTransaction;

// WALLET ACTIONS
exports.delWallet = WalletActions.delWallet;
exports.requestOnlyDesTag = WalletActions.requestOnlyDesTag;
exports.requestAddress = WalletActions.requestAddress;
exports.changeWallet = WalletActions.changeWallet;

// PERSONAL WALLET ACTIONS
exports.genPersonalAddress = PersonalWalletActions.genPersonalAddress;
exports.removePersonalAddress = PersonalWalletActions.removePersonalAddress;
exports.getPersonalAddressTransactions = PersonalWalletActions.getPersonalAddressTransactions;
exports.preparePaymentWithPersonalAddress = PersonalWalletActions.preparePaymentWithPersonalAddress;
exports.sendPaymentWithPersonalAddress = PersonalWalletActions.sendPaymentWithPersonalAddress;
exports.preparePersonalToBank = PersonalWalletActions.preparePersonalToBank;

// COIN ACTIONS
exports.getXRPtoUSD = CoinActions.getXRPtoUSD;
exports.getAllMarketCoins = CoinActions.getAllMarketCoins;
exports.getRates = CoinActions.getRates;
exports.getAllCoinData = CoinActions.getAllCoinData;
// ALERTS ACTIONS
exports.addAlert = AlertsActions.addAlert;
exports.removeAlert = AlertsActions.removeAlert;
exports.clearAlerts = AlertsActions.clearAlerts;

// CHANGELLY ACTIONS
exports.createChangellyTransaction = ChangellyActions.createChangellyTransaction;
exports.clearChangellyTransaction = ChangellyActions.clearChangellyTransaction;
exports.requestChangellyTransactions = ChangellyActions.requestChangellyTransactions;
exports.loadNextChangellyTransactions = ChangellyActions.loadNextChangellyTransactions;
exports.getChangellyTransactionStatus = ChangellyActions.getChangellyTransactionStatus;
exports.getChangellyRippleTransactionId = ChangellyActions.getChangellyRippleTransactionId;
exports.requestRate = ChangellyActions.requestRate;
exports.getMinAmount = ChangellyActions.getMinAmount;
exports.requestAllCoins = ChangellyActions.requestAllCoins;