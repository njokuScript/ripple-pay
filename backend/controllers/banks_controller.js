// const bank = require('../models/vault');
const User = require('../models/user');
// const CashRegister = require('../models/cashRegister');
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
            balance: existingUser.balance,
            transactions: existingUser.transactions,
            lastTransactionId: null
          };


          const manipulateTransactions = function(currTxn, setLastTransBool, stopIterBool) {
            // let currTxn = txnInfo[i];
            // get other party address
            // let counterParty;
            // get last transaction id
            if (currTxn.specification.destination.tag === existingUser.destinationTag) {
              if ( setLastTransBool )
              {
                changedUser.lastTransactionId = currTxn.id;
                setLastTransBool = false;
              }
              if (currTxn.id === existingUser.lastTransactionId) {
                stopIterBool = true;
              }
              if (stopIterBool === false) {
                let counterParty;
                Object.keys(currTxn.outcome.balanceChanges).forEach((addr) => {
                  if (userAddress !== addr) {
                    counterParty = addr;
                    console.log(counterParty);
                    return;
                  }
                });
                let balanceChange = currTxn.outcome.balanceChanges[userAddress][0].value;
                changedUser.balance += parseInt(balanceChange);
                let newTxn = {
                  date: currTxn.outcome.timestamp,
                  amount: balanceChange,
                  txnId: currTxn.id,
                  otherParty: counterParty
                };
                changedUser.transactions.unshift(newTxn);
              }
            }
            return [setLastTransBool, stopIterBool];
          };
          // map over transactions asynchronously
          async.mapSeries(txnInfo, function (currTxn, cb) {
            cb(null, currTxn);
          }, function(error, resp) {
            //for loops don't work asynchronously
            let setLastTransBool = true;
            let stopIterBool = false;
            // get all transactions that relate to specific destination tag
              resp.forEach(function(txn) {
                [setLastTransBool, stopIterBool] = manipulateTransactions(txn, setLastTransBool, stopIterBool);
                console.log([setLastTransBool, stopIterBool]);
              });
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
