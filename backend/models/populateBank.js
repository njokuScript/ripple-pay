const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const { addresses, bank } = require('../controllers/addresses');
const async = require('async');
//UNCOMMENT THIS WHEN TRYING TO POPULATE THE BANK
// mongoose.Promise = global.Promise;

// const bodyParser = require('body-parser');
// var app = express();
//
// var router = require('../services/router');
//
// mongoose.connect('mongodb://localhost:introToAuth/introToAuth');
//
// app.use(morgan('combined'));
// app.use(bodyParser.json());
// app.use('/v1', router);
// // app.disable('etag');
//
// var PORT = process.env.PORT || 3000;
// var HOST = process.env.HOST || '127.0.0.1';
//
// console.log('Listening on', HOST, PORT);
// app.listen(PORT, HOST);


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
// const Rippled = require('../controllers/rippleAPI');
// let server = new Rippled();
// let adds = Object.keys(addresses);
// // server.getBalance(addresses[0].address);
// server.connect().then(()=>{
//   let recurse = function(n = 0){
//
//     //This is a recursive function that will help to save all of the balances of our cash Registers.
//     //5 is the length of the number of cash registers we have so when this increases, just increase it.
//     if ( n === 5 )
//     {
//       return;
//     }
//     server.api.getBalances(adds[n]).then((info) => {
//       let Register = mongoose.model('cashRegister', cashRegisterSchema);
//       let addon = {
//         address: adds[n],
//         secret: addresses[adds[n]],
//         balance: info[0].value
//       }
//       let myCashRegister = new Register(addon);
//       myCashRegister.save(function (err) {
//         if (err) { console.log('did not work'); }
//         return recurse(n + 1);
//       });
//     })
//   }
//   recurse();
//   let x = Object.keys(bank);
//   server.api.getBalances(x[0]).then((info) => {
//     let savebank = {
//       address: x[0],
//       secret: bank[x[0]],
//       balance: info[0].value
//     }
//     let Vault = mongoose.model('vault', vault);
//     let myVault = new Vault(savebank);
//     myVault.save(function (err) {
//       if (err) { console.log('did not work'); }
//     });
//   })
// })

module.exports = mongoose.model('cashRegister', cashRegisterSchema);
// console.log(allbalances);
// addresses.forEach((a) => {
//   let m = a;
// });
//
//

// bcrypt.compare('shm8TtYiTHiHn7FaqFjZgYQTqkFP6', '$2a$10$OwbMGwDrw4Xor3KucC0AEudJm/CKctA5zXvmZMwhMN5yo.sC.wDo.', function (err, res) {
//   console.log(res);
// });
