const async = require('async');
let asynchronous = require('asyncawait/async');
let await = require('asyncawait/await');
const User = require('../models/user');
const { CashRegister, BANK_NAME } = require('../models/moneyStorage');
const { Transaction } = require('../models/transaction');
const Encryption = require('../services/encryption');
const Decryption = require('../services/decryption');
const RippledServer = require('../services/rippleAPI');
const rippledServer = new RippledServer();

let encryptedAddresses, encryptedBank;
if (process.env.NODE_ENV=='production') {
  encryptedAddresses = JSON.parse(process.env.REGISTERS);
  encryptedBank = JSON.parse(process.env.BANK);
} else {
  encryptedAddresses = require('../configs/addresses').encryptedAddresses;
  encryptedBank = require('../configs/addresses').encryptedBank;
}

const TXN_LIMIT = 10;

exports.inBankSend = asynchronous(function(req, res, next){
  let { receiverScreenName, amount } = req.body;
  let sender = req.user;
  let senderId = sender._id;

  if ( amount > sender.balance ) {
    return res.json({message: "Balance Insufficient", balance: sender.balance});
  }
  
  if (amount <= 0) {
    return res.json({message: "Cant send 0 or less XRP"})
  }

  let receiver = await (User.findOne({ screenName: receiverScreenName }));
  let receiverId = receiver._id;
  if ( sender && receiver ) {
    
    let trTime = new Date().getTime();

    let senderTransaction = new Transaction({
      userId: senderId,
      date: trTime,
      amount: -amount,
      otherParty: receiver.screenName
    });

    let receiverTransaction = new Transaction({
      userId: receiverId,
      date: trTime,
      amount: amount,
      otherParty: sender.screenName
    });

    let updatedSender = await(User.findOneAndUpdate({ _id: senderId }, { '$inc': { balance: -amount } }, { returnNewDocument: true }));
    await (User.findOneAndUpdate({ _id: receiverId }, { '$inc': { balance: amount } }));

    senderTransaction.save(function(err) {
      if (err) {
        console.log(err, "saving sender transaction failed!");
      }
    });
    receiverTransaction.save(function(err) {
      if (err) {
        console.log(err, "saving receiver transaction failed!");
      }
    });
    
    res.json({message: "payment was successful", balance: updatedSender.balance});
  }
  else {
    res.json({message: "payment unsuccessful"});
  }
})

exports.preparePayment = asynchronous(function(req, res, next) {
  let { amount, fromAddress, toAddress, sourceTag, toDesTag } = req.body;
  let existingUser = req.user;
  let userId = existingUser._id;

  if (amount > existingUser.balance) {
    return res.json({ message: "Balance Insufficient" });
  }

  if (amount <= 0) {
    return res.json({ message: "Cant send 0 or less XRP"});
  }

  const masterKey = await(Decryption.getMasterKey());
  const ripplePayAddresses = Decryption.decryptAllAddresses(masterKey, encryptedAddresses);

  // LEAVE THIS OUT TO ALLOW FOR TESTING
  // if (ripplePayAddresses.includes(toAddress)) {
  //   return res.json({ message: "Send with no fee to a ripplePay user!"});
  // }

  const txnInfo = await(rippledServer.getTransactionInfo(fromAddress, toAddress, amount, sourceTag, toDesTag, userId));
  const fee = txnInfo.instructions.fee;
  res.json({
    fee: txnInfo.instructions.fee
  });
})

exports.signAndSend = asynchronous (function(req, res, next){
  const { fromAddress, amount } = req.body;
  const existingUser = req.user;
  const userId = existingUser._id;

  if (amount > existingUser.balance) {
    res.json({ message: "Balance Insufficient" });
    return;
  }

  if (amount <= 0) {
    return res.json({ message: "Cant send 0 or less XRP" });
  }

  const registerAddress = fromAddress;
  const registerBalance = await(rippledServer.getBalance(registerAddress));

  const masterKey = await(Decryption.getMasterKey());
  
  let sendMoney = asynchronous (function(){

      const encryptedRegisterAddress = Encryption.encrypt(masterKey, registerAddress);
      const encryptedRegisterSecret = encryptedAddresses[encryptedRegisterAddress];
      const registerSecret = Decryption.decrypt(masterKey, encryptedRegisterSecret);

      const result = await(rippledServer.signAndSend(registerAddress, registerSecret, userId));

      if (result) {
        console.log(result);
        res.json({message: result.resultCode});
      }
      else {
        res.json({message: "Transaction Failed"});
      }

  })
  // STILL NEED TO FIX THIS FUNCTION WITH SOME KIND OF LEARNING ALGORITHM
  let refillCashRegisterAndSend = asynchronous(function(){

      const encryptedBankAddress = Object.keys(encryptedBank)[0];
      const encryptedBankSecret = encryptedBank[encryptedBankAddress];
      const bankAddress = Decryption.decrypt(masterKey, encryptedBankAddress);
      const bankSecret = Decryption.decrypt(masterKey, encryptedBankSecret);
      
      // refilling by 20 for now until we find a better wallet refill algorithm
      const txnInfo = await(rippledServer.getTransactionInfo(bankAddress, registerAddress, 20, 0, null, null));
      const result = await(rippledServer.signAndSend(bankAddress, bankSecret, BANK_NAME, txnInfo));
      console.log(result);
      sendMoney();

  })

  const amountToSend = amount;
  if ( registerBalance - amountToSend < 20 ) {
    refillCashRegisterAndSend();
  } else {
    sendMoney();
  }
})

