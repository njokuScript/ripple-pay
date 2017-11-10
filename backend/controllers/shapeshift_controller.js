const async = require('async');
let asynchronous = require('asyncawait/async');
let await = require('asyncawait/await');
const User = require('../models/user');

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
  res.json({

  })
})

exports.getShapeshiftTransactions = asynchronous (function(req, res, next) {
  let x = req.query;
  let userId = x[Object.keys(x)[0]];
  let existingUser = await(User.findOne({_id: userId}))
  res.json({
    shapeshiftTransactions: existingUser.shapeshiftTransactions
  })
})
