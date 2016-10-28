var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
// TODO: What is this?

// Beginning arbitrage
var arbitrage = require("./js/algorithms/simple-arbitrage.js");
arbitrage("BTCUSD", 1000);
//arbitrage("ETHBTC", 1000);

// Created to start and stop the liveFeed of a exchange
var liveFeed;

// Handling the connection to the client through socket.io
io.sockets.on('connection', function (socket) {

  socket.on('openExchange', function(data){
    // Creating a live feed to the client of the data requested
    liveFeed = setInterval(function() {
      var date = new Date();
      socket.emit('message', {message: [date.getTime(), mapParse(allExchangeData[data.data], data.data)]})
    }, 1000)
  });
  socket.on('closeExchange', function(data){
    // Closing the current data output
    clearInterval(liveFeed);
  });
});

// Rendering index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/html/index.html');
});

// Rendering dashboard.html
app.get('/dashboard', function (req, res) {
  res.sendfile(__dirname + '/html/dashboard.html');
});

app.use('/js', express.static('js'));

// Creating Express server
server.listen(3000);