// Address and Destination/Source Tag used to get user's transactions and balance
// Last Transaction ID is the stopping point at which new balance is created.
// Last Transaction ID is reset to the first transaction ID that matches
// A user's address and destination tag
exports.getTransactions = asynchronous(function (req, res, next) {
  const existingUser = req.user;
  const userId = existingUser._id;
  if (existingUser.cashRegister) {
    const registerBalance = await (rippledServer.getBalance(existingUser.cashRegister));
    CashRegister.findOneAndUpdate({ address: existingUser.cashRegister }, { balance: registerBalance }, {upsert: false}, function(err, doc) {
      if (err) {
        console.log(err, "updating cash register failed!");
      }
    });
    const transactions = await (rippledServer.getTransactions(existingUser.cashRegister));
    // console.log(txnInfo);
    let userChanges = {
      balance: 0,
      lastTransactionId: null
    };

    let userWallets = existingUser.wallets;
    const userAddress = existingUser.cashRegister;
    let userTransactions = [];

    const processTransaction = function(currTxn, setLastTransaction, stopIteration) {

      const destAddress = currTxn.specification.destination.address;
      const destTag = currTxn.specification.destination.tag;
      const sourceAddress = currTxn.specification.source.address;
      const sourceTag = currTxn.specification.source.tag;
      const destTagIdx = userWallets.indexOf(destTag);
      const sourceTagIdx = userWallets.indexOf(sourceTag);

      if ( (destTagIdx !== -1 && destAddress === userAddress) || (sourceTagIdx !== -1 && sourceAddress === userAddress) ) {
        if ( setLastTransaction )
        {
          userChanges.lastTransactionId = currTxn.id;
          setLastTransaction = false;
        }
        if (currTxn.id === existingUser.lastTransactionId) {
          stopIteration = true;
          return [setLastTransaction, stopIteration];
        }

        let counterParty, tag;

        if (destAddress === userAddress) {
          counterParty = sourceAddress;
          tag = destTag;
        } else {
          counterParty = destAddress;
          tag = sourceTag;
        }

        let balanceChange = parseFloat(currTxn.outcome.balanceChanges[userAddress][0].value);

        if ( balanceChange < 0 && currTxn.outcome.result === "tesSUCCESS")
        {
          // ripplePay fee for outgoing txn
          balanceChange -= 0.02;
        }
        // apply ripple ledger fee
        userChanges.balance += balanceChange;
        // add to user transactions only if its a successful transaction
        if (currTxn.outcome.result === "tesSUCCESS") {
          let newTxn = new Transaction({
            txnId: currTxn.id,
            userId: userId,
            tag: tag,
            date: new Date(currTxn.outcome.timestamp).getTime(),
            amount: balanceChange,
            otherParty: counterParty
          });
          newTxn.save(function(err) {
            if (err) {
              console.log(err, "saving new transaction failed!");
            }
          });
        }
      }
      return [setLastTransaction, stopIteration];
    };
    // map over transactions asynchronously
    let setLastTransaction = true;
    let stopIteration = false;
    // Stop at a user's last transaction ID and reset the last TID.
    async.mapSeries(transactions, asynchronous(function (currTxn, cb) {
      [setLastTransaction, stopIteration] = processTransaction(currTxn, setLastTransaction, stopIteration);
      if ( !stopIteration )
      {
        cb(null, currTxn);
      }
      else {
        cb(true)
      }
    }), function(error, resp) {
      userTransactions = await(Transaction.find({ userId }).sort({ date: -1 }).limit(TXN_LIMIT));
      let updatedUser = await(
        User.findOneAndUpdate(
          {_id: existingUser._id}, 
          {'$set': { lastTransactionId: userChanges.lastTransactionId }, '$inc': { balance: userChanges.balance }},
          { returnNewDocument: true } 
        )
      );
      res.json({
        transactions: userTransactions,
        balance: updatedUser.balance
      });
    });
  }
  else
  {
    userTransactions = await(Transaction.find({ userId }).sort({ date: -1 }).limit(TXN_LIMIT));
    res.json({
      transactions: userTransactions,
      balance: existingUser.balance
    });
  }
})

exports.loadNextTransactions = asynchronous(function(req, res, next) {
  const user = req.user;
  const userId = user._id;
  const maxDate = req.query[0];
  let nextTransactions = await(Transaction.find({ userId: userId, date: { '$lte': maxDate } }).sort({ date: -1 }).limit(TXN_LIMIT+1));
  // remove the first since that will have already been counted.
  nextTransactions = nextTransactions.slice(1);
  const shouldLoadMoreTransactions = nextTransactions.length >= TXN_LIMIT ? true : false;
  res.json({ nextTransactions, shouldLoadMoreTransactions });
});