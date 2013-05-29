var express = require('express')
	, util = require('util')
    , app = express.createServer()
    , io = require('socket.io')
    , port = process.env.PORT || 3000;

var usernames = {};
var usednames = [];

function postac(numer, nazwa, url_karty){
	this.numer = numer;
	this.nazwa = nazwa;
	this.url_karty = url_karty;
}

app.listen(port, function(){
	console.log("Server started at http://localhost:3000");
});

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
      app.use(app.router);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/zasady', function(req, res){
	res.sendfile(__dirname + '/zasady.html');
});

io.configure(function () {
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 10);
});

io.sockets.on('connection', function(socket){
	socket.on('adduser', function(username){
		if(usednames.indexOf(username) != -1){
			socket.emit('alert', 'Imie zajęte');
		} else {
			socket.username = username;
			usernames[username] = username;
			usednames[usednames.length] = socket.username;
			socket.join('lobby');
			socket.emit('updatechat', 'SERVER', 'You have joined ' + socket.room);
			socket.broadcast.to('lobby').emit('updatechat', 'SERVER', username + ' has connected to Lobby.');
			countPlayers();
			io.sockets.emit('updaterooms', rooms, playersinroom);
			io.sockets.emit('updateusers', usednames);
			clientsid[username] = socket.id;
    		console.log(clientsid);
		}
	});
	socket.on('sendchat', function(data){
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
});