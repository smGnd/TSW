var socket = io.connect(window.location.hostname);

var kartyNaRece = [];
var kartyDzielnic = [];
var wybudowane = [];
var iloscKartNaRece = 0;
var iloscSztabekZlota = 0;
var indeksBudowanej = 0;
var iloscWybudowanychDzielnic = 0;
var zdobytePunkty = 0;

function dzielnica (nazwa, koszt, url){
  this.nazwa = nazwa;
  this.koszt = koszt;
  this.url = url
}

//tworzenie dzielnic
kartyDzielnic[0] = new dzielnica("Chrzcielnica", 1, '<img src="images/chrzielnica.png" alt="Chrzcielnica" />');
kartyDzielnic[1] = new dzielnica("Kościół", 3, '<img src="images/kosciol.png" alt="Kościół" />');
kartyDzielnic[2] = new dzielnica("Katedra", 5, '<img src="images/katedra.png" alt="Katedra" />');

kartyDzielnic[3] = new dzielnica("Latarnia morska", 1, '<img src="images/latarniamorska.png" alt="Latarnia morska" />');
kartyDzielnic[4] = new dzielnica("Szpital", 3, '<img src="images/szpital.png" alt="Szpital" />');
kartyDzielnic[5] = new dzielnica("Obserwatorium", 5, '<img src="images/obserwatorium.png" alt="Obserwatorium" />');

kartyDzielnic[6] = new dzielnica("Dwór", 1, '<img src="images/dwor.png" alt="Dwór" />');
kartyDzielnic[7] = new dzielnica("Pałac", 3, '<img src="images/palac.png" alt="Pałac" />');
kartyDzielnic[8] = new dzielnica("Zamek", 5, '<img src="images/zamek.png" alt="Zamek" />');

kartyDzielnic[9] = new dzielnica("Targowisko", 1, '<img src="images/targowisko.png" alt="Targowisko" />');
kartyDzielnic[10] = new dzielnica("Tawerna", 3, '<img src="images/tawerna.png" alt="Tawerna" />');
kartyDzielnic[11] = new dzielnica("Ratusz", 5, '<img src="images/ratusz.png" alt="Ratusz" />');

kartyDzielnic[12] = new dzielnica("Zbrojownia", 1, '<img src="images/zbrojownia.png" alt="Zbrojownia" />');
kartyDzielnic[13] = new dzielnica("Strażnica", 3, '<img src="images/straznica.png" alt="Strażnica" />');
kartyDzielnic[14] = new dzielnica("Forteca", 5, '<img src="images/forteca.png" alt="Forteca" />');

$(function(){
    $('#btnReady').attr('disabled', false);
    $('#btnGold').attr('disabled', false);
    $('#btnDis').attr('disabled', false);
    $('#btnBuild').attr('disabled', false);
    $('#btnNotBuild').attr('disabled', false);
    $("#btnReady").click(function(){
      socket.emit('userReady');
      $(this).attr('disabled', true);
      console.log('Jesteś gotowy do gry');
    });

  $('#btnGold').click(function(){
    dodajSztabkiZlota(2);
    socket.emit('action', 'pobranie dwóch sztuk zlota');
    $('#btnGold').attr('disabled', true);
    $('#btnDis').attr('disabled', true);
    $('#build').toggle();
    console.log('wybrałeś 2 sztuki złota');
  });
  $('#btnDis').click(function(){
    losowanieKart(2);
    socket.emit('action', 'pobranie dwóch kart dzielnic');
    $('#btnGold').attr('disabled', true);
    $('#btnDis').attr('disabled', true);
    $('#build').toggle();
    console.log('wybrałeś 2 karty dzielnic');
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
        iloscKartNaRece -=1;
        $('#districts').append(taBuduje.url);
        socket.emit('build', 'buduje');
      }
    } else {
      alert('Nie masz odpowiedniej ilości złota, tracisz kolejkę.');
      socket.emit('build', 'traci kolejkę');
    }
    socket.emit('endofround', iloscWybudowanychDzielnic);
    $('#btnBuild').attr('disabled', true);
    $('#btnNotBuild').attr('disabled', true);
    console.log('wybrałeś budowanie, wybudowałeś już ' + iloscWybudowanychDzielnic + ' dzielnic.');
  });
  $('#btnNotBuild').click(function(){
    socket.emit('build', 'nie buduje');
    socket.emit('endofround', iloscWybudowanychDzielnic);
    $('#btnBuild').attr('disabled', true);
    $('#btnNotBuild').attr('disabled', true);
    console.log('wybrałeś, żeby nie budować');
  });

});

// socke connection to server, ask for user's name with an anonmyous callback
socket.on('connect', function() {
  //call the server-side function 'adduser' and send one parameter (value of prompt)
  socket.emit('adduser', prompt("Jak się nazywasz?"));
});

socket.on('updateinfo', function(data){
  $('#gameInfo').append( data + '</br>').scrollTop(30000000);
});

socket.on('updateusers', function(usednames) {
  $('#users').text('USERS:');
  $.each(usednames, function(key, value) {
    $('#users').append('<br/>' + value);
  });
});

socket.on('startgame', function(data){
  $('#action').toggle();
  $('#howMany').toggle();
  losowanieKart(5);
  dodajSztabkiZlota(3);
});

socket.on('newround', function(){
  $('#build').toggle();
  $('#btnGold').attr('disabled', false);
  $('#btnDis').attr('disabled', false);
  $('#btnBuild').attr('disabled', false);
  $('#btnNotBuild').attr('disabled', false);
});

socket.on('endofgame', function(data){
  console.log('KONIEC GRY');
  liczPunkty();
  socket.emit('punkty', zdobytePunkty);
});

socket.on('zwyciezyl', function(data){
  socket.emit('userReady', alert(data));
});

socket.on('districtinfo', function(data){
  $('#howMany').html('Maksimum dzielnic: ' + data);
});

function losowanieKart(ilosc){
  console.log('KARTY---');
  console.log(kartyNaRece);
  for (i = iloscKartNaRece; i<iloscKartNaRece + ilosc; i++){
    nowaKarta = Math.round((Math.random()*15));
    kartyNaRece[i] = kartyDzielnic[nowaKarta];
  }
  iloscKartNaRece = kartyNaRece.length;
  console.log(iloscKartNaRece);
  drukujKartyNaRece();
  console.log('KARTY---');
  console.log(kartyNaRece);
  console.log(iloscKartNaRece);
}

function drukujKartyNaRece(){
  var tekst = "";
  for (i=0; i<kartyNaRece.length; i++){
    tekst += kartyNaRece[i].nazwa + ', koszt: ' + kartyNaRece[i].koszt + ' sztuk złota. <br/>';
  }
  $('#cardsToPlay').html(tekst);
}

function dodajSztabkiZlota(ilosc){
  iloscSztabekZlota += ilosc;
  $('#details').html('Ilość sztabek złota: ' + iloscSztabekZlota + '<br /><br />');
}

function liczPunkty(){
  for (i = 0; i<wybudowane.length; i++){
    zdobytePunkty += wybudowane[i].koszt;
  }
  console.log('ilość zdobytych punktów: ' + zdobytePunkty);
}