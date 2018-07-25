function afficherScore() {
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
      text('j', width-62,36+14*i); // pseudonyme a mettre
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
      text('moi', width-62,36+14*i);  // pseudonyme a mettre
      text(':', width-50,36+14*i);
      text(score_retour[i][0], width-56+20,36+14*i);
    }
  }
}
