class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class LineSegment {
  constructor( p1, p2 ) {
    this.p1 = p1 ?? undefined;
    this.p2 = p2 ?? undefined;
  }

  static getIntersection( line1, line2 ) {
    let x1 = line1.p1.x;
    let y1 = line1.p1.y;
    let x2 = line1.p2.x;
    let y2 = line1.p2.y;

    let x3 = line2.p1.x;
    let y3 = line2.p1.y;
    let x4 = line2.p2.x;
    let y4 = line2.p2.y;
    
    const denominator = ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 );

    const Tnumerator = ( x1 - x3 ) * ( y3 - y4 ) - ( y1 - y3 ) * ( x3 - x4 );
    const T = Tnumerator / denominator;

    const Unumerator = ( x1 - x3 ) * ( y1 - y2 ) - ( y1 - y3 ) * ( x1 - x2 );
    const U = Unumerator / denominator;

    if ( T >= 0 && T <= 1 && U >= 0 && U <= 1 ) {
      let x = x1 + T * ( x2 - x1 );
      let y = y1 + T * ( y2 - y1 );
      return new Point( x, y );
    }
    return false;
  }
}