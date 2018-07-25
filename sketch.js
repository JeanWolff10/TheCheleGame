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

var socket;
var start = false;
var data_demarrer = [];
var demarrable = true;
var mon_numero_dans_circles = 0;

var coordonnees_retour = [];
var score_retour = [];

var joueurs=[];
var pret=false;

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
    activer_reception();
    demander_pseudonyme();

}   // FIN SETUP

function draw() {
    background(0,150,0);

    // DIRE AU SERVEUR QUON EST PRET
    if (keyIsDown(13) && pret==false) {   // 13 pour Enter
      pret=true
      socket.emit('pret',true);
    }

    // AFFICHAGE DECOR
    for (var i=0 ; i<boundaries.length ; i++){
      fill(0);
      boundaries[i].show();
    }

    // TRAITEMENT PAR CLIENT 1
    if (circles.length>0 && joueurs[0].id == socket.id) {
      console.log(circles[0].body.position.x);
      traitement_par_client_1();
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

} // FIN DRAW

// pour mettre des images à la place des balles : démo sprites
// terrain tarabiscoté : démo terrain
