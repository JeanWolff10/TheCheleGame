socket.on('nouveau_connecte',
  function(data) {
  idnouveau = data.idnouveau;
  connectes=data.connectes


  })

  socket.on('nouveau_pret',
    function(data) {
    idnouveau = data;



    })

if (nombre_joueurs_connectes == 1) {
  // attente d'autres joueurs connectés
}
else {
  if (pret=false) {
    //appuyer sur entrée pour jouer
  }
  else {
    if (nombre_joueurs_prets == 1) {
      // attente que les autres joueurs appuient sur entrée
    }
    else if (1 < nombre_joueurs_prets < nombre_joueurs_connectes) {


                var decompte = second();
                if (decompte<50) {
                  if (second()-decompte < 10) {
                    // il reste x secondes aux joueurs connectés pour appuyer sur entrée
                  }
                }
                else {
                  if (second()<20) {
                    if (60-decompte+second() < 10) {
                      // il reste x secondes aux joueurs connectés pour appuyer sur entrée
                    }
                  }
                }



    }
  }
}
