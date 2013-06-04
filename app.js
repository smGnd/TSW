var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var usernames = {};
var usednames = [];
var readyUsers = 0;
var koniecKolejkiUsers = 0;
var iloscDzielnicUsera = 0;
var limitDzielnic = 5;
var punktyUserów = 0;
var zwyciezca = "";
var maxDzielnic = 0;

// listen for new web clients:
server.listen(3000, function(){
  console.log('http://localhost:3000');
});

var rooms = ['room1'];

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
    console.log('\n\n--------------------\nUżytkownik ' + user + ' dołączył do gry\nID socketa: ' + socket.id + '\n\n');
    usernames[user] = user;
    socket.join('room1');
    socket.broadcast.to('room1').emit('updateinfo', user + ' dołączył do gry!');
    socket.emit('updateusers', usednames);
    socket.broadcast.to('room1').emit('updateusers', usednames);
  });

  socket.on('userReady', function(){
    console.log('\n\n--------------------\nUżytkownik ' + socket.username + ' gotowy do gry\n\n');
    socket.broadcast.to('room1').emit('updateinfo', socket.username + ' jest gotów do gry');
    readyUsers += 1;
    if (readyUsers === usednames.length){
        console.log('\n\n--------------------\nRozpoczynamy grę\n\n');
        socket.broadcast.to('room1').emit('startgame', 'zaczynamy');
        socket.emit('startgame', 'zaczynamy');
      }
  });

  socket.on('action', function(data){
    console.log('\n\n--------------------\nUżytkownik ' + socket.username + ' wykonał akcję: ' + data + '\n\n');
    socket.broadcast.to('room1').emit('updateinfo', socket.username + ' wykonał akcję: ' + data);
    socket.emit('updateinfo', 'wykonałeś akcję: ' + data);
  });

  socket.on('build', function(data){
    console.log('\n\n--------------------\nUżytkownik ' + socket.username + data + '\n\n');
    console.log('\n\n--------------------\nWysyłam updateinfo\n\n');
    socket.broadcast.to('room1').emit('updateinfo', socket.username  + data);
    socket.emit('updateinfo', 'podjąłeś decyzję: ' + data);
  });

  socket.on('endofround', function(data){
    iloscDzielnicUsera = data;
    if (maxDzielnic < data){
      maxDzielnic = data;
      socket.broadcast.to('room1').emit('districtinfo', maxDzielnic);
      socket.emit('districtinfo', maxDzielnic);
    }
    console.log('\n\n--------------------\nUżytkownik ' + socket.username + ' zakończył kolejkę.\nMa on ' + iloscDzielnicUsera + ' dzielnic.\n\n');
    koniecKolejkiUsers +=1;
    if (koniecKolejkiUsers === readyUsers){
      if (maxDzielnic === limitDzielnic){
        console.log('\n\n--------------------\nKONIEC GRY!!!\n\n');
        socket.emit('endofgame');
      } else {
        console.log('\n\n--------------------\nNOWA KOLEJKA\n\n');
        socket.broadcast.to('room1').emit('newround');
        socket.emit('newround');
        koniecKolejkiUsers = 0;
      }
    }
  });

  socket.on('punkty', function(data){
    console.log('\n\n--------------------\nPrzyjąłem punkty od użytkownika: ' + socket.username + ', liczba punktów: ' + data + '\n\n');
    if (data > punktyUserów){
      punktyUserów = data;
      zwyciezca = socket.username;
    }
    console.log('\n\n--------------------\nZwyciężył ' + socket.username + ' zdobywając ' + data + ' punktów.\n\n')
    socket.broadcast.to('room1').emit('zwyciezyl', socket.username);
    socket.emit('zwyciezyl', 'Zwyciężył ' + socket.username + ' zdobywając ' + data + ' punktów.');
  });

  socket.on('disconnect', function () {
    for (i=0; i<usednames.length; i++){
      if (usednames[i] === socket.username){
        usednames.splice(i, 1);
      }
    }
    console.log('\n\n--------------------\n' + socket.username + 'poszedł w chuj\n\n');
    socket.emit('updateusers', usednames);
    socket.broadcast.to('room1').emit('updateusers', usednames);
    socket.broadcast.emit('updatechat', 'świzdu gwizdu, ' + socket.username + ' poszedł w pizdu');
  });

});