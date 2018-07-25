function traitement_par_client_1() {
  // UPDATE BALLES
  Engine.update(engine);

  for (var i = 0; i < circles.length; i++) {
    circles[i].update();
  }

  // ENVOIE COORDONNEES BALLES POUR AFFICHAGE CHEZ TOUS
  var coordonnees = [];
  for (var i=0 ; i<circles.length ; i++){
    coordonnees.push([circles[i].body.position.x, circles[i].body.position.y, circles[i].r, circles[i].couleur]);
  }
  socket.emit('coordonnees',coordonnees);

  // PASSAGE PAR LES BORDS
  for (var i=0 ; i<circles.length ; i++){
    if (circles[i].body.position.x < -circles[i].r) {
      Matter.Body.setPosition(circles[i].body, { x: width - circles[i].r, y: circles[i].body.position.y })
    }
    if (circles[i].body.position.x > width + circles[i].r) {
      Matter.Body.setPosition(circles[i].body, { x: circles[i].r, y: circles[i].body.position.y })
    }
    if (circles[i].body.position.y < -circles[i].r) {
      Matter.Body.setPosition(circles[i].body, { x: circles[i].body.position.x, y: height - circles[i].r })
    }
    if (circles[i].body.position.y > height + circles[i].r) {
      Matter.Body.setPosition(circles[i].body, { x: circles[i].body.position.x, y: circles[i].r })
    }
  }

  // MORT
  for (var i=0 ; i<circles.length-1 ; i++) {
    for (var j=i+1 ; j<circles.length; j++) {
      var dx = circles[i].body.position.x-circles[j].body.position.x;
      var dy = circles[i].body.position.y-circles[j].body.position.y;
      if ( (dx**2+dy**2)**0.5 < 1.02*(circles[i].r + circles[j].r) ) {   // 1.02 : laisse 2% d'erreur sur les calculs
        if ( tan(dy/dx) > tan(angle_mort) || tan(dy/dx) < -tan(angle_mort) ) {
          if (dy > 0) {
            console.log(i, "meurt");
            circles[i].meurt();
            circles[j].score += 1;
          }
          else {
            console.log(j, "meurt");
            circles[j].meurt();
            circles[i].score += 1;
          }
        }
      }
    }
  }

  // POUR TOUCHER SOL
  Events.on(engine, 'collisionStart', function(event) {
      var pairs = event.pairs;
      for (var i = 0, j = pairs.length; i != j; ++i) {
          var pair = pairs[i];

          for (var k=0 ; k<circles.length ; k++){
            if (pair.bodyA === circles[k].body) {
                circles[k].peutSauter = true;
                // for (var l=0 ; l<circles.length ; l++) {   // Marche moins bien que l'autre méthode pour la mort
                //     if (l!=k) {
                //
                //         if (pair.bodyB === circles[l].body) {
                //             var dx = circles[k].body.position.x-circles[l].body.position.x;
                //             var dy = circles[k].body.position.y-circles[l].body.position.y;
                //
                //
                //             if ( tan(dy/dx) > tan(angle_mort) || tan(dy/dx) < -tan(angle_mort) ) {
                //                 if (dy > 0) {
                //                     console.log(k, l, 'mort');
                //                     circles[k].meurt();
                //                 }
                //                 else {
                //                     console.log(k, l, 'mort');
                //                     circles[l].meurt();
                //                 }
                //             }
                //         }
                //     }
                // }
            } else if (pair.bodyB === circles[k].body) {
                circles[k].peutSauter = true;
            }
          }
      }
  });
  Events.on(engine, 'collisionEnd', function(event) {
      var pairs = event.pairs;

      for (var i = 0, j = pairs.length; i != j; ++i) {
          var pair = pairs[i];

          for (var k=0 ; k<circles.length ; k++){
            if (pair.bodyA === circles[k].body) {
                circles[k].peutSauter = false;
            } else if (pair.bodyB === circles[k].body) {
                circles[k].peutSauter = false;
            }
          }
      }
  });

  // FIN DE PARTIE
  for (var i=0 ; i<circles.length ; i++) {
    if (circles[i].score == 5) {
      socket.emit('fin',true); // envoie message
    }
  }

  // ENVOIE SCORE
  var scores = [];
  for (var i = 0; i < circles.length; i++) {
    scores.push([circles[i].score, circles[i].id]);
  }
  socket.emit('score',scores);


  // AFFICHAGE SCORE
  afficherScore();
}
