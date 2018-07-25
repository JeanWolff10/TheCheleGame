function Balle(x, y, r, couleur, id) {
  var options = {
    friction:0.3,
    restitution:0.6, // rebondir
    peutSauter:false
  }
  this.body = Bodies.circle(x, y, r, options);
  this.x = x;
  this.y = y;
  this.r = r;
  this.score = 0;
  this.couleur = couleur;
  this.t2 = persistence_mort+1;
  this.t1 = 0;
  this.temppourreapparition = 0;
  this.fillStyle = 'transparent';

  this.id = id;

  World.add(world, this.body); // ajoute le body au world "world"

  this.update = function() {
    // EST MORT
    if (abs(this.t2-this.t1) < persistence_mort) {
      this.t2 = second();
      Matter.Body.setPosition(this.body, { x: 2*width, y: 2*height });    // Il faut que le show() soit avant le passage par les bords dans le sketch
      Matter.Body.setVelocity(this.body, { x: 0, y: 0} );
    }

    // REVIT
    else {
      this.vivant = true;
    }

    // EST VIVANT
    if (this.vivant == true) {
      if (this.temppourreapparition == 1) {
        Matter.Body.setPosition(this.body, { x: this.x, y: this.y });
        Matter.Body.setVelocity(this.body, { x: 0, y: 0} );
        this.temppourreapparition = 0;
      }
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER); // il faut dessiner de la même manière que le modèle physique fonctionne
        // fill(this.couleur);
        // noStroke();
        // ellipse(0,0,2*this.r,2*this.r, this.fillStyle); // p5 prend des diamètres et matter des rayons
        pop();
    }

    // SI MORT
    else {
      // fill(this.couleur);
      // noStroke();
      // ellipse(this.x, this.y, 2*this.r,2*this.r, this.fillStyle);
    }
  }

  this.meurt = function() {
    this.temppourreapparition = 1;
    this.t1 = second();
    this.t2 = this.t1;
    this.vivant = false;
    Matter.Body.setPosition(this.body, { x: 2*width, y: 2*height });
    Matter.Body.setVelocity(this.body, { x: 0, y: 0} );
  }
}
