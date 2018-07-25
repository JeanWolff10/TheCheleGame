function creerPartie() {
  var j=0;
  console.log(joueurs);
  for (var i = 0; i < joueurs.length; i++) {
    if (joueurs[i].statut === 'dans_la_partie') {
      console.log('nouvelle bille');
      var id = joueurs[i].id;
      var x = 100+75*j;
      var y = 100;
      circles.push(new Balle(x, y, rayonBalles, couleurs[j], id));
      // if (id == socket.id) {
      //   mon_numero_dans_circles = j;
      // }
      j+=1;
    }


  }

  }
