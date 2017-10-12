# ripplePay

See Live Demo Here: [https://pateldd1.github.io/ripplePay-Demo/](https://pateldd1.github.io/ripplePay-Demo/)

## Background

ripplePay is an XRP cryptocurrency payment mobile (iOS and Android) app that allows currency conversion with over 60 other cryptocurrencies.

## Sending Ripple Cross-platform to Gatehub Wallet
<br><br>
![gatehub-bitcoin](/images/ripplesending.gif)

## Withdraw and Deposit in 60 different cryptocurrencies
<br><br>
![user-sending](/images/conversions.gif)

## App Screens (iOS and Android)
<br><br>
![altcoins](/images/newest_altcoins.png)
![android_altcoins](/images/Android_tokens.png)
![all-transactions](/images/newest_transactions.png)
![android-transactions](/images/Android_transactions.png)
![userSearch](/images/newest_user_search.png)
![sending](/images/newest_banksend.png)

## Features
* Users can signup and login to their accounts
* Users can see their incoming and outgoing ripple transactions and their balance
* Users can receive Ripple funds from other wallets
* Users can send Ripple funds to other wallets with a 0.02 XRP fee, using the Ripple API
* Users can deposit 60 other cryptocurrencies to ripple and also withdraw as any of these 60 using Shapeshift API(fees apply)
* Users can search for other users
* Users can send to other users for FREE

-in development

## Product Design
* Users are guided to a Login/Signup page
* Home page displays the users transactions and balance
* Search page has functionality to be able to search for users within application
* Following clicking on a user, another page allows sending to this user (for free)
* Exchange page allows sending and receiving in ripple + other cryptocurrencies
* On clicking Ripple, user's can send Ripple to another Ripple Address and receive info on the success of their transaction
* On conversion page, user's can see currency conversions
* After conversions page, users can opt to send or receive a quoted rate based on Shapeshift API or they can opt to send or receive an arbitrary non-quoted amount.
* If quoted, the user has 10 minutes to exchange currencies at that rate after which the user will be redirected to the home page.
* Once they send, their Ripple will be converted to the other currency and received on the receiving end as that currency
* They can also use the Shapeshift Deliver Address to send to and that will be received as Ripple into their ripplePay wallet

# Detailed Implementation
## Ripple Protocol
* 10 Ripple Addresses currently operate as operational addresses or 'hot wallets' and 1 Ripple Address acts as the Issuing Address or 'cold wallet'.
* Hot wallets are used the most and have a lower amount of money in them than the cold wallet which functions as the centralized bank.
* The spread of money amongst multiple addresses and the usage of multiple secret keys reduces the risk of losing a large chunk of money all at once. A hacker would have to hack into all of these addresses to steal all of the money.
* As the cold wallet is the most important, it makes as few transactions as possible and uses its secret key to sign transactions the least. This limits the number of times the secret key is vulnerable. Even though ripplePay turns off the Rippled server when signing transactions, this is an extra measure of security.
### User money storage on hot wallet
* A user's money is stored on a hot wallet and user's a given an address with a maximum of 5 destination tags. In this way they have '5 wallets' max when in all reality they don't have a personal wallet or access to secret keys. They do not have to keep their secret key, worry about losing it, or anything. Their money is stored with ripplePay. RipplePay has the secret keys.
* Benefits: Users can send money to each other Free of Charge. ripplePay simply changes their balances in the database.
### How a transaction is made through Ripple
* If a user wants to send to a non-user, they would need the other user's address and maybe their destination tag if they have one. I.E. Kraken also uses destination tags so they would need a DT there.
* When a transaction is made, a new node is added to the Ripple Ledger, which is a blockchain. This node stores the address, the destination tag, the source tag, and the transaction ID. When a user sends money, the Ripple Ledger stores their destination tag as source tag and when they receive, it is stored as a destination tag
### How ripplePay gets a user's transactions and balance
* Using the getTransactions(address) call through the Ripple API, ripplePay can get all of the transactions belonging to a particular address on the ledger, i.e. one of ripplePay operational addresses
* By storing a user's last transaction ID, their cash Register aka their operational address, and their destination tags, ripplePay iterates through the array returned by Ripple API and finds a user's transactions by source tags or destination tags that match the user's. The iteration stops at the last transaction ID and incorporates the matched transactions into the database entry for that user's transactions, changing the balance as well. It also stores the first match as the new 'last transaction ID' database entry for the user.
* This way, only the necessary transactions are incorporated into calcululating the user's balance. This optimizes time and efficiency as well since all the of the transactions from the getTransactions(address) call for the user don't have to be traversed.
* Async.mapseries function is used in the Node.js backend iteration because Node.js is single threaded and this iteration through transactions could be 'blocking' if placed in a normal 'for loop'.
### Wallet Generation
* When a user requests a new wallet they are given a destination tag, which is a base-32 number. If the user does not have a hot wallet register to him/her, then a node.js controller function will generate that wallet for the user.
* Hot wallet generation for the user is a meticulous process. ripplePay will calculate the hot wallet within all of its hot wallets that has the median balance based on all of the hot wallets. This is done because the user could use this hot wallet for sending OR receiving money and giving the user a hot wallet with the median balance will minimize hot wallet refilling.
### Hot Wallet Refilling
* If a user requests to send money from the hot wallet that he/she is assigned to and the user has enough balance to make the transaction but the hot wallet does not have enough balance, ripplePay will have to refill this hot wallet by using the cold wallet (issuing address).
* Wallet refilling is the only cost incurred to ripplePay directly and because the user is requesting to send money and must pay ripplePay a small fee of 0.02 XRP to make the transaction, ripplePay will incur no cost after wallet refilling. Wallet refilling only occurs when a user make a request to send money and is willing to pay a fee.
## Shapeshift API
* Using the Shapeshift API, ripplePay is able to take a user's XRP and convert it to 60 other cryptocurrencies or vice versa.
* To withdraw BTC for instance, a user only needs the send address and the amount of XRP they want to send. Shapeshift will calculate the rest, stating how much Bitcoin the send address will receive and how much the fee incurred by the user through Shapeshift will be. If the user decided he is ok with this transaction, he can just press 'Withdraw' and poof, ripplePay handles the middleman work.
* ripplePay will send the user's XRP from their ripple wallet to one of Shapeshift's intermediary ripple addresses. Shapeshift also gives a destination tag to use for ripplePay to send to. After a certain amount of time that Shapeshift requires to validate and send the Bitcoin to the send address, the user will have sent Bitcoin to the send address by incurring costs in XRP through ripplePay.
* The user does not have to worry about copy and pasting the Shapeshift address and destination tag and sending to that address to start the conversion because ripplePay handles all of that internally.
* To receive Bitcoin, Shapeshift will give the user one of their Bitcoin addresses to send to and because ripplePay has linked the user's wallet to this transaction, the user will receive Ripple when they send Bitcoin or any other cryptocurrency into the app. This will show up in their balance.

## Current Security Features
* Passwords are never stored, instead a hashed password is stored with bcrypt
* Logging off of the Ripple API server every time a transaction is signed through ripple API, thus secret keys are never transmitted
* Session Timeout after 10 minutes of inactivity
* Addresses and secret keys are on a remote computer
* Secret Keys are stored in the database using Bcrypt and then compared every time a transaction is made

## Security Features to be implemented
* Private Rippled Server
* Making sure that users are on the correct domain to use RipplePay
* Limited time for a person's address (cash Register) and destination Tag
* Multi Signing on transactions so multiple secret keys are require to make one transaction

### Frontend Technology
* Javascript
* React Native
  * React flavored library made by Facebook. Allows us to create mobile apps for both iOS and Android with Javascript
  * Styled with ReactNative flavored CSS
* Redux
  * The Redux cycle and library is implemented to organize and architect the frontend
* Xcode project management


### Backend Technology
* Node.js
  * Allows us to execute Javscript and use Ripple API on the server-side
* Express
* MongoDB with database migrated to Amazon Web Services.
* Using JSON-like documents and schema, MongoDB is a NoSQL database

### Group Members
* Dev Patel (backend Node.js and MongoDB, Ripple API, Shapeshift API, coordinating backend and frontend viewing of info with React Native)

* Jonathan Hamilton Chaney (frontend, UI/UX, AWS, Rippled Server, IT)

* Alexander Preston Milbert (frontend, UI/UX, Business Planning, capital and investments)


## The Future of ripplePay
* Improved UI/UX design
* QR Codes to allow for users to easily send and receive from addresses
* Number Pad for the sending and receiving of money
* Shapeshift Transactions Page allowing users to see the result of their shapeshift transaction and whether or not they need to contact Shapeshift to get a refund
* Business Plan related to fees
* AWS Strategy to allow scalability of the app in case of increased server load
* Rippled Server
* Multisigning of transactions through ripple's API
* Probably: Allow user's to link their bank account to store USD using the Gatehub ripple USD address
* Secret Phrase that is used to unlock account
* Increased Security Features
* Seek funding and investment
* Deployment to Iphone app store and Google Play for Android
* Reliable Transactions implementation from Ripple website
* Database Sharding
* Addition of Firewall using AWS Services
* Ask for PIN numbers before making transactions
