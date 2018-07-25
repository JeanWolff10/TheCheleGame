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

// setInterval(heartbeat, 5000);
// function heartbeat() {
//   if (demarrable) {
//     if (nb_connection>0) {
//       start = nb_connection == nb_prets;
//       if (start) {
//         console.log('start');
//         demarrable = false;
//         demarreur(nb_prets);
//         io.sockets.emit('demarreur', data_demarrer);
//         io.sockets.emit('demarrer', start);
//         io.sockets.emit('pseudonymes_retour', pseudonymes);
//       }
//     }
//   }
// }

var joueurs=[];
var partie_en_cours=false;

io.sockets.on('connection', // évènement : nouvelle connexion

  function(socket) {

    // CONNEXION
    console.log('nouveau client' + socket.id);
    if (partie_en_cours == true) {
      var statut='en_attente';
    }
    else {
      var statut='pas_pret';
    }
    joueurs.push(new joueur(socket.id, statut));
    io.sockets.emit('liste_joueurs', joueurs);

    // DECONNEXION
    socket.on('disconnect', function(){
      for (var i = 0; i < joueurs.length; i++) {
        if (joueurs[i].id == socket.id) {
          temporaire = joueurs.splice(0, i);
          temporaire.push(joueurs.splice(i, joueurs.length));
          joueurs = temporaire;
        }
      }
      if (partie_en_cours == false) {
        var nombre_joueurs_connectes=joueurs.length;
        var nombre_joueurs_prets=0;
        for (var i = 0; i < joueurs.length; i++) {
          if (joueurs[i].statut === 'pret') {
            nombre_joueurs_prets+=1;
          }
        }
        if (nombre_joueurs_prets>1 && nombre_joueurs_prets == nombre_joueurs_connectes) {
          lancementPartie();
          partie_en_cours=true;
        }
      }
      console.log('user disconnected' + socket.id);
    });

    // PRET
    socket.on('pret',
      function() {
        if (partie_en_cours==false) {
          for (var i = 0; i < joueurs.length; i++) {
            if (joueurs[i].id == socket.id) {
              if (joueurs[i].statut==='pas_pret') {
                console.log('pret' + '  ' + socket.id);
                joueurs[i].statut = 'pret';

                var nombre_joueurs_connectes=joueurs.length;
                var nombre_joueurs_prets=0;
                for (var i = 0; i < joueurs.length; i++) {
                  if (joueurs[i].statut === 'pret') {
                    nombre_joueurs_prets+=1;
                  }
                }
                if (nombre_joueurs_prets == 1) {
                  console.log('attente que les autres joueurs appuient sur entrée');
                }
                else if (1 < nombre_joueurs_prets && nombre_joueurs_prets<nombre_joueurs_connectes) {
                  console.log('il reste x secondes aux joueurs connectés pour appuyer sur entrée --> partie demarre');
                }
                else if (nombre_joueurs_prets = nombre_joueurs_connectes) {
                  lancementPartie(joueurs);
                  partie_en_cours=true;
                }
              }
            }
          }
        }
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
        for (var i = 0; i < joueurs.length; i++) {
          joueurs[i].statut='pas_pret';
        }
      })

    // TRANSFERT DES COORDONNEES
    socket.on('coordonnees',
      function(data) {
        io.sockets.emit('coordonnees_retour', data);
      })

    // SCORE
    socket.on('score',
      function(data) {
        io.sockets.emit('score_retour', data);
      })

    // PSEUDONYMES
    socket.on('pseudonyme_aller',
      function(data) {
        for (var i = 0; i < joueurs.length; i++) {
          if (joueurs[i].id == socket.id) {
            joueurs[i].pseudonyme = data;
          }
        }
        io.sockets.emit('liste_joueurs', joueurs);
      })




    //     // socket.broadcast.emit('mouse', data); envoie message aux clients excepté l'émetteur initial
    //     // io.sockets.emit('mouse', data); renvoie le msg à tous les clients :
  })

function joueur(socket_id, statut) {
  this.id = socket_id;
  this.pseudonyme = 'monPseudonyme';
  this.score = 0;
  this.statut = statut;
  // statuts : pas_pret, pret, dans_la_partie, en_attente
}

function lancementPartie() {
    for (var i = 0; i <joueurs.length; i++) {
      if (joueurs[i].statut === 'pret') {
        joueurs[i].statut='dans_la_partie';
      }
      else {
        joueurs[i].statut='en_attente';
      }
      io.sockets.emit('lancementPartie', joueurs);
    }
}
