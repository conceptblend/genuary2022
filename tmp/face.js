class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Face {
  constructor(arr_points, bool_skip) {
    this.points = arr_points;
    this.len = this.points.length;
    this.skip = bool_skip || false;
  }

  draw( c1, c2 ) {
    // if (c) {
    //   fill(c);
    // } else if (g_paintFill) {
      let centroid = this.getCentroid();
      let ratioX = centroid.x / width;
      let ratioY = centroid.y / height;
      // fill(lerpColor(c1.c, c2.c, ratioY));
      fill( ratioY * 255 );
      // fill( Math.round( Math.random() ) > 0.5 ? c1.c : c2.c );
    // } else {
    //   noFill();
    // }
    // if (g_drawStroke) {
    //   strokeWeight(1);
    //   // stroke(rgbColours[2]);
    //   stroke(0, 64);
    // } else {
    //   noStroke();
    // }

    beginShape();
    for (var i = 0; i < this.len; i++) {
      vertex(this.points[i].x, this.points[i].y);
    }
    vertex(this.points[0].x, this.points[0].y);
    endShape();
  }

  subdivide(_ratio) {
    let ratio = _ratio || 0.5;
    let centroid = this.getCentroid();
    let pts = this.points;

    return [
      new Face([pts[0], pts[1], centroid, pts[0]], Math.random() > 0.65),
      new Face([pts[1], pts[2], centroid, pts[1]], Math.random() > 0.97),
      new Face([pts[2], pts[0], centroid, pts[2]], Math.random() > 0.5),
    ];
  }
  getCentroid() {
    let oppositeMidpoint = point_lerp(this.points[1], this.points[2], 0.5);
    return point_lerp(this.points[0], oppositeMidpoint, 2 / 3);
  }
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
