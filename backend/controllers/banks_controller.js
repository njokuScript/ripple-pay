const bank = require('../models/vault');
const User = require('../models/user');
const CashRegister = require('../models/cashRegister');

exports.getTransactions = function (req, res, next) {
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let userId = JSON.parse(req.query.user).user_id;
  // You need to specifically have _id NOT id - dumb
  // console.log(Rippled);
  User.findOne({ _id: userId }, function (err, existingUser) {
    if (err) { return next(err); }
    if (existingUser.cashRegister) {
      server.connect().then(() => {
        console.log(existingUser);
        console.log('++++++++++++++++++++');
        server.api.getTransactions(existingUser.cashRegister, { excludeFailures: true, types: ["payment"] }).then((txnInfo) => {
          let userAddress = existingUser.cashRegister;
          console.log(userAddress);
          console.log('++++++++++++++++++++');
          let changedUser = {
            _id: existingUser._id,
            // email: existingUser.email,
            // password: existingUser.password,
            // screenName: existingUser.screenName,
            // destinationTag: existingUser.destination,
            // cashRegister: existingUser.cashRegister,
            balance: existingUser.balance,
            transactions: existingUser.transactions,
            lastTransactionId: null
          };
          // interate over transaction on rippled server
          for (let i = 0; i < txnInfo.length; i++) {
            let placeInCashRegister = txnInfo[i];
            // get other party address
            let counterParty;
            Object.keys(placeInCashRegister.outcome.balanceChanges).forEach((addr) => {
              if (userAddress !== addr) {
                counterParty = addr;
                return;
              }
            });
            console.log(changedUser);
            console.log('++++++++++++++++++++');
            // get last transaction id
            if (placeInCashRegister.specification.destination.tag === existingUser.destinationTag) {
              if (placeInCashRegister.id === existingUser.lastTransactionId) {
                break;
              }
              if (!changedUser.lastTransactionId) {
                changedUser.lastTransactionId = placeInCashRegister.id;
              }
              let balanceChange = placeInCashRegister.outcome.balanceChanges[userAddress][0].value;
              changedUser.balance += balanceChange;
              let newTxn = {
                date: placeInCashRegister.outcome.timestamp.format('MMM D, YYYY'),
                amount: balanceChange,
                otherParty: counterParty
              };
              changedUser.transactions.unshift(newTxn);
            }
          }
          console.log(changedUser);
          console.log('++++++++++++++++++++');
          User.update({_id: existingUser._id}, changedUser, function (err) {
            if (err) { return next(err); }
            res.json({ 
              transactions: existingUser.transactions,
              balance: existingUser.balance
            });
          });
        });

      });
    }
  });
}; 