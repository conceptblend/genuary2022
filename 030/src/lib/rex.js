class Rex {

  static SLICE_ENUM = {
    NW: 0x01,
    NE: 0x02,
    SE: 0x04,
    SW: 0x08,
  };

  /**
   * 
   * @param {p5.Vector} p0 
   * @param {p5.Vector} p1 
   * @param {Number} [ratio] The linear interpolation ratio. (0 ≤ ratio ≤ 1) 
   */
  constructor( p0 /*p5.Vector::2D*/, p1, ratio = 2 ) {
    this._isBuilt = false;

    this.p0 = p0;
    this.p1 = p1;
    this.p2 = undefined;
    this.p3 = undefined;
    this.ratio = ratio;

    this.children = [];

    this.colour = COLOURS[ Math.floor( Math.random() * COLOURS.length )];

    this.build( ratio );
  }

  /**
   * 
   * @param {Number} [ratio] The linear interpolation ratio. (0 ≤ ratio ≤ 1)
   */
  build( ratio ) {
    this.ratio = ratio ? ratio : this.ratio;

    const normal = p5.Vector.sub( this.p0, this.p1 ).mult( this.ratio ).rotate( 90 );

    this.p2 = p5.Vector.add( this.p1, normal );
    this.p3 = p5.Vector.add( this.p0, normal );
    this._isBuilt = true;
  }

  destroy() {
    this.children.forEach( c => c.destroy() );
    this.children = [];
  }

  /**
   * 
   * @param {Number} [r1] The linear interpolation ratio for the 'left' edge. (0 ≤ ratio ≤ 1) 
   * @param {Number} [r2] The linear interpolation ratio for the 'right' edge. (0 ≤ ratio ≤ 1) 
   * @param {Rex.SLICE_ENUM} placement See Rex.SLICE_ENUM
   * @param {Number} depth Recursive depth at this level. Continues until 0.
   * @returns 
   */
  addChildren( r1, r2, placement, depth ) {
    if ( depth <= 0 ) return false;

    let q0, q1;
    
    if ( placement & Rex.SLICE_ENUM.NW ) {
      q0 = p5.Vector.lerp( this.p3, this.p0, r1 );
      q1 = p5.Vector.lerp( this.p3, this.p2, r2 );
      this.children.push( new Rex( q0, q1, this.ratio ) );
    }
    if ( placement & Rex.SLICE_ENUM.NE ) {
      q0 = p5.Vector.lerp( this.p2, this.p3, r1 );
      q1 = p5.Vector.lerp( this.p2, this.p1, r2 );
      this.children.push( new Rex( q0, q1, this.ratio ) );
    }
    if ( placement & Rex.SLICE_ENUM.SE ) {
      q0 = p5.Vector.lerp( this.p1, this.p2, r1 );
      q1 = p5.Vector.lerp( this.p1, this.p0, r2 );
      this.children.push( new Rex( q0, q1, this.ratio ) );
    }
    if ( placement & Rex.SLICE_ENUM.SW ) {
      q0 = p5.Vector.lerp( this.p0, this.p1, r2 );
      q1 = p5.Vector.lerp( this.p0, this.p3, r1 );
      this.children.push( new Rex( q0, q1, this.ratio ) );
    }
    this.children.forEach( c => c.addChildren( r1, r2, placement, depth-1 ) );
    return true;
  }

  /**
   * 
   * @param {Boolean} [bStroke] Draw the stroke.
   */
  draw( bStroke = false ) {
    fill( this.colour );
    bStroke && push();
    bStroke && stroke( 0 );
    beginShape();
    vertex( this.p0.x, this.p0.y );
    vertex( this.p1.x, this.p1.y );
    vertex( this.p2.x, this.p2.y );
    vertex( this.p3.x, this.p3.y );
    endShape( CLOSE );
    bStroke && pop();

    this.children.forEach( c => c.draw( bStroke ) );
  }
}