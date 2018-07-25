function activer_reception() {
  socket.on('demarrer',
    function(data) {
      start = data;
    })

  socket.on('demarreur',
    function(data) {
      data_demarrer = data;
    })

  socket.on('move',
    function(data) {
      if (data_demarrer.length > 0) {
        if (data_demarrer[0][0] == socket.id) {
          for (var i = 0; i < circles.length; i++) {
            if (circles[i].id == data.id) {
              if (data.move == 'left') {
                Matter.Body.applyForce(circles[i].body, circles[i].body.position, { x: -vitesse_laterale, y: 0 });
              }
              if (data.move == 'right') {
                Matter.Body.applyForce(circles[i].body, circles[i].body.position, { x: vitesse_laterale, y: 0 });
              }
              if (data.move == 'up') {
                if (circles[i].peutSauter == true && circles[i].body.velocity.y < 10) {
                  Matter.Body.applyForce(circles[i].body, circles[i].body.position, { x: 0, y: -hauteur_saut });
                }
              }
            }
          }
        }
      }
    })

  socket.on('cestfini',
    function() {
      start = false;
      pret = false;
      data_demarrer = [];
      demarrable = true;
      mon_numero_dans_circles = 0;
      while (circles.length > 0) {
        World.remove(world, circles[circles.length-1].body); // ajoute le body au world "world"
        shorten(circles);
      }
    })

  socket.on('coordonnees_retour',
    function(data) {
    coordonnees_retour = data;
    })

  socket.on('score_retour',
    function(data) {
    score_retour = data;
    })

  socket.on('pseudonymes_retour',
    function(data) {
    pseudonymes = data;
    })

  socket.on('lancementPartie',
    function(data) {
    joueurs = data;
    if (joueurs[0].id == socket.id) {
      creerPartie();
    }
    })

  socket.on('liste_joueurs',
    function(data) {
    joueurs = data;
    })
}
