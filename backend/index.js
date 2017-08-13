//This is where everything begins when the server nodemon is started up. All the routes have v1 for this reason.
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { RippleAPI } = require('ripple-lib');

var app = express();

var router = require('./services/router');

mongoose.connect('mongodb://localhost:introToAuth/introToAuth');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/v1', router);

// app.use()
// app.disable('etag');

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || '127.0.0.1';

console.log('Listening on', HOST, PORT);
app.listen(PORT, HOST);

// export default api;