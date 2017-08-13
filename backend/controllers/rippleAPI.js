// API to interact with Rippled Server

class Rippled {
  constructor(){
    const { RippleAPI } = require('ripple-lib');
      this.api = new RippleAPI({
        server: 'wss://s2.ripple.com' // Public rippled server hosted by Ripple, Inc.
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

    getBalances(address) {
      this.api.getBalances(address).then((info) => console.log(info));
    }

    getSuccessfulTransactions(address) {
      this.api.getTransactions(address, {excludeFailures: true, types: ["payment"]}).then((info) => console.log(info).catch(error => {
        console.log("Error", error);
      }));
    }

    getAllTransactions(address) {
      this.api.getTransactions(address).then((info) => console.log(info)).catch(error => {
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
      this.api.getTransactions(address).then((info) => console.log(info[idx].outcome.balanceChanges[address][idx].value)).catch(error => {
        console.log("Error", error);
      });
    }

    connect(){
      return this.api.connect();
    }
}

let server = new Rippled();
// server.connect().then(() => server.signAndSend("r9bxkP88S17EudmfbgdZsegEaaM76pHiW6","rPxkAQQB65foPBg2Y84xyEHCieXv5qCjTY","ss9N6t4MSiHi269VNv5G9QVhY51RA",20));
// let address = "r9bxkP88S17EudmfbgdZsegEaaM76pHiW6";
server.connect().then(() => server.getBalances("raa6pjF59F5DrFLcpbTVskjSVGnbWTYMXL"));




// module.exports = (address) => {

  // const api = new RippleAPI({
  //   server: 'wss://s2.ripple.com' // Public rippled server hosted by Ripple, Inc.
  // });
  // api.on('error', (errorCode, errorMessage) => {
  //   console.log(errorCode + ': ' + errorMessage);
  // });
  // api.on('connected', () => {
  //   console.log('connected');
  // });
  // api.on('disconnected', (code) => {
  //   // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
  //   // will be 1000 if this was normal closure
  //   console.log('disconnected, code:', code);
  // });

  // const payment = {
  //   "source": {
  //     "address": "r9bxkP88S17EudmfbgdZsegEaaM76pHiW6",
  //     "maxAmount": {
  //       "value": "20",
  //       "currency": "XRP"
  //     }
  //   },
  //   "destination": {
  //     "address": "raa6pjF59F5DrFLcpbTVskjSVGnbWTYMXL",
  //     // "tag": 3838319982,
  //     "amount": {
  //       "value": "20",
  //       "currency": "XRP"
  //     }
  //   }
  // };

  // const address = 'r9bxkP88S17EudmfbgdZsegEaaM76pHiW6';
  // const order = {
  //   "direction": "buy",
  //   "quantity": {
  //     "currency": "USD",
  //     "counterparty": "rLHzPsX6oXkzU2qL12kHCH8G8cnZv1rBJh",
  //     "value": "10.1"
  //   },
  //   "totalPrice": {
  //     "currency": "XRP",
  //     "value": "10"
  //   },
  //   "passive": true,
  //   "fillOrKill": true
  // };

  // let myAddress = 'r9bxkP88S17EudmfbgdZsegEaaM76pHiW6';

  // //use one or the other
  // // api.connect(address).then(() => {
  // api.connect(address).then(() => {

    // for (let i = 0; i< 10; i++) {
    //   console.log(api.generateAddress());
    // }

    // api.getBalances(myAddress).then((info) => console.log(info))
    // api.getOrders("rs1DXnp8LiKzFWER8JrDkMA7xBxQy1KrWi").then((info) => console.log(info))

    //The following will get the balance change per each transaction.
    // api.getTransactions(myAddress).then((info) => console.log(info[1].outcome.balanceChanges[myAddress][0].value)).catch(error => {
    //               console.log("Error", error);
    //       });

    //Do this to get the other party having to do with this transaction
    // api.getTransactions(myAddress).then((info) => {
    //   Object.keys(info[0].outcome.balanceChanges).forEach((addr) => {
    //     if ( myAddress !== addr )
    //     {
    //       console.log(addr)
    //       return
    //     }
    //   })
    // }).catch(error => {
    //               console.log("Error", error);
    //       })

    //Do this to get the destination tag.
    // api.getTransactions(myAddress).then((info) => console.log(info[0].specification.destination.tag)).catch(error => {
    //     console.log("Error", error);
    // })

    //Do this to get the Transaction Id.
    // api.getTransactions(myAddress).then((info) => console.log(info[0].id)).catch(error => {
    //     console.log("Error", error);
    // })

    //Do this to get only the transactions that were successful
    // api.getTransactions(myAddress, {excludeFailures: true, types: ["payment"]}).then((info) => console.log(info).catch(error => {
    //     console.log("Error", error);
    // }))

    //Do this to get Account Info
    // api.getAccountInfo(myAddress).then((info) => console.log(info).catch(error => {
    //     console.log("Error", error);
    // }))

    //Do this ot ge the transaction fee.
    // api.getFee().then((info) => console.log(info).catch(error => {
    //     console.log("Error", error);
    // }))



    //Do this to prepare a payment and send a payment outside of our app -- we're doing this later.

    //   api.preparePayment("r9bxkP88S17EudmfbgdZsegEaaM76pHiW6", payment).then((orderinfo) => {
    //     let jstring = api.sign(orderinfo.txJSON, 'ss9N6t4MSiHi269VNv5G9QVhY51RA');
    //     let signedTransact = jstring.signedTransaction;
    //     api.submit(signedTransact).then((result)=> console.log(result))
    // });
  // });

  // .then(() => {
  //   return api.disconnect();
  // }).catch(console.error);
// };
// console.log(api.isConnected());