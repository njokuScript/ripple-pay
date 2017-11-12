//This is where everything begins when the server nodemon is started up. All the routes have v1 for this reason.
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var app = express();

var router = require('./services/router');
var redis = require("redis");
let bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
client = redis.createClient();
client.on("error", function (err) {
  console.log("Error " + err);
});
global.RedisCache = client;

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

if (process.env.NODE_ENV=='production') {
  mongoose.connect(process.env.MONGO_URL);
} else {
  mongoose.connect('mongodb://localhost:introToAuth/introToAuth');
}

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/v1', router);
// Disabling etag will mess up caching mechanisms
// app.disable('etag');

var PORT = process.env.PORT || 3000;

console.log('Listening on', PORT);
app.listen(PORT);
