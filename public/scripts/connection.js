var socket = io.connect(window.location.hostname);

var kartyNaRece = [];
var kartyDzielnic = [];
var wybudowane = [];
var iloscKartNaRece = 0;
var iloscSztabekZlota = 0;
var indeksBudowanej = 0;
var iloscWybudowanychDzielnic = 0;

function dzielnica (nazwa, koszt, kolor){
  this.nazwa = nazwa;
  this.koszt = koszt;
}

//tworzenie dzielnic
kartyDzielnic[0] = new dzielnica("Chrzcielnica", 1);
kartyDzielnic[1] = new dzielnica("Kościół", 3);
kartyDzielnic[2] = new dzielnica("Katedra", 5);

kartyDzielnic[3] = new dzielnica("Latarnia morska", 1);
kartyDzielnic[4] = new dzielnica("Szpital", 3);
kartyDzielnic[5] = new dzielnica("Obserwatorium", 5);

kartyDzielnic[6] = new dzielnica("Dwór", 1);
kartyDzielnic[7] = new dzielnica("Pałac", 3);
kartyDzielnic[8] = new dzielnica("Zamek", 5);

kartyDzielnic[9] = new dzielnica("Targowisko", 1);
kartyDzielnic[10] = new dzielnica("Tawerna", 3);
kartyDzielnic[11] = new dzielnica("Ratusz", 5);

kartyDzielnic[12] = new dzielnica("Zbrojownia", 1);
kartyDzielnic[13] = new dzielnica("Strażnica", 3);
kartyDzielnic[14] = new dzielnica("Forteca", 5);


$(function(){
    $('#btnReady').attr('disabled', false);
    $('#btnGold').attr('disabled', false);
    $('#btnDis').attr('disabled', false);
    $('#btnBuild').attr('disabled', false);
    $('#btnNotBuild').attr('disabled', false);
    $("#btnReady").click(function(){
      socket.emit('userReady');
      $(this).attr('disabled', true);
    });

  $('#btnGold').click(function(){
    dodajSztabkiZlota(2);
    socket.emit('action', 'pobranie dwóch sztuk zlota');
    $('#btnGold').attr('disabled', true);
    $('#btnDis').attr('disabled', true);
    $('#build').toggle();
  });
  $('#btnDis').click(function(){
    losowanieKart(2);
    socket.emit('action', 'pobranie dwóch kart dzielnic');
    $('#btnGold').attr('disabled', true);
    $('#btnDis').attr('disabled', true);
    $('#build').toggle();
  });

  $('#btnBuild').click(function(){
    var taBuduje;
    doZbudowania = prompt('Jaką dzielnicę chcesz wybudować?');
    for(i=0; i<kartyNaRece.length; i++){
      if (doZbudowania === kartyNaRece[i].nazwa){
        taBuduje = kartyNaRece[i];
        indeksBudowanej = i;
        break;
      }
    }
    if (taBuduje){
      if(iloscSztabekZlota < taBuduje.koszt){
          alert('Nie masz odpowiedniej ilości złota, tracisz kolejkę.');
          socket.emit('build', 'traci kolejkę');
      } else {
        kosztBudowy = 0-taBuduje.koszt;
        dodajSztabkiZlota(kosztBudowy);
        kartyNaRece.splice(indeksBudowanej, 1);
        drukujKartyNaRece();
        wybudowane[iloscWybudowanychDzielnic] = taBuduje;
        iloscWybudowanychDzielnic += 1;
        $('#bld1').append(taBuduje.nazwa);
        socket.emit('build', 'buduje');
      }
    } else {
      alert('Nie masz odpowiedniej ilości złota, tracisz kolejkę.');
      socket.emit('build', 'traci kolejkę');
    }
    socket.emit('endofround');
    $('#btnBuild').attr('disabled', true);
    $('#btnNotBuild').attr('disabled', true);
  });
  $('#btnNotBuild').click(function(){
    socket.emit('build', 'nie buduje');
    socket.emit('endofround');
    $('#btnBuild').attr('disabled', true);
    $('#btnNotBuild').attr('disabled', true);
  });

});

// socke connection to server, ask for user's name with an anonmyous callback
socket.on('connect', function() {
  //call the server-side function 'adduser' and send one parameter (value of prompt)
  socket.emit('adduser', prompt("Jak się nazywasz?"));
});

socket.on('updateinfo', function(data){
  $('#gameInfo').append( data + '</br>');
});

socket.on('updateusers', function(usednames) {
  $('#users').text('USERS:');
  $.each(usednames, function(key, value) {
      $('#users').append('<br/>' + value);
      });
});

socket.on('startgame', function(data){
  $('#action').toggle();
  losowanieKart(5);
  dodajSztabkiZlota(1);
});

socket.on('newround', function(){
  $('#build').toggle();
  $('#btnGold').attr('disabled', false);
  $('#btnDis').attr('disabled', false);
  $('#btnBuild').attr('disabled', false);
  $('#btnNotBuild').attr('disabled', false);
});

function losowanieKart(ilosc){
  for (i = iloscKartNaRece; i<ilosc; i++){
    nowaKarta = Math.round((Math.random()*15));
    kartyNaRece[i] = kartyDzielnic[nowaKarta];
  }
  console.log(kartyNaRece);
  drukujKartyNaRece();
}

/*function dodrukujKarty(nowekarty){
  for (i=0; i<nowekarty; i++){
    tekst = kartyNaRece[i].nazwa + ', koszt: ' + kartyNaRece[i].koszt + ' złota.<br/>';
    $('#cardsToPlay').append(tekst);
  }
}*/

function drukujKartyNaRece(){
  var tekst = "";
  for (i=0; i<kartyNaRece.length; i++){
    tekst += kartyNaRece[i].nazwa + ', koszt: ' + kartyNaRece[i].koszt + ' sztuk złota. <br/>';
  }
  $('#cardsToPlay').html(tekst);
}

function dodajSztabkiZlota(ilosc){
  iloscSztabekZlota += ilosc;
  $('#details').text('Ilość sztabek złota: ' + iloscSztabekZlota);
}