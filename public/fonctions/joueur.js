function joueur(socket_id) {
  this.id = socket_id;
  this.pseudonyme = monPseudonyme;
  this.pret = false;
  this.score = 0;
  this.statut = 'nouveau';
  // nouveau, pas_pret, pret, dans_la_partie, en_attente

  this.caca = function() {
      this.t2 = second();
    }
}
