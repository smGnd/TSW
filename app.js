var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var usernames = {};
var usednames = [];
var readyUsers = 0;
var wybudowaneDzielnice = 0;

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
    console.log('Użytkownik ' + user + ' dołączył do gry\nID socketa: ' + socket.id);
    usernames[user] = user;

    socket.join('room1');
    socket.broadcast.to('room1').emit('updateinfo', 'SERVER', user + ' dołączył do gry!');
    socket.emit('updateusers', usednames);
    socket.broadcast.to('room1').emit('updateusers', usednames);
    console.log('SOCKET ID:                          ' + socket.id);
  });

  socket.on('userReady', function(){
    console.log('Użytkownik ' + socket.username + ' gotowy do gry');
    socket.broadcast.to('room1').emit('updateinfo', 'SERVER', socket.username + ' jest gotów do gry');
    readyUsers += 1;
    if (readyUsers === usednames.length){
        console.log('Rozpoczynamy grę');
        socket.broadcast.to('room1').emit('startgame', 'zaczynamy');
        socket.emit('startgame', 'zaczynamy');
        graj();
      }
  });

});

function graj(){
  while(liczbadzielnic < 8){
    ustalKolejnosc();
    for (var i=0; i<graja.length; i++){
      wywolajGracza(i);
    }
  }
  liczPunkty();
  dajZwyciezce();
}

function ustalKolejnosc(){
  /*
  numerJeden = math.random() * 10 % liczba graczy
  graja[0] = usednames[numerJeden];
  socket.emit (zaczyna usednames[numerJeden]);
  */
}

function wywolajGracza(numer){

}

function liczPunkty(){

}

function dajZwyciezce(){

}