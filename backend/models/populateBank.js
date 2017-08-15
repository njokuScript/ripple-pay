const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const { addresses, bank } = require('../controllers/addresses');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
var app = express();

var router = require('../services/router');

mongoose.connect('mongodb://localhost:introToAuth/introToAuth');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/v1', router);
// app.disable('etag');

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || '127.0.0.1';

console.log('Listening on', HOST, PORT);
app.listen(PORT, HOST);
let vault = new Schema({
  address: {
    type: String
  },
  secret: {
    type: String
  }
});

let cashRegisterSchema = new Schema({
  address: {
    type: String
  },
  secret: {
    type: String
  }
});

vault.pre('save', function (next) {
  var register = this;
  if (register.isNew || register.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) { return next(err); }
      bcrypt.hash(register.secret, salt, null, function (err, hash) {
        if (err) { return next(err); }
        register.secret = hash;
        next();
      });
    });
  } else {
    next();
  }
});

cashRegisterSchema.pre('save', function (next) {
  var register = this;
  if (register.isNew || register.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) { return next(err); }
      bcrypt.hash(register.secret, salt, null, function (err, hash) {
        if (err) { return next(err); }
        register.secret = hash;
        next();
      });
    });
  } else {
    next();
  }
});

addresses.forEach((a) => {
  let Register = mongoose.model('cashRegister', cashRegisterSchema);
  let myCashRegister = new Register(a);
  myCashRegister.save(function (err) {
    if (err) { console.log('did not work'); }
  });
});

bank.forEach((a) => {
  let Vault = mongoose.model('vault', vault);
  let myVault = new Vault(a);
  myVault.save(function (err) {
    if (err) { console.log('did not work'); }
  });
});

// bcrypt.compare('shm8TtYiTHiHn7FaqFjZgYQTqkFP6', '$2a$10$OwbMGwDrw4Xor3KucC0AEudJm/CKctA5zXvmZMwhMN5yo.sC.wDo.', function (err, res) {
//   console.log(res);
// });
