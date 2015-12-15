//Load dependencies
var compression = require('compression');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
var cookieParser = require('cookie-parser');
var classifier= require('./config/classify.js')
var urlToImage = require('url-to-image');

// Initialize server
var port = process.env.PORT || 3000;
var app = module.exports= express();
var routes = require('./router.js');

// classifier.trainClassifier();
app.use(compression());
app.use(express.static(__dirname + '../../app/dist'));

app.listen(port);
console.log('Clippr server is now running at ' + port);