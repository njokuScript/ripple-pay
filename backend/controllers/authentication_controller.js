const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');
const { findFromAndUpdateCache, getFromTheCache, setInCache } = require('../models/redis');
const async = require('async');
let asynchronous = require('asyncawait/async');
let await = require('asyncawait/await');

function tokenForUser(user) {
  let timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, config.secret);
}

//req.body is the object that is sent from the frontend. from the authactions.
// This is pretty weird but because of router.route() in the router.js, the call to
// POST /sigin will go to localstrategy in passport.js and then the request.user will be
// formed and sent to below function
// res.send vs res.json - res.send won't convert undefined and null but json will to JSON
exports.signin = function(req, res) {
  let user = req.user;
  res.send({token: tokenForUser(user), user_id: user._id});
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
      res.json({user_id: user._id, token: tokenForUser(user)});
    });
  });
};

exports.search = asynchronous(function (req, res, next) {
  // Get from cache if cached
  let item = req.query;
  let key = Object.keys(item)[0];
  let reg = new RegExp(`${item[key]}\\w*` , 'g');
  let allUsers = await (RedisCache.getAsync('all-users'));
  if (allUsers) {
    res.json({search: allUsers.match(reg)});
    return;
  }
  // Get from Mongo and set in cache
  allUsers = await (User.find({}));
  allUsers = JSON.stringify(allUsers.map((user) => user.screenName).join(' '));
  RedisCache.set('all-users', allUsers);
  res.json({search: allUsers.match(reg)})
  //
  // User.find({ "screenName": reg } , function(err, users) {
  //   if (err) { return next(err); }
  //   res.json({search: users});
  // });
})
