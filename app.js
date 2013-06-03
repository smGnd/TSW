var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var usernames = {};
var usednames = [];
var readyUsers = 0;
var koniecKolejkiUsers = 0;
var wybudowaneDzielnice = 0;

// listen for new web clients:
server.listen(16777, function(){
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
    socket.broadcast.to('room1').emit('updateinfo', user + ' dołączył do gry!');
    socket.emit('updateusers', usednames);
    socket.broadcast.to('room1').emit('updateusers', usednames);
  });

  socket.on('userReady', function(){
    console.log('Użytkownik ' + socket.username + ' gotowy do gry');
    socket.broadcast.to('room1').emit('updateinfo', socket.username + ' jest gotów do gry');
    readyUsers += 1;
    if (readyUsers === usednames.length){
        console.log('Rozpoczynamy grę');
        socket.broadcast.to('room1').emit('startgame', 'zaczynamy');
        socket.emit('startgame', 'zaczynamy');
        socket.broadcast.to('room1').emit('districtinfo', wybudowaneDzielnice);
        socket.emit('districtinfo', wybudowaneDzielnice);
        //graj();
      }
  });

  socket.on('action', function(data){
    console.log('Użytkownik ' + socket.username + ' wykonał akcję.');
    socket.broadcast.to('room1').emit('updateinfo', socket.username + ' wykonał akcję: ' + data);
    socket.emit('updateinfo', 'wykonałeś akcję: ' + data);
  });

  socket.on('build', function(data){
    console.log('Użytkownik ' + socket.username + 'podjął decyzję o budowaniu.');
    wybudowaneDzielnice += 1;
    socket.broadcast.to('room1').emit('updateinfo', socket.username  + data);
    socket.emit('updateinfo', 'podjąłeś decyzję: ' + data);
  });

  socket.on('endofround', function(){
    koniecKolejkiUsers +=1;
    if (koniecKolejkiUsers === readyUsers){
      socket.broadcast.to('room1').emit('newround');
      socket.emit('newround');
      koniecKolejkiUsers = 0;
    }
  });

});


/*
function graj(){
  while(liczbadzielnic < 8){
    ustalKolejnosc();
    for (var i=0; i<graja.length; i++){
      wywolajGracza(i);
    }
  }
  socket.emit('koniecgry');
  socket.on('punkty');
  liczPunktyDajZwyciezce();
}

function ustalKolejnosc(){
  /*
  numerJeden = math.random() * 10 % liczba graczy
  graja[0] = usednames[numerJeden];
  for(i=1, i<usednames.length, i++){
    graja[i] = usednames[numerJeden+i];
    j = i
  }
  for (i = j, i<usednames.length, i++){
    graja[i] = usednames[numerJeden-i];
  }
  */
//}

//function wywolajGracza(numer){
  /*
  socket emit(play);
  */
//}

//function liczPunktyDajZwyciezce(){
  /*
  for (i=0, i<usednames.length, i++){
   sortowanie kto ma najwięcej punktów
   zapisanie do tablicy pod indeksem 0
  }
  emit (wynik[0])
  */
//}
