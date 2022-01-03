class StarField {
  constructor(w, h, options ) {
    this.width = w;
    this.height = h;
    this.density = options.density ?? 0.002;
    this.stars = []; // p5.Vector__2D
    this.radius = Math.min( this.width * 0.5, this.height * 0.5 );
    this.maxRadius = this.radius * 1.5;
    this.velocity = options.velocity ?? 4;
    this.rotateByAmount = options.rotateByAmount ?? 3;
    this.useBugFeature = options.useBugFeature ?? false;
  }

  generateStarField() {
    let count = Math.round(this.width * this.height * this.density);
    console.log(count);

    this.addStar( count );
  }
  addStar( n = 1 ) {
    while( n-- > 0 ) {
      this.stars.push(
        createVector(Math.random() * this.width, Math.random() * this.height )
      );
    }
  }

  draw() {
    this.stars.forEach((s) => {
      circle( s.x, s.y, 2 );
    });
  }

  update( velocity, rotateByAmount ) {
    if ( velocity ) this.velocity = velocity;
    if ( rotateByAmount ) this.rotateByAmount = rotateByAmount;

    let origin = createVector( this.width * 0.5, this.height * 0.5 );
    this.stars.forEach((s) => {
      let delta = p5.Vector.sub( s, origin );
      let factor = delta.mag() / this.radius;

      // Move away from center evenly
      s.add( delta.normalize().mult( factor * this.velocity ) );

      // Move away from center with a twist
      if ( this.useBugFeature ) {
        delta.rotate( delta.heading() + this.rotateByAmount ) // THIS IS A GREAT BUG!!!! NOW A FEATURE :)
      } else {
        delta.rotate( this.rotateByAmount );
      }
      s.add( delta.normalize().mult( factor * this.velocity ) );
    
      
    });

    //
    // Clean up
    //
    let n = 0,
        deadStars = 0;
    
    while ( n < this.stars.length ) {
      let delta = p5.Vector.sub( this.stars[ n ], origin );
      if ( delta.mag() > this.maxRadius ) {
        // Remove it and increment the dead star count
        this.stars.splice( n, 1 );
        deadStars++;
      }
      n++;
    }
    
    // Re-populate
    this.addStar( deadStars );
  }
}
