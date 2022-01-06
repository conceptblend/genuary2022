class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Polygon {
  constructor(arr_points, bool_skip) {
    this.points = arr_points;
    this.skip = bool_skip || false;
  }
  numPoints() {
    return this.points.length;
  }

  draw( c1, c2 ) {
    beginShape();
    for (var i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y);

      // push();
      // noFill();
      // stroke( 0, 0, 100 );
      // strokeWeight( 1 );
      // circle( this.points[ i ].x, this.points[ i ].y, 8 );
      // pop();
      // console.log( this.points[ i ].x, this.points[ i ].y );
    }
    endShape( CLOSE );
  }

  subdivide( ratio = 0.5 ) {
    // Make a copy to mess with
    let pts = [ ...this.points ];

    let e = Math.floor( Math.random() * ( pts.length - 2 ) );
    // console.log( "e: ", e );
    let edge1 = [ 0, 1 ];
    let edge2 = [ 1 + e, 2 + e ];
    let mid1 = edge1[ 0 ] + 1; // optimistic!
    let mid2 = edge2[ 0 ] + 2;

    let mid1pt = point_lerp( pts[ edge1[ 0 ] ], pts[ edge1[ 1 ] ], ratio );
    let mid2pt = point_lerp( pts[ edge2[ 0 ] ], pts[ edge2[ 1 ] ], ratio );

    // insert first midpoint
    pts.splice( mid1, 0, jigglePoint( mid1pt ) );
    // insert second midpoint
    pts.splice( mid2, 0, jigglePoint( mid2pt ) );

    // console.log( "PTS: ", pts );
    // Polygon 1
    let polygon1 = new Polygon( [
        ...pts.slice( 0, mid1 ),
        pts[ mid1 ],
        // pts[ mid2 ],
        ...pts.slice( mid2 ),
      ], false );

    // Polygon 2
    let polygon2 = new Polygon( [
        ...pts.slice( mid1, mid2 ),
        pts[ mid2 ],
      ], false );

    return Math.random() > 0.7 ? [ polygon1 ] : [ polygon1 , polygon2 ];
  }
}
const JITTER_HALF = 8;
const JITTER = JITTER_HALF * 2;
function jigglePoint( p ) {
  return new Point( p.x + Math.random() * JITTER - JITTER_HALF, p.y + Math.random() * JITTER - JITTER_HALF,)
}
function _lerp(start, end, ratio) {
  return start * (1 - ratio) + end * ratio;
}

function point_lerp(startPoint, endPoint, ratio) {
  return new Point(
    _lerp(startPoint.x, endPoint.x, ratio),
    _lerp(startPoint.y, endPoint.y, ratio)
  );
}
