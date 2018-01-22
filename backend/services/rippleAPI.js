// API to interact with Rippled Server
const { RippleAPI } = require('ripple-lib');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
const Redis = require('../services/redis');

// This is the min ledger version that personal rippled server has from beginning of its time.
// exports.MIN_LEDGER_VERSION = 35550104;

const RippledServer = function() {
  this.api = new RippleAPI({
    server: 'wss://s2.ripple.com',
    // server: process.env.NODE_ENV === 'production' ? process.env.RIPPLED_SERVER : require('../configs/config').RIPPLED_SERVER
    // key: fs.readFileSync('../configs/ripplePay.pem').toString()
    // key: process.env.RIPPLE_PEM
  });
  this.api.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
  });
  this.api.on('connected', () => {
    console.log('connected');
  });
  this.api.on('disconnected', (code) => {
    console.log('disconnected, code:', code);
  });
};

RippledServer.prototype.preparePayment = function(fromAddress, toAddress, desTag, sourceTag, value){
  let source = {
    "address": fromAddress,
    "maxAmount": {
      "value": `${value}`,
      "currency": "XRP"
    }
  }
  let destination = {
    "address": toAddress,
    "amount": {
      "value": `${value}`,
      "currency": "XRP"
    }
  };

  if (sourceTag) {
    source = Object.assign({}, source, { "tag": sourceTag });
  }

  if (desTag) {
    destination = Object.assign({}, destination, {"tag": desTag});
  }

  const payment = { source, destination }
  return payment;
};

RippledServer.prototype.getBalance = async(function(address) {
  await(this.api.connect());
  let balInfo;
  let error = null;
  // Check if a new wallet has at least 20 balance.
  try {
    balInfo = await (this.api.getBalances(address));
  } catch (err) {
    error = err;
  }
  if (error) {
    return 0;
  }
  return balInfo[0] ? parseFloat(balInfo[0].value) : 0;
});

RippledServer.prototype.getLedgerVersion = async(function(){
  return this.api.getLedgerVersion();
});

RippledServer.prototype.getServerInfo = async(function(){
  await(this.api.connect());
  const serverInfo = await(this.api.getServerInfo());
  console.log(serverInfo);
  return serverInfo;
});

RippledServer.prototype.getTransactions = async(function(address) {
  await(this.api.connect());
  const serverInfo = await(this.api.getServerInfo());
  // console.log(serverInfo);
  const completeLedgers = serverInfo.completeLedgers.match(/(\d+)\-(\d+)/g);
  const transactions = [];
  
  completeLedgers.forEach((combo) => {
    const minMax = combo.match(/\d+/g);
    const minLedgerVersion = parseInt(minMax[0]);
    const maxLedgerVersion = parseInt(minMax[1]);
    const nextTransactions = await(this.api.getTransactions(address, { minLedgerVersion: minLedgerVersion, maxLedgerVersion: maxLedgerVersion, types: ["payment"]}));
    transactions.push(...nextTransactions);
  });
  // console.log(minLedgerVersion, maxLedgerVersion);
  return transactions;
});

RippledServer.prototype.getTrustlines = async(function(address) {
  await(this.api.connect());
  const trustLines = await(this.api.getTrustlines(address));
  console.log(trustLines);
  return trustLines
});

RippledServer.prototype.getTransactionInfo = async(function(fromAddress, toAddress, value, sourceTag, destTag, userId) {
  await(this.api.connect());
  const paymentObject = this.preparePayment(fromAddress, toAddress, destTag, sourceTag, value);
  const txnInfo = await(this.api.preparePayment(fromAddress, paymentObject, { maxLedgerVersionOffset: 250 }));

  if (userId) {
    await (Redis.setInCache("prepared-transaction", userId, txnInfo));
  }
  return txnInfo;
});

RippledServer.prototype.generateAddress = async(function(){
  await(this.api.connect());

  const addressObject = await(this.api.generateAddress());  
  return addressObject;
});


RippledServer.prototype.signAndSend = async(function(address, secret, userId) {
  await(this.api.connect());

  txnInfo = await(Redis.getFromTheCache("prepared-transaction", userId));
  if (!txnInfo) {
    return null;
  }
  console.log(txnInfo);

  const fee = parseFloat(txnInfo.instructions.fee);
  const signature = this.api.sign(txnInfo.txJSON, secret);
  const txnBlob = signature.signedTransaction;

  const result = await(this.api.submit(txnBlob));
  Redis.removeFromCache("prepared-transaction", userId);

  return result;
});

module.exports = RippledServer;

// const ripple = new RippledServer();
// ripple.generateAddress();
// ripple.getServerInfo();
// ripple.getTransactions("r9bxkP88S17EudmfbgdZsegEaaM76pHiW6");
// ripple.api.getTrustlines()
// ripple.getTrustlines("raa6pjF59F5DrFLcpbTVskjSVGnbWTYMXL")

// Run node rippleAPI.js to run this file for testing
