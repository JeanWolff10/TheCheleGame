function boundary(x, y, w, h, a) {
  var options = {
    friction:0.3,
    restitution:0.6, // rebondir
    isStatic:true,
    angle: a
  }
  this.body = Bodies.rectangle(x, y, w, h, options);
  this.w = w;
  this.h = h;
  this.x = x;
  this.y = y;
  World.add(world, this.body);

  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER); // il faut dessiner de la même manière que le modèle physique fonctionne
    rect(0,0,this.w,this.h);
    pop();
  }

  this.sousBalle = function(balle) {    // marche pas bien
    var balle_test = balle;
    if (this.body.angle == 0) {
      if (balle_test.body.position.x > this.x-this.w && balle_test.body.position.x < this.x+this.w) {
        console.log(balle_test.body.position.y + balle_test.r, 0.98*(this.y-this.h), balle_test.body.position.y + balle_test.r, 1.02*(this.y-this.h));
        if (balle_test.body.position.y + balle_test.r > 0.98*(this.y-this.h) && balle_test.body.position.y + balle_test.r < 1.02*(this.y-this.h)) {
          return true;
        }
        else {
          return false;
        }
      }
    }
    else {
      return false;
    }
  }
  // sensor, events
  this.sousBalle2 = function(balle) { // prend en compte une vitesse verticale nulle, mais marche pas
    if (abs(balle.body.velocity.y) < 1) {
      return true;
    }
    else {
      return false;
    }
  }
}
