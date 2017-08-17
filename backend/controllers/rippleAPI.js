// API to interact with Rippled Server
const { RippleAPI } = require('ripple-lib');
const { addresses, bank } = require('../controllers/addresses');

class Rippled {
  constructor(){
      this.api = new RippleAPI({
        server: 'wss://s2.ripple.com' // Public rippled server hosted by Ripple, Inc.
        //Need to change this to a private one later.
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
      this.connect = this.connect.bind(this);

    }

    getBalance(address) {
      this.api.getBalances(address).then((info) => console.log(info[0].value));
    }

    getSuccessfulTransactions(address) {
      this.api.getTransactions(address, {excludeFailures: true, types: ["payment"]}).then((info) => console.log(info.map((tx) => tx.specification.destination)));
    }

    getAllTransactions(address) {
      this.api.getTransactions(address).then((info) => console.log(info.map((s) => {
        return s.specification.destination;
      }))).catch(error => {
        console.log("Error", error);
      });
    }

    thePayment(fromAddress, toAddress, desTag, value){
      let payment;
      if (desTag) {
        payment = {
          "source": {
            "address": fromAddress,
            "maxAmount": {
              "value": `${value}`,
              "currency": "XRP"
            }
          },
          "destination": {
            "address": toAddress,
            "tag": desTag,
            "amount": {
              "value": `${value}`,
              "currency": "XRP"
            }
          }
        };
      } else {
        payment = {
        "source": {
          "address": toAddress,
          "maxAmount": {
            "value": `${value}`,
            "currency": "XRP"
          }
        },
        "destination": {
          "address": fromAddress,
          "amount": {
            "value": `${value}`,
            "currency": "XRP"
        }
    }
  };
      }
      return payment;
    }

    signAndSend(fromAddress, toAddress, secret, value, desTag=false) {
      let payment = this.thePayment(fromAddress, toAddress, desTag, value);

      this.api.preparePayment(fromAddress, payment).then((orderinfo) => {
        console.log(orderinfo);
        let jstring = this.api.sign(orderinfo.txJSON, secret);
        let signedTransact = jstring.signedTransaction;
        this.api.submit(signedTransact).then((result) => console.log(result));
      }).catch(error => console.log(error));
    }

    getOtherPartyAddress(address, idx) {
      this.api.getTransactions(address).then((info) => {
      Object.keys(info[idx].outcome.balanceChanges).forEach((addr) => {
        if ( address !== addr )
        {
          console.log(addr);
          return addr;
        }
        });
      }).catch(error => {
          console.log("Error", error);
        });
    }

    // current fee that ripple charges
    getFee() {
      this.api.getFee().then((info) => console.log(info));
    }

    getAccountInfo(address) {
      this.api.getAccountInfo(address).then((info) => console.log(info));
    }

    // not for production use, just use what is in the console.log
    getTransactionId(address, idx) {
      this.api.getTransactions(address).then((info) => console.log(info[idx].id)).catch(error => {
        console.log("Error", error);
      });
    }

    // not for production use, just use what is in the console.log
    getDestinationTag(address, idx) {
      this.api.getTransactions(address).then((info) => console.log(info[idx].specification.destination.tag)).catch(error => {
        console.log("Error", error);
      });
    }

    // not for production use, just use what is in the console.log
    // The following will get the balance change per each transaction.
    balanceChange(address, idx) {
      this.api.getTransactions(address).then((info) => console.log(info[idx].outcome.balanceChanges[address][0].value)).catch(error => {
        console.log("Error", error);
      });
    }

    connect(){
      return this.api.connect();
    }
}

let server = new Rippled();
// server.connect().then(() => server.signAndSend("rs1DXnp8LiKzFWER8JrDkMA7xBxQy1KrWi", "rPN2Nz2M6QBBMhSN2JxFDKhRDQq62TpJLQ", "shm8TtYiTHiHn7FaqFjZgYQTqkFP6", 5, 3559172462));
// let address = "r9bxkP88S17EudmfbgdZsegEaaM76pHiW6";
// server.connect().then(() => server.getSuccessfulTransactions("rs1DXnp8LiKzFWER8JrDkMA7xBxQy1KrWi"));
// server.connect().then(() => server.getBalance("rs1DXnp8LiKzFWER8JrDkMA7xBxQy1KrWi"));

module.exports = Rippled;
