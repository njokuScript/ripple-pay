// const bank = require('../models/vault');
const User = require('../models/user');
const {CashRegister} = require('../models/populateBank');
const {Bank} = require('../models/populateBank');
const {UsedWallet} = require('../models/populateBank');
const {Money} = require('../models/populateBank');
const async = require('async');
const {addresses, bank} = require('./addresses');
const bcrypt = require('bcrypt-nodejs');

//Since there is a very low chance of a coincide, this shouldn't have to recurse at all
//or more than once ever.
// DesTags are in 32 bits
exports.receiveOnlyDesTag = function(req, res, next){
  let {user_id, cashRegister} = req.body;
  let newTag;
  let findthis;
  let recurse = function(){
    newTag = parseInt(Math.floor(Math.random()*4294967294));
    findthis = `${cashRegister}${newTag}`;
    UsedWallet.findOne({wallet: findthis}, function(err, existingWallet){
      if (err){return next(err);}
      if ( existingWallet )
      {
        // console.log("same address and dest tag not allowed");
        recurse();
      }
      else
      {
        let theNewWallet = new UsedWallet({wallet: findthis});
        theNewWallet.save(function(err){
          if ( err )
          {
            return next(err);
          }
          User.update({_id: user_id}, {$push: {wallets: newTag}}, function(err){
            if (err){return next(err);}
            res.json({
              destinationTag: newTag
            });
          })
        })
      }
    })
  }
  recurse();
}

exports.inBankSend = function(req, res, next){
  let {sender_id, receiver_id, amount} = req.body;
  User.findOne({_id: sender_id}, function(errorOne, sender){
    if ( errorOne){return next(errorOne);}
    if ( amount > sender.balance )
    {
      res.json({message: "Balance Insufficient"});
      return;
    }
    User.findOne({_id: receiver_id}, function(errorTwo, receiver){
      if ( errorTwo){return next(errorTwo);}
      if ( sender && receiver )
      {
        let trTime = new Date;
        let senderBal = {
          balance: sender.balance - amount
        }
        let senderTransaction = {
          date: trTime,
          amount: -amount,
          otherParty: receiver.screenName
        }
        let receiverBal = {
          balance: receiver.balance + amount
        }
        let receiverTransaction = {
          date: trTime,
          amount: amount,
          otherParty: sender.screenName
        }
        User.update({_id: sender_id}, {$set: senderBal, $push: {transactions: senderTransaction}}, function(err){
          if(err){return next(err);}
          User.update({_id: receiver_id}, {$set: receiverBal, $push: {transactions: receiverTransaction}}, function(err){
            if(err){return next(err);}
            res.json({message: "Payment was Successful"});
          })
        })
      }
      else
      {
        res.json({message: "Payment Unsuccessful"});
      }
    })
  })
}

exports.deleteWallet = function(req, res, next){
  let {user_id, desTag, cashRegister} = req.body;
  let findthiswallet = `${cashRegister}${desTag}`;
  User.update({_id: user_id}, {$pull: {wallets: desTag}}, function(err){
    if (err){return next(err);}
    UsedWallet.findOneAndRemove({wallet: findthiswallet}, function(err){
      if ( err ){return next(err);}
      res.json({

      });
    })
  })
}

