// var http = require('http');
//
// http.createServer(function(req, res){
//     res.writeHead(200, {'content-type': 'text/plain'});
//     res.end('It works');
// }).listen(3000, '0.0.0.0', function() {




console.log('my socket server is running');
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
//var socket = require('socket.io');
//var io = socket(server);
var io = require('socket.io')(server);

setInterval(heartbeat, 5000);
function heartbeat() {
  if (demarrable) {
    if (nb_connection>0) {
      start = nb_connection == nb_prets;
      if (start) {
        demarrable = false;
        demarreur(nb_prets);
        io.sockets.emit('demarreur', data_demarrer);
        io.sockets.emit('demarrer', start);
      }
    }
  }
}

var start = false;
var nb_connection = 0;
var nb_prets = 0;
var data_demarrer = [];
var demarrable = true;
var identifiants = [];

io.sockets.on('connection', // évènement : nouvelle connexion

  function(socket) {
    console.log('nouveau client' + socket.id);
    nb_connection += 1;
    console.log('new connec' + nb_connection);
    identifiants.push(socket.id);

    socket.on('pret',
      function() {
        nb_prets += 1;
        console.log(nb_prets + ' ' + nb_connection);
      })

    // ORDRES DE DEPLACEMENTS
    socket.on('move_left',
      function(data) {
        data = {id: socket.id, move: 'left' };
        io.sockets.emit('move', data);
      })
    socket.on('move_right',
      function(data) {
        data = {id: socket.id, move: 'right' };
        io.sockets.emit('move', data);
      })
    socket.on('move_up',
      function(data) {
        data = {id: socket.id, move: 'up' };
        io.sockets.emit('move', data);
      })

    // FIN DE PARTIE
    socket.on('fin',
      function() {
        start = false;
        nb_prets = 0;
        data_demarrer = [];
        demarrable = true;
        io.sockets.emit('cestfini', true);
      })

    //     //socket.broadcast.emit('mouse', data); // envoie message aux clients excepté l'émetteur initial
    //     // alternativa à la ligne ci-dessus qui renvoie le msg à tous les clients :
    //     //io.sockets.emit('mouse', data);
  })

// io.sockets.on('disconnect',
//   function() {
//     console.log('déconnexion' + socket.id);
//     nb_connection += -1;
//     for (var i = 0; i < identifiants.length; i++) {
//       if (identifiants[i] == socket.id) {
//         temporaire = identifiants.splice(0, i);
//         temporaire.push(identifiants.splice(1, identifiants.length));
//         identifiants = temporaire;
//       }
//     }
//   });


function demarreur(int) {
  for (var i = 0; i < int; i++) {
    data_demarrer.push([identifiants[i],100+75*i,100]);    // i  à remplacer par socket.id
  }
}
// });
