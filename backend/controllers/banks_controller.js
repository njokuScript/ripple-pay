// const bank = require('../models/vault');
const User = require('../models/user');
const CashRegister = require('../models/populateBank');
const async = require('async');
const {addresses} = require('./addresses');

//I am going to need {params: {user}} to be passed from the authactions.
//FUNCTION: this will find the most empty cash register and will make a base32 destTag to assign to the user.

//This function will get the most empty cash register and let the user fill this cash register.
exports.generateRegisterAndDesTag = function(req, res, next){
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let x = req.query;
  let userId = x[Object.keys(x)[0]]
  //remember the value is going to be a string
  User.findOne({ _id: userId }, function (err, existingUser) {
    if (err) { return next(err);}
    server.connect().then(() => {
      let minBal = undefined;
      let minAddr;
      let newBal;
      let recurse = function(n = 0){
        if ( n === 5 )
        {
          console.log(minAddr);
          let dest = parseInt(Math.floor(Math.random()*4294967294));
          let changedUser = {
            cashRegister: minAddr,
            destinationTag: dest
          };
          User.update({_id: existingUser._id}, changedUser, function (err) {
            if (err) { return next(err); }
            res.json({
              cashRegister: minAddr,
              destinationTag: dest
            });
            return;
          });
          return;
        }
        console.log(addresses[n].address);
        server.api.getBalances(addresses[n].address).then((info) => {
          if(minBal === undefined || parseInt(info[0].value) < minBal ){
            minBal = parseInt(info[0].value);
            minAddr = addresses[n].address;
          }
          recurse(n + 1);
        })
      }
      recurse().then(()=> {});
    })
  })
}

//The users balance changes AND the cash register's balance changes so we can know how much we have in each register for testing.
exports.getTransactions = function (req, res, next) {
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let x = req.query;
  let userId = x[Object.keys(x)[0]]
  // You need to specifically have _id NOT id - dumb
  // console.log(Rippled);
  User.findOne({ _id: userId }, function (err, existingUser) {
    if (err) { return next(err); }
    if (existingUser.cashRegister) {
      server.connect().then(() => {
        let newbalance;
        server.api.getBalances(existingUser.cashRegister).then((info)=> {
          newbalance = info[0].value;
          let cashreg = {
            balance: newbalance
          }
          console.log(cashreg)
          CashRegister.findOneAndUpdate({ address: existingUser.cashRegister }, cashreg, {upsert: false}, function(err){
            if ( err )
            {
              return next(err);
            }
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
                      changedUser.balance += parseFloat(balanceChange);
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
          })
        })
      });
    }
  });
};
