function _lerp(start, end, ratio) {
  // console.log( "Lerp: ", start, end, ratio );
  return start * (1 - ratio) + end * ratio;
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static lerp(startPoint, endPoint, ratio) {
    return new Point(
      _lerp(startPoint.x, endPoint.x, ratio),
      _lerp(startPoint.y, endPoint.y, ratio)
    );

  }
}

// function point_lerp(startPoint, endPoint, ratio) {
//   return new Point(
//     _lerp(startPoint.x, endPoint.x, ratio),
//     _lerp(startPoint.y, endPoint.y, ratio)
//   );
// }

function precalcCubicBezier(pp0, pp1, pp2, pp3) {
  let points = [];

  for (let t = 0; t <= 1.00001; t += STEPSIZE) {
    let v = quadraticBezier(pp0, pp1, pp2, t);
    let v2 = quadraticBezier(pp1, pp2, pp3, t);
    
    // Calculate the normal so we can draw other cool shit.
    let dir = new Point( v2.x - v.x, v2.y - v.y );
    let l = Math.sqrt( dir.x * dir.x + dir.y * dir.y );
    dir.x /= l;
    dir.y /= l;
    let normal = new Point( dir.y, -dir.x );
    // Got the normal!
    
    // let x = lerp( v.x, v2.x, t );
    // let y = lerp( v.y, v2.y, t );

    points.push({
      p: Point.lerp( v, v2, t ),
      n: normal
    });
  }
  return points;
}


function cubicBezier(pp0, pp1, pp2, pp3, t) {
    let v = quadraticBezier(pp0, pp1, pp2, t);
    let v2 = quadraticBezier(pp1, pp2, pp3, t);
    
    // Calculate the normal so we can draw other cool shit.
    // let dir = new Point( v2.x - v.x, v2.y - v.y );
    // let l = Math.sqrt( dir.x * dir.x + dir.y * dir.y );
    // dir.x /= l;
    // dir.y /= l;
    // let normal = new Point( dir.y, -dir.x );
    // Got the normal!
    
    // let x = lerp( v.x, v2.x, t );
    // let y = lerp( v.y, v2.y, t );

    // points.push({
    //   p: Point.lerp( v, v2, t ),
    //   n: normal
    // });
  
    return Point.lerp( v, v2, t );
}

function quadraticBezier(p0, p1, p2, t) {
  // let x1 = lerp( p0.x, p1.x, t );
  // let y1 = lerp( p0.y, p1.y, t );
  // let x2 = lerp( p1.x, p2.x, t );
  // let y2 = lerp( p1.y, p2.y, t );

  return Point.lerp(
    Point.lerp( p0, p1, t ),
    Point.lerp( p1, p2, t ),
    t
  );
  // return new Point( lerp( x1, x2, t ), lerp( y1, y2, t ) );
}