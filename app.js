
/*var express = require('express')
    , app = express.createServer()
    , io = require('socket.io').listen(app)
    , port = process.env.PORT || 3000;
*/

var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var usernames = {};
var usednames = [];

// listen for new web clients:
server.listen(3000, function(){
  console.log('http://localhost:3000');
});

var rooms = ['room1', 'room2'];

//app.listen(port);

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.configure(function () {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

io.sockets.on('connection', function(socket){

  socket.on('adduser', function(user){
    socket.username = user;
    usernames[user] = user;
    usednames[usednames.length] = socket.username;
    console.log('--------------------------' + user + ' joined  the game! ----------------------------');
    usernames[user] = user;

    socket.join('room1');
    socket.broadcast.to('room1').emit('updateinfo', 'SERVER', user + ' dołączył do gry!');
    socket.emit('updateusers', usednames);
    socket.broadcast.to('room1').emit('updateusers', usednames);
    console.log('SOCKET ID:                          ' + socket.id);
  });

});