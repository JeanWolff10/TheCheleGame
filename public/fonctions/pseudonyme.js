function demander_pseudonyme(){
  var usertest=0;
  if (usertest==0) {
    monPseudonyme=prompt("Pseudonyme")
    usertest=1;
    console.log(monPseudonyme);
    socket.emit('pseudonyme_aller',monPseudonyme);
  }
}
