var socket = io.connect(window.location.hostname);

$(function(){
    $('#btnReady').attr('disabled', false);
    $("#btnReady").click(function(){
      socket.emit('userReady');
      $(this).attr('disabled', true);
    });
    socket.on('play'){
      $('#action').toggle();
    }
});

// on connection to server, ask for user's name with an anonmyous callback
socket.on('connect', function() {
  //call the server-side function 'adduser' and send one parameter (value of prompt)
  socket.emit('adduser', prompt("Jak się nazywasz?"));
});

socket.on('updateinfo', function(username, data){
  $('#gameInfo').append( data + '</br>');
});

socket.on('updateusers', function(usednames) {
  $('#users').text('USERS:');
  $.each(usednames, function(key, value) {
      $('#users').append('<br/>' + value);
      });
});

socket.on('startgame', function(data){
  alert(data);
});