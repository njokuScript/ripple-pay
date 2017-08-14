const bank = require('../models/vault');
const User = require('../models/user');
const CashRegister = require('../models/cashRegister');
const async = require('async');
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

        server.api.getTransactions(existingUser.cashRegister, { excludeFailures: true, types: ["payment"] }).then((txnInfo) => {
          let userAddress = existingUser.cashRegister;
          // console.log(txnInfo);
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
          
          
          const getTransactions = function(currTxn, bool) {
            // let currTxn = txnInfo[i];
            // get other party address
            // let counterParty;
            // Object.keys(currTxn.outcome.balanceChanges).forEach((addr) => {
            //   if (userAddress !== addr) {
            //     counterParty = addr;
            //     return;
            //   }
            // });
            // console.log(currTxn);
            // get last transaction id
            if (currTxn.specification.destination.tag === existingUser.destinationTag) {
              if (currTxn.id === existingUser.lastTransactionId) {
                return;
              }
              else {
                let balanceChange = currTxn.outcome.balanceChanges[userAddress][0].value;
                changedUser.balance += parseInt(balanceChange);
                let newTxn = {
                  date: currTxn.outcome.timestamp,
                  amount: balanceChange,
                  txnId: currTxn.id
                  // otherParty: counterParty
                };
                changedUser.transactions.unshift(newTxn);
              }
            }
          };
          // map over transactions asynchronously
          async.mapSeries(txnInfo, function (currTxn, cb) {
            cb(null, currTxn);
          }, function(error, resp) {
            let findTransactionId = function (trans) {
              if (trans.specification.destination.tag === existingUser.destinationTag) {
                return trans.id;   
              } 
              return null;
            };
            // get last transaction id
            for(let i = 0; i < resp.length; i++) {
              let transId = findTransactionId(resp[i]);
              if (transId) { 
                changedUser.lastTransactionId = transId;
                break;
              }
            }
            // get all transactions that relate to specific destination tag
            resp.forEach(function(txn) {
              getTransactions(txn);
            });
          
            console.log(resp);
            });
            // console.log(changedUser);
            // console.log('++++++++++++++++++++');
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