exports.sendMoney = function(req, res, next){
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let {amount, fromAddress, toAddress, sourceTag, toDesTag, userId} = req.body;
  let bankAddress = Object.keys(bank)[0];

  Bank.findOne({address: bankAddress}, function(err, existingBank){
    User.findOne({_id: userId}, function(err, existingUser){
      if ( amount > existingUser.balance )
      {
        res.json({message: "Balance Insufficient"});
        return;
      }
      server.connect().then(() => {
        const myPayment = server.thePayment(fromAddress, toAddress, toDesTag, sourceTag, amount);
        console.log(myPayment);
        CashRegister.findOne({address: fromAddress}, function(err, register){
          if (err) { return next(err); }

          let sendMyMoney = () => {
            bcrypt.compare(addresses[fromAddress], register.secret, function (err, respondence) {
              if ( respondence === true )
              {
                server.api.preparePayment(fromAddress, myPayment).then((orderinfo)=>{
                  let theFee = orderinfo.instructions.fee;
                  //VVIMP - WE ARE SIGNING THE TRANSACTIONS WHILE THE SERVER IS TURNED OFF FOR EXTRA SECURITY
                  server.api.disconnect().then(()=>{
                    let jstring = server.api.sign(orderinfo.txJSON, addresses[fromAddress]);
                    let signedTransact = jstring.signedTransaction;
                    server.connect().then(()=>{
                      let numberFee = parseFloat(theFee);
                      Money.update({}, {$inc: {cost: numberFee, revenue: 0.02, profit: 0.02 - numberFee}}, function(err){
                        if(err){return next(err);}
                        server.api.submit(signedTransact).then((result) => {
                          console.log(result);
                          res.json({message: result.resultCode});
                        }).catch(message => res.json({message: "Error In submitting transaction"}));
                      })
                    })
                  })
                }).catch(message => res.json({message: "Error in submitting transaction"}))
              }
              else
              {
                res.json({message: "Someone's Trying to Get into Your Wallet"});
              }
            });
          }

          let refillCashRegisterAndSend = () => {
            let thePay = server.thePayment(bankAddress, fromAddress, null, 0, 30)
            console.log(thePay);
            bcrypt.compare(bank[bankAddress], existingBank.secret, function (errors, respondent){
              if ( respondent === true )
              {
                server.api.preparePayment(bankAddress, thePay).then((theOrderInfo) =>{
                  server.api.disconnect().then(()=>{
                    let theJstring = server.api.sign(theOrderInfo.txJSON, bank[bankAddress]);
                    let theSignedTransact = theJstring.signedTransaction;
                    server.connect().then(()=>{
                      server.api.submit(theSignedTransact).then((resultance) => {
                        console.log(resultance);
                        sendMyMoney();
                      })
                    })
                  })
                }).catch((err) => console.log(err))
              }
            })
          }

          //addresses[fromAddress] is the secret we have in our atom page and what we use to sign the payment.
          //I am taking an address from another file and then I'm checking if that
          //password checks out with the bcrypt hashed secret key stored in the database
          server.api.getBalances(fromAddress).then((balinfo) => {
            // Done to check if the address has a minimum of 20 ripple in it. All addresses of ours should abide
            if ( parseFloat(balinfo[0].value) - amount < 20 )
            {
              refillCashRegisterAndSend();
            }
            else
            {
              sendMyMoney();
            }
          })
          //I believe that his bcrypt.compare function is taking the secret key on a remote computer(atom) and not sending it in through any
          //server
          //I DON'T KNOW IF THERE IS ANY POINT OF STORING THE SECRET KEYS IN THE DATABASE WHEN THEY CAN EASILY BE STORED IN AN ATOM FILE.
        })
      })
    })
  })
}

exports.findOldAddress = function( req, res, next){
  let x = req.query;
  let userId = x[Object.keys(x)[0]];
  User.findOne({_id: userId}, function(err, existingUser){
    res.json({cashRegister: existingUser.cashRegister});
  });
};

