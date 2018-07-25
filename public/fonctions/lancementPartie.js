function lancementPartie(joueurs) {
  for (var i = 0; i < joueurs.length; i++) {
    if (joueurs[i].statut === 'pret') {
      joueurs[i].statut='dans_la_partie';
    }
    else {
      joueurs[i].statut='en_attente';
    }
  }
}
