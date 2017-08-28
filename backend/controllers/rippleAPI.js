// API to interact with Rippled Server
const { RippleAPI } = require('ripple-lib');
const { addresses, bank } = require('../controllers/addresses');

class Rippled {
  constructor(){
      this.api = new RippleAPI({
        server: 'wss://s2.ripple.com' // Public rippled server hosted by Ripple, Inc.
        // server: 'ws://54.70.149.103'
        // proxy: 'http://ec2-54-70-149-103.us-west-2.compute.amazonaws.com'
        // key: '-----BEGIN CERTIFICATE-----MIIEoQIBAAKCAQEAv++k/TOdg5bLcBJBxl9xEqpHhwV40AT1oYG/Fpb4nAFKzxEGtXEoFhTa8hWQoo3Tsqq62cHQy3+lq8FxKJv3ElYe/WRh39XLt4IBA4EVUyfPfICAHN1SMYXQ6PW3Knq0W2ulhUZTxgU7uS/y6S6Je/UY+dk/2+743GCAeyo7jJHjfjYHQuH2pWnMIddqgw2tNMwXjSqwofC8R+RIj6G9JlK0PI72JjmH/R0p8jzQCs8J0j/Ztos5ZW8PuDDdcUhGbpoBNhYpHphuKu6bJvdU5SMc8H5WihDKF5JiR3KLNd6taAWQ7ai/KgwFZpaFnx/+fKz3r9MRGBuZpwuh4t8sawIDAQABAoIBAH8pqsoGlGlGUuqhbeqb+TJAlrsiKPTJFGQ4rf2tcHELeiDOSv+TRNe8YYLaPsUz6foJm1oCSu9IVt8AfpRFIOCJJmcDRsUhxKKEA1/q+dHqIlF+YWK+T2J4Ifz2LrB6M1wOac9u1LnxZaw/1FQhfP0fWbjO8rwoC8EWPolbZbCvH+UHmKW9zsrg25glI8NgTv6BjLaXqrj+JlkGs49V9NZ9BnDMilop4ON18hONhUrBM1bWvBelH1IJjcfCoYSdTSTQvL3Pfw+hWhH039f3co2AD/TtYUcnmbVAwdi6nNGrmCdd9JAjZkJcLv6qVZ/emT1Afo0KHOcy0PDPjQjfLsECgYEA93LstLolenNFIKJ8DUkiWHuyHbNjRFjFHNeRa7Jc3Ty+9aleruvZ60XMebvT00bgLrlEmBNPLd2vWFrtYxWL5Zhjfe3XAtWv6bN7sxPfe06L+0jlEMybuBfJdklnSynkPBV6k83Da6NTfejYIHtaKUGojhSwsNqWrTgBAHR7WakCgYEAxpGfIhvuPk725zSLneOyewGYIRfNN4B4A5Rgd4+NWJZK3ZmoEHl7WiG1K0NQDfTIl0VahFFqdrL49GodPczTgN/Y+Jh6CFzDYwd04H/RV/2iobUy1flm0hssqYZm0PFZl3ygkXP+wkO0lTM2MrR6/uFLhKvBvhJc5sCXOaMlKfMCgYBHjbUDAbzqrsBzkmi60sYavhIgYoo27lB5aaCEevw9gV5a3VIi1NKcJP/ex8CWHK2g9TPvoc3Ino0gyJJSj513k9xZQthk2nPW6W7AtuNt3aW+0TJj7DavQjmgedNjucZk1XUvnlV/H6h6BUXSBrloqrLZ+wOo8FyX1FT907EDmQJ/C6J8sILycrQtw15Qz++Hha2SPF4oqBfe8FbBUEAZCBfGSzW1o0F6+M0A0IghKLAvEK3/n8Ele88Ax1FwZS6bNfHnxKkqfVLyH9tP/dd/bKhv3wm+8MqsO6Nb+pLlc1iw5y9mOR+Szc8pxZQ6mL36dvS8eAmYUIrC5sJiGf51LwKBgQCQBEJUvmUhF33mrnlIdm/M1Rt0OEC1Z5uDgz8DhJMHRa0IGSseXLmtO+8gBzmCrKala5SKfI5mLVLYQP/7SGAsty1EdKCcsdFLMlKHoRDxgI1K5LmLboncXcATrXqYRm0Zn41H5cZzlYy6UT4nQxTS8a4WTW+G7IX+5I7z9v6RUQ==-----END CERTIFICATE-----'
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
      this.api.getBalances(address).then((info) => console.log(info));
    }

    getSuccessfulTransactions(address) {
      this.api.getTransactions(address, {excludeFailures: true, types: ["payment"]}).then((info) => info.map((i) => console.log(i.specification)));
    }

    getAllTransactions(address) {
      this.api.getTransactions(address).then((info) => console.log(info.map((s) => {
        return s.specification.destination;
      }))).catch(error => {
        console.log("Error", error);
      });
    }

    thePayment(fromAddress, toAddress, desTag, sourceTag, value){
      let payment;
      if (desTag) {
        payment = {
          "source": {
            "address": fromAddress,
            "tag": sourceTag,
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
          "address": fromAddress,
          "tag": sourceTag,
          "maxAmount": {
            "value": `${value}`,
            "currency": "XRP"
          }
        },
        "destination": {
          "address": toAddress,
          "amount": {
            "value": `${value}`,
            "currency": "XRP"
        }
      }
    };
    }
      return payment;
    }

    signAndSend(fromAddress, toAddress, secret, value, sourceTag, desTag = false) {
      let payment = this.thePayment(fromAddress, toAddress, desTag, sourceTag, value);

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
// server.connect().then(() => server.signAndSend("rs1DXnp8LiKzFWER8JrDkMA7xBxQy1KrWi", "r4QDfkUkpNSkuo4m4SnfxgDbrryrtTn883", "shm8TtYiTHiHn7FaqFjZgYQTqkFP6", 3, 1234, 1466900933));
// let address = "r9bxkP88S17EudmfbgdZsegEaaM76pHiW6";
server.connect().then(() => server.getSuccessfulTransactions("rs1DXnp8LiKzFWER8JrDkMA7xBxQy1KrWi"));
// server.connect().then(() => console.log(server.api.generateAddress()));

module.exports = Rippled;
