# ripplePay

See Live Demo Here: [https://pateldd1.github.io/ripplePay-Demo/](https://pateldd1.github.io/ripplePay-Demo/)

## Background

ripplePay is an XRP cryptocurrency mobile (iOS and Android) transferring system that allows currency conversion with over 60 other cryptocurrencies. Ripple has disrupted the conventional banking system, and will continue to reform and change the world with this user-facing application.

## Enter ripplePay.
A Robust Ripple XRP cryptocurrency mobile transferring platform.  Ripple has disrupted the conventional banking system, and will continue to reform and change the world with ripplePay.  

## Sending Ripple Cross-platform to Gatehub Wallet
<br><br>
![gatehub-bitcoin](/images/sending_demonstration.gif)

## Withdraw and Deposit in 60 different cryptocurrencies
<br><br>
![user-sending](/images/conversion_demonstration.gif)

## App Screens
<br><br>
![altcoins](/images/newest_altcoins.png)
![android_altcoins](/images/Android_tokens.png)
![all-transactions](/images/newest_transactions.png)
![android-transactions](/images/Android_transactions.png)
![userSearch](/images/newest_user_search.png)
![sending](/images/newest_banksend.png)

ripplePay is a revolutionary mobile app that implements the following

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
