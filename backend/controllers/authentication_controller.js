const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  var timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, config.secret);
}

//req.body is the object that is sent from the frontend. from the authactions.

exports.signin = function(req, res, next) {
  var user = req.user;
  res.send({token: tokenForUser(user), user_id: user._id});
};

//req.body is {email: whatever, password: whatever}
exports.signup = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  let screenName = req.body.screenName;
  if (!email || !password || !screenName) {
    return res.status(422).json({error: "You must provide an email, password & screen name"});
  }

  //Check if user already exists, send error if they do
  User.findOne({email: email}, function(err, existingUser) {
    if (err) { return next(err) }
    if (existingUser) {return res.status(422).json({error: "Email taken"})}
    var user = new User({
      email: email,
      password: password,
      screenName: screenName
    });
    user.save(function(err) {
      if (err) { return next(err); }
      res.json({user_id: user._id, token: tokenForUser(user)});
    });
  });
};

// User.findOne will return a promise and that promise takes the existingUser as a an Object that we can use to get
// the user's transactions and balance through the database. I realized this by looking at the code above.

exports.getTransactions = function (req, res, next) {
  let userId = req.body.user_id;
  User.findOne({id: userId}, function(err, existingUser) {
    if (err) { return next(err) }
    let totalTransactions = existingUser.transactions;
    let totalBalance = existingUser.balance;

    //Our response is a JSON object. The next file to look at is the AuthActions where we follow up on our initial promise.
    res.json({transactions: totalTransactions, balance: totalBalance});
  });
};

exports.search = function (req, res, next) {
  let query = req.body.query;
  // create regEx with query from user
  let reg = new RegExp(`^${query}\\w*$`, 'g');

  // search database with query, the database returns an array of objects with the screen name and userId
  User.find({ "screenName": reg }, { 'screenName': 1 } , function(err, users) {
    if (err) { return next(err); }
    // Our response is a JSON object. The next file to look at is the AuthActions where we follow up on our initial promise.
    res.json({search: users});
  });
};
