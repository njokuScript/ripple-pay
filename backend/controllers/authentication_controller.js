const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

EXPIRE_TIME = 5*60*1000 // 5 minutes

exports.tokenForUser = function(user) {
  let timeStamp = new Date().getTime();
  let expireStamp = new Date(timeStamp + EXPIRE_TIME);
  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    exp: expireStamp
  }, config.secret);
}

//req.body is the object that is sent from the frontend. from the authactions.
// This is pretty weird but because of router.route() in the router.js, the call to
// POST /sigin will go to localstrategy in passport.js and then the request.user will be
// formed and sent to below function
// res.send vs res.json - res.send won't convert undefined and null but json will to JSON
exports.signin = function(req, res) {
  const user = req.user;
  res.send({
    user_id: user._id,
    token: exports.tokenForUser(user),
    cashRegister: user.cashRegister,
    wallets: user.wallets,
    screenName: user.screenName
  });
};

exports.comparePassword = function(req, res) {
  const user = req.user;
  const { password } = req.body;
  user.comparePassword(password, function (error, isMatch) {
    if (error) { return next(error); }
    if (!isMatch) { 
      res.json({ success: false, token: exports.tokenForUser(user)});
      return;
    }
    res.json({ success: true, token: exports.tokenForUser(user)});
  });
};

// req.body is {email: whatever, password: whatever}
exports.signup = function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let screenName = req.body.screenName;
  if (!email || !password || !screenName) {
    return res.status(422).json({error: "You must provide an email, password & screen name"});
  }

  //Check if user already exists, send error if they do
  User.findOne({email: email}, function(err, existingUser) {
    if (err) { return next(err) }
    if (existingUser) {return res.status(422).json({error: "Email taken"})}
    let user = new User({
      email: email,
      password: password,
      screenName: screenName
    });
    user.save(function(err) {
      if (err) { return next(err); }
      res.json({user_id: user._id, token: exports.tokenForUser(user)});
    });
  });
};

exports.search = function (req, res, next) {
  const user = req.user;
  let item = req.query;
  let key = Object.keys(item)[0];
  let reg = new RegExp(`^${item[key]}\\w*$` , 'i');
  User.find({ "screenName": reg } , function(err, users) {
    if (err) { return next(err); }
    res.json({ search: users.map((user) => user.screenName), token: exports.tokenForUser(user)});
  });
};
