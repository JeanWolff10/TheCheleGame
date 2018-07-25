// pour pouvoir utiliser ces variables sans le "Matter."
var Engine = Matter.Engine,
    // Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events;

// create an engine
var engine;
var world;
var circles=[];
var boundaries=[];
var ground;
var angle_mort=1; // en radians
var persistence_mort=2;
var hauteur_saut=0.02;
var vitesse_laterale=0.001;

var socket;
var start = false;
var pret = false;
var data_demarrer = [];
var demarrable = true;
var mon_numero_dans_circles = 0;
var couleurs=[[255,0,0],[0,0,255],[255,255,0],[0,255,255],[255,0,255],255];

var coordonnees_retour = [];
var score_retour = [];

function setup() {
    createCanvas(800,400);
    engine = Engine.create(); // crée le modèle physique
    world = engine.world;
    //Engine.run(engine);  // lance le modèle physique
    // alternative à Engine.run(engine) : "Engine.update(engine);" dans le draw

    // CHOIX DECOR
    // 1 en 1000, 600
    decor0();


    rectMode(CENTER);

    socket = io.connect('http://localhost:3000');

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

}   // FIN SETUP

function draw() {
    background(0,150,0);
    Engine.update(engine);

    // DIRE AU SERVEUR QUON EST PRET
    if (keyIsDown(13) && pret==false) {
      pret = true;
      socket.emit('pret',true);
    }

    // AFFICHAGE DECOR
    for (var i=0 ; i<boundaries.length ; i++){
      fill(0);
      boundaries[i].show();
    }

    // CREATION BALLES CHEZ CLIENT 1
    if (demarrable == true) {
      if (start == true) {
        if (data_demarrer[0][0] == socket.id) {
          demarrable = false;
          for (var i = 0; i < data_demarrer.length; i++) {
            var id = data_demarrer[i][0];
            var x = data_demarrer[i][1];
            var y = data_demarrer[i][2];
            circles.push(new Balle(x, y, 17, couleurs[i], id));
            if (id == socket.id) {
              mon_numero_dans_circles = i;
            }
          }
        }
      }
    }

    // TRAITEMENT PAR CLIENT 1
    if (start == true && data_demarrer[0][0] == socket.id) {

          // UPDATE BALLES
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

   } // FIN IF START = TRUE

   // AFFICHAGE BALLES CHEZ TOUS
   for (var i = 0; i < coordonnees_retour.length; i++) {
     fill(coordonnees_retour[i][3]);
     noStroke();
     ellipse(coordonnees_retour[i][0], coordonnees_retour[i][1], coordonnees_retour[i][2]*2, coordonnees_retour[i][2]*2);
   }

   // COMMANDES TOUS
   if (keyIsDown(LEFT_ARROW)) {
     socket.emit('move_left',true); // envoie message
   }
   if (keyIsDown(RIGHT_ARROW)) {
     socket.emit('move_right',true); // envoie message
   }
   if (keyIsDown(UP_ARROW)) {
      socket.emit('move_up',true); // envoie message
   }

   // AFFICHAGE SCORE
   textSize(11);
   textAlign(CENTER, CENTER);
   stroke(255);
   noFill();
   rect(width-50, 20, 50, 16);
   noStroke();
   fill(255);
   text('Scores', width-50, 21);
   for (var i=0 ; i<score_retour.length ; i++) {
     if (score_retour[i][1] != socket.id) {
       stroke(255);
       noFill();
       rect(width-50, 35+14*i, 50, 14);
       noStroke();
       fill(255);
       text('j', width-62,36+14*i);
       text(i+1, width-56,36+14*i);
       text(':', width-50,36+14*i);
       text(score_retour[i][0], width-56+20,36+14*i);
     }
     else {
       stroke(255);
       noFill();
       rect(width-50, 35+14*i, 50, 14);
       noStroke();
       fill(255);
       text('moi', width-62,36+14*i);
       text(':', width-50,36+14*i);
       text(score_retour[i][0], width-56+20,36+14*i);


     }
   }

} // FIN DRAW

// pour mettre des images à la place des balles : démo sprites
// terrain tarabiscoté : démo terrain
