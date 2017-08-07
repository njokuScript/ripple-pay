# ripplePay

## Background
The future is now.  Year after year we hear stories about paper money becoming more and more obsolete.  Our currency markets have continued to follow this trend with electronic cryptocurrencies coming to rise over the past decade.  Cryptocurrencies change the way people, companies, and countries can exchange funds.

### Enter ripplePay.
The world's first Ripple XRM cryptocurrency wallet.  Ripple has disrupted the conventional banking system, and will continue to reform and change the world with ripplePay.  What's in your crypto-wallet?


ripplePay is a revolutionary mobile app that will implement the following
## Features
* Users can signup and login to their accounts
* Users are able to deposit their Ripple funds into the app where they are stored and displayed
* Users are able to withdraw their Ripple funds from the app and into their respective exchange market accounts
* Users can request Ripple funds from other wallets
* Users can receive Ripple funds from other wallets
* Users can search for other users

## WireFrames

Signup:
![alt text](https://user-images.githubusercontent.com/11024247/29013693-9b5bb4a6-7af9-11e7-9067-f14e55b4406c.png "Sign Up Page")

Login:
![alt text](https://user-images.githubusercontent.com/11024247/29013711-ab534ae0-7af9-11e7-9905-49f52c5671e9.png "Login Page")

Home:
![alt text](https://user-images.githubusercontent.com/11024247/29013765-1a1a7e44-7afa-11e7-8638-fa1f48640d00.png "Home Page")

Deposit:
![alt text](https://user-images.githubusercontent.com/11024247/29013754-04bf5272-7afa-11e7-9ab8-5aa23f6a1864.png "Deposit Page")

Withdraw:
![alt text](https://user-images.githubusercontent.com/11024247/29013762-135ba254-7afa-11e7-8cb8-573368c3a87a.png "Withdraw Page")

Request:
![alt text](https://user-images.githubusercontent.com/11024247/29013770-24d8c782-7afa-11e7-92cf-cc2169ed5b5f.png "Request Page")

Search:
![alt text](https://user-images.githubusercontent.com/11024247/29013777-34f4b75c-7afa-11e7-8ee1-256050706240.png "Search Page")

About:
![alt text](https://user-images.githubusercontent.com/11024247/29013730-d0cbaca4-7af9-11e7-9979-5321e49a804f.png "About Page")


## Product Design
* Users are guided to a Login/Signup page
* Home page displays the users information, account balance, and navigation options
* Deposit allows for users to request a monetary amount to be drawn from the users' exchange market account
* Withdraw is the inverse action that deposits users' funds into their exchange market account
* Search page has functionality to be able to search for users within application
* About page displays app details and company profile

## MVPs

  1. Proper Hosting and Database establishment

  2. New user creation and login functionality

  3. A production README, replacing this README

  4. Profile-Wallet page displaying user account information

  5. Search functionality to allow searching of other users

  6. Ability to Request Ripple funds from other users

  7. Exchanges properly display in respective accounts

  8. Sending Ripple fund capability

  9. Deposit ripples using Ripple API

  10. Withdraw ripples using Ripple API

  11. Proper CSS Styling

  12. Demo Web Page


## Implementation Timeline

  * Phase 1: Frontend & Backend User Authentication setup & Styling W10D7-W11D1 (2 Days)
    * Build out frontend authentication and link to backend
    * Stylize appropriately

  * Phase 2: Ripple API, Establishment of wallet, Depositing of funds from exchange account W11D2-W11D4 (3 Days)
    * Understanding Ripple API
    * Building out frontend & backend for storing funds
    * Test out funds between exchange account and app wallet ensuring that funds stay stored

  * Phase 3: Requesting & Dispatching of Funds W11D5-W11D6 (2 Days)
    * Algorithm for building out front & backend for requesting funds
    * Users addresses are stored and secret keys are rendered in order to send funds
    * Test out transferring of funds between two accounts

  * Phase 4: Tune-ups, Styling, and Creating Demo Web Page W11D7 (1 Day)
    * Set up github pages
    * Mock up wireframes for how the demo page will look
    * Grab nice looking GIFs
    * Stylize website


## Technology
One of the greatest challenges of this project will be to learn new technologies.

### Frontend Technology
* Javascript
* React Native
  * React flavored library made by Facebook. Allows us to create mobile apps for both iOS and Android with Javascript.
  * Styled with ReactNative flavored CSS.
* Redux
  * The Redux cycle and library is implemented to organize and architect the frontend.
* Xcode project management


### Backend Technology
* Node.js
  * Allows us to execute Javscript on the server-side.
* Express
* MongOB
* Using JSON-like documents and schema, MongoDB is a NoSQL database.

### Group Members

ripplePay is Jonathan Hamilton Chaney, Alexander Preston Milbert, & Devansh Rohit Patel.

Work will be done as one unit.

### Additional
* Coudinary File Sharing
* AWS S3 file storage for images
* Jekyll for rapidly building demo page.
* Appetize.io to display a live demo.

## Things we did this weekend
* Understood functions of app
* Understood technologies we need to use
* Established basic half-working authentication
* Solved a 182 bugs
* Coded
* Built out basic skeleton of profile page

## Bonus Implementations
* Functionality for users to convert funds into USD
* Implementing a Coinbase API to directly communicate with active cryptocurrency markets
* Deposit funds directly into user bank accounts that are linked to the app
