const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const { addresses, bank } = require('../controllers/addresses');
const async = require('async');
const {CashRegister} = require('./populateBank');
const {Bank} = require('./populateBank');
const {Money} = require('./populateBank');

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

mongoose.connection.once('connected', () => {
    mongoose.connection.db.dropCollection('vaults');
    mongoose.connection.db.dropCollection('cashregisters');
});
const Rippled = require('../controllers/rippleAPI');
let server = new Rippled();
let adds = Object.keys(addresses);

// server.getBalance(addresses[0].address);
server.connect().then(()=>{
  let recurse = function(n = 0){

    //This is a recursive function that will help to save all of the balances of our cash Registers.
    //5 is the length of the number of cash registers we have so when this increases, just increase it.
    if ( n === 5 )
    {
      return;
    }
    server.api.getBalances(adds[n]).then((info) => {
      let Register = CashRegister;
      let addon = {
        address: adds[n],
        secret: addresses[adds[n]],
        balance: info[0].value
      }
      let myCashRegister = new Register(addon);
      myCashRegister.save(function (err) {
        if (err) { console.log('did not work'); }
        return recurse(n + 1);
      });
    })
  }
  recurse();
  let x = Object.keys(bank);
  server.api.getBalances(x[0]).then((info) => {
    let savebank = {
      address: x[0],
      secret: bank[x[0]],
      balance: info[0].value
    }
    let Vault = Bank;
    let myVault = new Vault(savebank);
    myVault.save(function (err) {
      if (err) { console.log('did not work'); }
    });
  })
})

let cash = new Money;
cash.save(function(err){
  
})
