const async = require('async');
let asynchronous = require('asyncawait/async');
let await = require('asyncawait/await');
const User = require('../models/user');
const Auth = require('./authentication_controller');
const { findFromAndUpdateCache, getFromTheCache, setInCache } = require('../models/redis');
// from e.g. would be 'from 50 XRP'
// to e.g. would be 'to 1 BTC'
// shapeshiftAddress should be URI encoded if its a Ripple address
// tell user to get the TXN id in their other wallet if its a deposit transaction
exports.createShapeshiftTransaction = asynchronous (function(req, res, next) {
  let { otherParty, from, to, shapeShiftAddress, refundAddress, orderId } = req.body;
  const user = req.user;
  let userId = user._id;
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
  findFromAndUpdateCache(`${userId}: shapeshift-transactions`, (val) => val.push(shapeshift));
  res.json({
    token: Auth.tokenForUser(user)
  })
})

exports.getShapeshiftTransactions = asynchronous (function(req, res, next) {
  let existingUser = req.user;
  let userId = existingUser._id;
  let cacheVal = await (getFromTheCache(`${userId}: shapeshift-transactions`));
  if (cacheVal) {
    res.json({
      shapeshiftTransactions: cacheVal,
      token: Auth.tokenForUser(existingUser);
    });
    return;
  }
  setInCache(`${userId}: shapeshift-transactions`, existingUser.shapeshiftTransactions);
  res.json({
    shapeshiftTransactions: existingUser.shapeshiftTransactions,
    token: Auth.tokenForUser(existingUser);
  })
})

exports.getShapeshiftTransactionId = asynchronous (function(req, res, next) {
  const user = req.user;
  let query = req.query;
  let shapeShift = query['0'];
  let date = query['1'];
  let fromAddress = query['2']
  // undefined could cause errors here
  let toAddress = shapeShift.match(/\w+/)[0];
  let desTag = parseInt(shapeShift.match(/\?dt=(\d+)/)[1]);
  let Rippled = require('./rippleAPI');
  let server = new Rippled();
  await (server.connect())
  let txnInfo = await (server.api.getTransactions(fromAddress, { excludeFailures: true, types: ["payment"] }));
  const manipulateTransactions = function(currTxn) {
    if(toAddress === currTxn.specification.destination.address && desTag === currTxn.specification.destination.tag) {
      return currTxn.id;
    }
    else if (new Date(currTxn.outcome.timestamp).getTime() < new Date(date).getTime()) {
      return null;
    }
    return false;
  };
  let txnId;
  async.mapSeries(txnInfo, function (currTxn, cb) {
    txnId = manipulateTransactions(currTxn);
    if (txnId === null){
      cb(true)
    }
    else {
      cb(null, currTxn)
    }
  }, function(error, resp) {
    res.json({
      txnId: txnId,
      token: Auth.tokenForUser(user)
    })
  });
})
