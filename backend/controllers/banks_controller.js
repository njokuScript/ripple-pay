// const bank = require('../models/vault');
const User = require('../models/user');
const {CashRegister} = require('../models/populateBank');
const {Bank} = require('../models/populateBank');
const {UsedWallet} = require('../models/populateBank');
const {Money} = require('../models/populateBank');
const async = require('async');
const {addresses, bank} = require('./addresses');
const bcrypt = require('bcrypt-nodejs');

//I am going to need {params: {user}} to be passed from the authactions.
//FUNCTION: this will find the most empty cash register and will make a base32 destTag to assign to the user.

//This function will get the most empty cash register and let the user fill this cash register.

//fromAddress and sourceTag will be required from the frontend for the transaction to go through
//CashRegister and DesTag of the User will be both of these things.

//I am going to check all the wallets and see if I find a address + desTag combo
//and if I do, I will make a recursive call and restart.
//Since there is a very low chance of a coincide, this shouldn't have to recurse at all
//or more than once ever.
//NOT SURE IF THIS IS THREADSAFE, akshay.

exports.receiveOnlyDesTag = function(req, res, next){
  let {user_id, cashRegister} = req.body;
  let newTag;
  let findthis;
  // let testBool = true;
  let recurse = function(){
    // if ( testBool )
    // {
    //   newTag = 3633108510;
    //   testBool = false;
    // }
    // else
    // {
    newTag = parseInt(Math.floor(Math.random()*4294967294));
    // }
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
  console.log(sender_id, receiver_id, amount);
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



//I'm storing a used wallet as cashRegister + desTag without adding Strings which is expensive
//intrapolation is better.
exports.deleteWallet = function(req, res, next){
  let {user_id, desTag, cashRegister} = req.body;
  let findthiswallet = `${cashRegister}${desTag}`;
  User.update({_id: user_id}, {$pull: {wallets: desTag}}, function(err){
    if (err){return next(err);}
    //NOT SURE HOW FINDONE AND REMOVE WORKS
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
    //Change the refill value from 5 to whatever you need later. May be a prob with the null for the sourceTag
    //The sourceTag is temporarily just made 0 but this can be changed later. It doesn't matter what the bank's source tag is.
    User.findOne({_id: userId}, function(err, existingUser){
      if ( amount > existingUser.balance )
      {
        res.json({message: "Balance Insufficient"});
        return;
      }
      server.connect().then(() => {
        const myPayment = server.thePayment(fromAddress, toAddress, toDesTag, sourceTag, amount);
        CashRegister.findOne({address: fromAddress}, function(err, register){
          if (err) { return next(err); }
          //addresses[fromAddress] is the secret we have in our atom page and what we use to sign the payment.
          //I'm not sure if this is the proper usage of bcrypt, I am taking an address from another file and then I'm checking if that
          //password checks out with the bcrypt hashed password stored in our database
          server.api.getBalances(fromAddress).then((balinfo) => {
            if ( parseFloat(balinfo[0].value) - amount < 20 )
            {
              let thePay = server.thePayment(bankAddress, fromAddress, null, 0, 30)
              bcrypt.compare(bank[bankAddress], existingBank.secret, function (errors, respondent){
                if ( respondent === true )
                {
                  server.api.preparePayment(bankAddress, thePay).then((theOrderInfo) =>{
                    console.log(theOrderInfo);
                    server.api.disconnect().then(()=>{
                      let theJstring = server.api.sign(theOrderInfo.txJSON, bank[bankAddress]);
                      let theSignedTransact = theJstring.signedTransaction;
                      server.connect().then(()=>{
                        server.api.submit(theSignedTransact).then((resultance) => {
                          console.log(resultance);
                          bcrypt.compare(addresses[fromAddress], register.secret, function (err, respondence) {
                            if ( respondence === true )
                            {
                              server.api.preparePayment(fromAddress, myPayment).then((ordersinfo)=>{
                                console.log(ordersinfo);
                                server.api.disconnect().then(()=>{
                                  let ajstring = server.api.sign(ordersinfo.txJSON, addresses[fromAddress]);
                                  let asignedTransact = ajstring.signedTransaction;
                                  server.connect().then(()=>{
                                    server.api.getFee().then((fee)=>{
                                      numFee = parseFloat(fee);
                                      Money.updateMany({}, {$inc: {cost: numFee}, $inc: {revenue: 0.02}, $inc: {profit: 0.02 - numFee}}, function(err){
                                        if(err){return next(err);}
                                        server.api.submit(asignedTransact).then((resultss) => {
                                          console.log(resultss);
                                          res.json({message: resultss.resultCode})
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            }
                          })
                        })
                      })
                    })
                  }).catch((err) => console.log(err))
                }
              })
            }
            else
            {
              bcrypt.compare(addresses[fromAddress], register.secret, function (err, respondence) {
                if ( respondence === true )
                {
                  server.api.preparePayment(fromAddress, myPayment).then((orderinfo)=>{
                    console.log(orderinfo);
                    //VVIMP - WE ARE SIGNING THE TRANSACTIONS WHILE THE SERVER IS TURNED OFF FOR EXTRA SECURITY
                    server.api.disconnect().then(()=>{
                      let jstring = server.api.sign(orderinfo.txJSON, addresses[fromAddress]);
                      let signedTransact = jstring.signedTransaction;
                      server.connect().then(()=>{
                        server.api.getFee().then((theFee)=>{
                          let numberFee = parseFloat(theFee);
                          Money.update({}, {$inc: {cost: numberFee, revenue: 0.02, profit: 0.02 - numberFee}}, function(err){
                            if(err){return next(err);}
                            server.api.submit(signedTransact).then((result) => {
                              console.log(result);
                              res.json({message: result.resultCode});
                            }).catch(message => res.json({message: "Error In submitting transaction"}));
                          })
                        })
                        // I believe that using res.json will help to resolve everything and will end it
                      })
                    })
                  })
                }
                else
                {
                  res.json({message: "Someone's Trying to Get into Your Wallet"});
                }
              });
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

exports.generateRegister = function(req, res, next){
  let adds = Object.keys(addresses).slice(0,5);
  const Rippled = require('./rippleAPI');
  let server = new Rippled();
  let x = req.query;
  let userId = x[Object.keys(x)[0]];
  //remember the value is going to be a string
  User.findOne({ _id: userId }, function (err, existingUser) {
    if (err) { return next(err);}
    server.connect().then(() => {
      let allbals = [];
      let minAddr;
      let newBal;
      //Use Object.keys of the addresses to get the addresses we want to use
      //I am getting the middle balance cash register and using it.
      async.mapSeries(adds, function(addr, cb){
        server.api.getBalances(addr).then((info) => {
          // if(minBal === undefined || parseFloat(info[0].value) < minBal ){
            allbals.push([parseFloat(info[0].value), addr]);
            // minAddr = addr;
          // }
          cb(null, addr);
        })
      }, function(error, resp){
        //You need a better way to handle these destination tags.
          //I dunno if the sort will work if there are more cash registers
          allbals = allbals.sort();
          let newregister = allbals[Math.floor(allbals.length/2)][1];
          User.update({_id: existingUser._id}, {cashRegister: newregister}, function (err) {
            if (err) { return next(err); }
            res.json({
              cashRegister: newregister
            });
          });
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
                  // let currTxn = txnInfo[i];
                  // get other party address
                  // let counterParty;
                  // get last transaction id
                  //I AM DOING THIS TEMPORARILY AND THE USER WILL HAVE MULTIPLE DESTINATION TAGS AND I WILL USE THE LAST ONE FOR CHECKING THE SOURCE TAG
                  //ALSO WILL CHECK IF ANY OF HIS DESTINATION TAGS WERE USED.
                  if(allWallets.includes(currTxn.specification.destination.tag) || allWallets.includes(currTxn.specification.source.tag)) {
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
                  }
                  return [setLastTransBool, stopIterBool];
                };
                // map over transactions asynchronously
                let setLastTransBool = true;
                let stopIterBool = false;
                async.mapSeries(txnInfo, function (currTxn, cb) {
                  [setLastTransBool, stopIterBool] = manipulateTransactions(currTxn, setLastTransBool, stopIterBool);
                  cb(null, currTxn);
                }, function(error, resp) {
                  let ndate;
                  let mdate;
                  changedUser.transactions = changedUser.transactions.sort((a,b)=>{
                    return b.date.getTime() - a.date.getTime();
                  })
                  User.update({_id: existingUser._id}, changedUser, function (err) {
                    if (err) { return next(err); }
                    res.json({
                      transactions: existingUser.transactions,
                      balance: existingUser.balance
                    });
                  });
                });
                  // console.log(changedUser);
                  // console.log('++++++++++++++++++++');
              });
          })
        })
      });
    }
    else
    {
      res.json({
        transactions: existingUser.transactions,
        balance: existingUser.balance
      });
    }
  });
};
