const async = require('async');
let asynchronous = require('asyncawait/async');
let await = require('asyncawait/await');
const User = require('../models/user');
const { findFromAndUpdateCache, getFromTheCache, setInCache } = require('../models/redis');
// from e.g. would be 'from 50 XRP'
// to e.g. would be 'to 1 BTC'
// shapeshiftAddress should be URI encoded if its a Ripple address
// tell user to get the TXN id in their other wallet if its a deposit transaction
exports.createShapeshiftTransaction = asynchronous (function(req, res, next) {
  let { otherParty, from, to, userId, shapeShiftAddress, refundAddress, orderId } = req.body;
  let shapeshift = {
    from,
    to,
    otherParty,
    shapeShiftAddress,
    refundAddress,
    orderId,
    date: new Date()
  }
  await (User.update({ _id: userId }, {$push: {shapeshiftTransactions: shapeshift}}));
  findFromAndUpdateCache('shapeshift-transactions', (val) => val.push(shapeshift));
  res.json({

  })
})

exports.getShapeshiftTransactions = asynchronous (function(req, res, next) {
  let cacheVal = getFromTheCache('shapeshift-transactions');
  if (cacheVal) {
    res.json({shapeshiftTransactions: cacheVal});
    return;
  }
  let x = req.query;
  let userId = x[Object.keys(x)[0]];
  let existingUser = await(User.findOne({_id: userId}));
  setInCache('shapeshift-transactions', JSON.stringify(existingUser.shapeshiftTransactions));
  res.json({
    shapeshiftTransactions: existingUser.shapeshiftTransactions
  })
})

exports.getShapeshiftTransactionId = asynchronous (function(req, res, next) {
  let x = req.query;
  console.log(x);
  let shapeShift = x['0'];
  let date = x['1'];
  let fromAddress = x['2']
  console.log(shapeShift, date);
  let toAddress = shapeShift.match(/\w+/)[0];
  let desTag = parseInt(shapeShift.match(/\?dt=(\d+)/)[1]);
  let Rippled = require('./rippleAPI');
  let server = new Rippled();
  await (server.connect())
  let txnInfo = await (server.api.getTransactions(fromAddress, { excludeFailures: true, types: ["payment"] }));
  const manipulateTransactions = function(currTxn) {
    console.log(currTxn);
    if(toAddress === currTxn.specification.destination.address &&
      desTag === currTxn.specification.destination.tag) {
      return currTxn.id;
    }
    else if (new Date(currTxn.outcome.timestamp).getTime() < new Date(date).getTime()) {
      return null;
    }
    return false;
  };
  let transId;
  async.mapSeries(txnInfo, function (currTxn, cb) {
    transId = manipulateTransactions(currTxn);
    if (transId === null){
      cb(true)
    }
    else {
      cb(null, currTxn)
    }
  }, function(error, resp) {
    //SORTING INSIDE OF THE SERVER IS BLOCKING INSTEAD THE SORTING IS DONE IN HOME.JS CLIENT-SIDE
    res.json({
      txnId: transId
    })
  });

})
