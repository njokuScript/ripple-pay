import UserActions from './userActions';
import AlertsActions from './alertsActions';
import CoinCapActions from './coincapActions';
import ShapeActions from './shapeActions';
import TransactionActions from './transactionActions';
import WalletActions from './walletActions';

// USER ACTIONS
exports.loginUser = UserActions.loginUser;
exports.signupUser = UserActions.signupUser;
exports.comparePassword = UserActions.comparePassword;
exports.requestUsers = UserActions.requestUsers;
exports.unauthUser = UserActions.unauthUser;

// SHAPESHIFT ACTIONS
exports.requestAllCoins = ShapeActions.requestAllCoins;
exports.requestRate = ShapeActions.requestRate;
exports.requestMarketInfo = ShapeActions.requestMarketInfo;
exports.sendAmount = ShapeActions.sendAmount;
exports.shapeshift = ShapeActions.shapeshift;
exports.makeShapeShiftTransaction = ShapeActions.makeShapeshiftTransaction;
exports.requestShifts = ShapeActions.requestShifts;
exports.getShapeshiftTransactionStatus = ShapeActions.getShapeshiftTransactionStatus;
exports.getTimeRemaining = ShapeActions.getTimeRemaining;
exports.getShapeshiftTransactionId = ShapeActions.getShapeshiftTransactionId;

// TRANSACTION ACTIONS
exports.signAndSend = TransactionActions.signAndSend;
exports.preparePayment = TransactionActions.preparePayment;
exports.sendInBank = TransactionActions.sendInBank;
exports.requestTransactions = TransactionActions.requestTransactions;
exports.loadNextTransactions = TransactionActions.loadNextTransactions;
exports.loadNextShapeShiftTransactions = TransactionActions.loadNextShapeShiftTransactions;
exports.clearTransaction = TransactionActions.clearTransaction;
exports.refreshShouldLoadMoreValues = TransactionActions.refreshShouldLoadMoreValues;

// WALLET ACTIONS
exports.delWallet = WalletActions.delWallet;
exports.removeCashRegister = WalletActions.removeCashRegister;
exports.requestOnlyDesTag = WalletActions.requestOnlyDesTag;
exports.requestAddress = WalletActions.requestAddress;
exports.requestOldAddress = WalletActions.requestOldAddress;
exports.requestAllWallets = WalletActions.requestAllWallets;

// COINCAP ACTIONS
exports.getXRPtoUSD = CoinCapActions.getXRPtoUSD;

// ALERTS ACTIONS
exports.addAlert = AlertsActions.addAlert;
exports.removeAlert = AlertsActions.removeAlert;
exports.clearAlerts = AlertsActions.clearAlerts;

