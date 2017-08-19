const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const { addresses, bank } = require('../controllers/addresses');
const async = require('async');

let vault = new Schema({
  address: {
    type: String
  },
  secret: {
    type: String
  },
  balance: {
    type: String
  }
});

let cashRegisterSchema = new Schema({
  address: {
    type: String
  },
  secret: {
    type: String
  },
  balance: {
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


// CLEAR YOUR MODELS AND RUN THIS AND YOU WILL HAVE ALL REGISTER AND BANK WITH UPDATED BALANCE VALUES.


exports.CashRegister = mongoose.model('cashRegister', cashRegisterSchema);
exports.Bank = mongoose.model('vault', vault);