exports.generateRegister = function(req, res, next){
  let adds = Object.keys(addresses).slice(0,5);
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let x = req.query;
  let userId = x[Object.keys(x)[0]];
  User.findOne({ _id: userId }, function (err, existingUser) {
    if (err) { return next(err);}
    server.connect().then(() => {
      let allbals = [];
      let minAddr;
      let newBal;
      //I am getting the median balance cash register and using it.
      async.mapSeries(adds, function(addr, cb){
        server.api.getBalances(addr).then((info) => {
          allbals.push([parseFloat(info[0].value), addr]);
          cb(null, addr);
        })
      }, function(error, resp){
          //THIS SORT IS THREADSAFE and NON-BLOCKING
          async.sortBy(allbals, function(single, cb){
            cb(null, single[0])
          },function(err, respo){
            let newregister = respo[Math.floor(allbals.length/2)][1];
            User.update({_id: existingUser._id}, {cashRegister: newregister}, function (err) {
              if (err) { return next(err); }
              res.json({
                cashRegister: newregister
              });
            });
          })
        })
      })
    })
  }

  exports.receiveAllWallets = function(req, res, next){
    let x = req.query;
    let userId = x[Object.keys(x)[0]]
    User.findOne({ _id: userId }, function (err, existingUser) {
      if (err) { return next(err); }
      res.json({wallets: existingUser.wallets});
    })
  }

// Address and Destination/Source Tag used to get user's transactions and balance
// Last Transaction ID is the stopping point at which new balance is created.
// Last Transaction ID is reset to the first transaction ID that matches
// A user's address and destination tag
exports.getTransactions = function (req, res, next) {
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let x = req.query;
  let userId = x[Object.keys(x)[0]];
  User.findOne({ _id: userId }, function (err, existingUser) {
    if (err) { return next(err); }

    let sendHomePageInfo = () => {
      res.json({
        transactions: existingUser.transactions,
        balance: existingUser.balance
      });
    }

    if (existingUser.cashRegister) {
      server.connect().then(() => {
        let newbalance;
        server.api.getBalances(existingUser.cashRegister).then((info)=> {
          newbalance = info[0].value;
          let cashreg = {
            balance: newbalance
          }
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

              let allWallets = existingUser.wallets;

              const manipulateTransactions = function(currTxn, setLastTransBool, stopIterBool) {
                if(allWallets.includes(currTxn.specification.destination.tag) || allWallets.includes(currTxn.specification.source.tag)) {
                  if ( setLastTransBool )
                  {
                    changedUser.lastTransactionId = currTxn.id;
                    setLastTransBool = false;
                  }
                  if (currTxn.id === existingUser.lastTransactionId) {
                    stopIterBool = true;
                    return [setLastTransBool, stopIterBool];
                  }
                    let counterParty;
                    //This only has to look at 2 keys, so It is ok that it is using forEach. It won't be that blocking.
                    Object.keys(currTxn.outcome.balanceChanges).forEach((addr) => {
                      if (userAddress !== addr) {
                        counterParty = addr;
                        return;
                      }
                    });
                    let balanceChange = parseFloat(currTxn.outcome.balanceChanges[userAddress][0].value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
                    if ( balanceChange < 0 )
                    {
                      balanceChange -= 0.02;
                    }
                    changedUser.balance += balanceChange;
                    let newTxn = {
                      date: new Date(currTxn.outcome.timestamp),
                      amount: balanceChange,
                      txnId: currTxn.id,
                      otherParty: counterParty
                    };
                    changedUser.transactions.unshift(newTxn);
                }
                return [setLastTransBool, stopIterBool];
              };
              // map over transactions asynchronously
              let setLastTransBool = true;
              let stopIterBool = false;
              // Stop at a user's last transaction ID and reset the last TID.
              async.mapSeries(txnInfo, function (currTxn, cb) {
                [setLastTransBool, stopIterBool] = manipulateTransactions(currTxn, setLastTransBool, stopIterBool);
                if ( !stopIterBool )
                {
                  cb(null, currTxn);
                }
                else {
                  cb(true)
                }
              }, function(error, resp) {
                //SORTING INSIDE OF THE SERVER IS BLOCKING INSTEAD THE SORTING IS DONE IN HOME.JS CLIENT-SIDE
                User.update({_id: existingUser._id}, changedUser, function (err) {
                  if (err) { return next(err); }
                  sendHomePageInfo();
                });
              });
            });
          })
        })
      });
    }
    else
    {
      sendHomePageInfo();
    }
  });
};
