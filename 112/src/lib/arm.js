class Arm {
  constructor( options ) {
    this.angle = options?.angle ?? 0;
    this.length = options?.length ?? length;
    this.rotSpeed = options?.speed ?? 2;
    this.vect = createVector( this.length * cos( this.angle * Math.PI/180 ), this.length * sin( this.angle * Math.PI/180 ) );
  }
  update() {
    this.vect.rotate( this.rotSpeed * Math.PI/180 );
  }
  draw( x, y ) {
    line( x, y, x+this.vect.x, y+this.vect.y );
    circle( x, y, 2*this.length );
  }
}