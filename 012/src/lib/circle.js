const MAXRADIUS = 600;
class Circle {
  constructor(x_, y_, c_) {
    this.x = Math.round( x_ );
    this.y = Math.round( y_ );
    this.color = c_ || null;
    this.radius = 1;
    this.isGrowing = true;
  }
  
  draw( minSteps, minRadius, colorSteps ) {
    // stroke( this.color );
    // noFill();
    if ( this.radius > minRadius ) {
      let step = 2;
      let steps = Math.floor( this.radius / step );
      steps = Math.min( steps, minSteps );

      while ( steps-- > 0 ) {
        let r = (this.radius - step * steps);
        circle( this.x, this.y, r*2 );
      }
    } else {
      if ( this.color !== null ) {
        fill( this.color );
      } else if ( colorSteps ) {
        let l = noise( this.x * 0.01, this.y * 0.01 );
        l = Math.ceil( l * colorSteps ) / colorSteps;
        fill( l * 255 );
      } else {
        let l = noise( this.x * 0.01, this.y * 0.01 );
        fill( l > 0.5 ? 255 : 0 );
      }
      circle( this.x, this.y, this.radius*2 );
    }
  }
  
  grow() {
    if ( this.isGrowing && this.radius < MAXRADIUS ) {
      this.radius += 0.5;
    }
  }
  // calcMove() {
  //   return { x:this.x, y:this.y + 0.25 };
  // }
  // move() {
  //   let newPos = this.calcMove();
  //   this.x = newPos.x;
  //   this.y = newPos.y;
  // }
  
  intersects( c ) {
    let dx = c.x - this.x,
        dy = c.y - this.y,
        d = Math.sqrt( dx*dx + dy*dy );

    return ( d-1 <= (this.radius + c.radius) );
  }
  contain( x0, y0, x1, y1 ) {
    if (
      this.x - this.radius <= x0 ||
      this.x + this.radius >= x1 || 
      this.y - this.radius <= y0 ||
      this.y + this.radius >= y1 )
    {
      this.isGrowing = false;
    }
  }
}