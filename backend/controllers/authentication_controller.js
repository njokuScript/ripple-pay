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

exports.signin = function(req, res) {
  var user = req.user;
  res.send({token: tokenForUser(user), user_id: user._id});
};

// req.body is {email: whatever, password: whatever}
exports.signup = function(req, res, next) {
  console.log(req.body)
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

//I'm gonna add the ripple api calls to this page so we can get stuff we want from ripple

//There will be a call to get my transactions from Ripple and then a call to the operational address w/destination tag that we gave to this user

//Very dumb - req.query refers to the 'params' that I passed in from auth actions
//Also dumb - req.query.user has returns a JSON string so I had to parse it to an object

//This finally works now.
exports.getTransactions = function (req, res, next) {
  let userId = JSON.parse(req.query.user).user_id;
  //You need to specifically have _id NOT id - dumb
  User.findOne({_id: userId}, function(err, existingUser) {
    if (err) { return next(err); }
    let totalTransactions = existingUser.transactions;
    let totalBalance = existingUser.balance;
    //Our response is a JSON object. The next file to look at is the AuthActions where we follow up on our initial promise.
    res.json({transactions: totalTransactions, balance: totalBalance});
  });
};

exports.search = function (req, res, next) {
  let item = req.query;

  //Dont add strings together, concatenate them since adding together adds 1byte of memory per string character - dev

  // let reg = new RegExp(`^${item}\\w*$`, 'i')
  console.log(req.query);
  console.log('+++++++++++++');
  // you can see the correct query print to the server console, however
  // if you look at it in the console, it is a key value pair like this: {'0': 'user input'}
  // so i did this cuz i didn't know how to get the key
  Object.keys(item)[0];
  let key = Object.keys(item)[0];
  let reg = new RegExp(`^${item[key]}\\w*$` , 'i');

  // this is how we make the regex work
  // you can see the correct regex print to the server console
  console.log(reg);
  console.log('+++++++++++++');
  User.find({ "screenName": reg } , function(err, users) {
    if (err) { return next(err); }
    console.log(users);;
    // Our response is a JSON object. The next file to look at is the AuthActions where we follow up on our initial promise.
    res.json({search: users.map((user) => {
      console.log("Username: ",user.screenName);
      return user.screenName;
    }).sort()});
  });
};
