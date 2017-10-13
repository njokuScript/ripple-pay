// const bank = require('../models/vault');
const User = require('../models/user');
const {CashRegister} = require('../models/populateBank');
const {Bank} = require('../models/populateBank');
const {UsedWallet} = require('../models/populateBank');
const {Money} = require('../models/populateBank');
const async = require('async');
let asynchronous = require('asyncawait/async');
let await = require('asyncawait/await');
const {addresses, bank} = require('./addresses');
const bcrypt = require('bcrypt-nodejs');

//Since there is a very low chance of a coincide, this shouldn't have to recurse at all
//or more than once ever.
// DesTags are in 32 bits/
exports.receiveOnlyDesTag = function(req, res, next){
  let {user_id, cashRegister} = req.body;
  let newTag;
  let findthis;
  let genTagRecursion = asynchronous (function(){
      newTag = parseInt(Math.floor(Math.random()*4294967294));
      findthis = `${cashRegister}${newTag}`;
      let existingWallet = await (UsedWallet.findOne({wallet: findthis}))
      if ( existingWallet )
      {
        // console.log("same address and dest tag not allowed");
        genTagRecursion();
      }
      else
      {
        let theNewWallet = new UsedWallet({wallet: findthis});
        await (theNewWallet.save());
        await (User.update({_id: user_id}, {$push: {wallets: newTag}}));
        res.json({ destinationTag: newTag });
      }
    }
  )

  genTagRecursion();
}

exports.inBankSend = function(req, res, next){
  let {sender_id, receiver_id, amount} = req.body;

  let sendToUser = asynchronous (function(){
    let sender = await (User.findOne({_id: sender_id}))
    if ( amount > sender.balance )
    {
      res.json({message: "Balance Insufficient"});
      return;
    }
    let receiver = await (User.findOne({_id: receiver_id}))
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
      await (User.update({_id: sender_id}, {$set: senderBal, $push: {transactions: senderTransaction}}))
      await (User.update({_id: receiver_id}, {$set: receiverBal, $push: {transactions: receiverTransaction}}))
      res.json({message: "Payment was Successful"});
    }
    else
    {
      res.json({message: "Payment Unsuccessful"})
    }
  })

  sendToUser();
}

exports.deleteWallet = function(req, res, next){
  let {user_id, desTag, cashRegister} = req.body;
  let findthiswallet = `${cashRegister}${desTag}`;
  let removeWallet = asynchronous (function(){
  await (User.update({_id: user_id}, {$pull: {wallets: desTag}}));
  await (UsedWallet.findOneAndRemove({wallet: findthiswallet}));
    res.json({

    });
  })

  removeWallet();
}

exports.sendMoney = function(req, res, next){
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let {amount, fromAddress, toAddress, sourceTag, toDesTag, userId} = req.body;
  let bankAddress = Object.keys(bank)[0];

  let mainFunction = asynchronous (function(){
    let existingUser = await (User.findOne({_id: userId}));
    if ( amount > existingUser.balance )
    {
       res.json({message: "Balance Insufficient"});
       return;
    }
    await (server.connect());
    const myPayment = server.thePayment(fromAddress, toAddress, toDesTag, sourceTag, amount);
    console.log(myPayment);
    let balInfo = await (server.api.getBalances(fromAddress));
    let register = await (CashRegister.findOne({address: fromAddress}));
    let sendMyMoney = asynchronous (function(){
      bcrypt.compare(addresses[fromAddress], register.secret, asynchronous (function(err, theResponse){
        if (err) { return next(err)}
        // IMP: MUST REMOVE THE TRY AND CATCH IF YOU WANT TO SEE THE ERRORS WHILE DEBUGGING
        if ( theResponse )
        {
          try {
            let orderinfo = await (server.api.preparePayment(fromAddress, myPayment));
            let theFee = orderinfo.instructions.fee;
            await (server.api.disconnect());
            let jstring = server.api.sign(orderinfo.txJSON, addresses[fromAddress]);
            let signedTransact = jstring.signedTransaction;
            await (server.connect());
            let numberFee = parseFloat(theFee);
            await (Money.update({}, {$inc: { cost: numberFee, revenue: 0.02 + numberFee, profit: 0.02 }}));
            let result = await (server.api.submit(signedTransact));
            console.log(result);
            res.json({message: result.resultCode});
          }
          catch (err){
            res.json({message: "Error In submitting transaction"});
          }
        }
        else
        {
          res.json({message: "Someone's Trying to Get into Your Wallet"});
        }
      }))
    })
    let refillCashRegisterAndSend = asynchronous(function(){
      let existingBank = await(Bank.findOne({address: bankAddress}));
      let thePay = server.thePayment(bankAddress, fromAddress, null, 0, 30)
      console.log(thePay);
      try {
        bcrypt.compare(bank[bankAddress], existingBank.secret, asynchronous (function(err, respondent){
          if ( respondent )
          {
            let theOrderInfo = await (server.api.preparePayment(bankAddress, thePay));
            await (server.api.disconnect());
            let theJstring = server.api.sign(theOrderInfo.txJSON, bank[bankAddress]);
            let theSignedTransact = theJstring.signedTransaction;
            await (server.connect());
            let resultance = await (server.api.submit(theSignedTransact));
            console.log(resultance);
            sendMyMoney();
          }
        }))
      }
      catch (err){
        console.log(err);
      }
    })
      // Done to check if the address has a minimum of 20 ripple in it. All addresses of ours should abide
    if ( parseFloat(balInfo[0].value) - amount < 20 )
    {
      refillCashRegisterAndSend();
    }
    else
    {
      sendMyMoney();
    }
  })

  mainFunction();
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

  let makeRegister = asynchronous (function(){
    let existingUser = await (User.findOne({ _id: userId }));
    await (server.connect());
    let allbals = [];
    let minAddr;
    let newBal;
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
        User.update({_id: existingUser._id}, {cashRegister: newregister},
          function (err) {
            if (err) { return next(err); }
            res.json({
              cashRegister: newregister
            });
          });
        })
      })
    })

  makeRegister();
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

  let receiveTransactions = asynchronous (function (){
    let existingUser = await (User.findOne({ _id: userId }));
    let sendHomePageInfo = () => {
      res.json({
        transactions: existingUser.transactions,
        balance: existingUser.balance
      });
    }
    if (existingUser.cashRegister)
    {
      await (server.connect());
      let newbalance;
      let info = await (server.api.getBalances(existingUser.cashRegister));
      newbalance = info[0].value;
      let cashreg = {
        balance: newbalance
      }
      await (CashRegister.findOneAndUpdate({ address: existingUser.cashRegister }, cashreg, {upsert: false}));
      let txnInfo = await (server.api.getTransactions(existingUser.cashRegister, { excludeFailures: true, types: ["payment"] }));
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
    }
    else
    {
      sendHomePageInfo();
    }
  })

  receiveTransactions();
}
