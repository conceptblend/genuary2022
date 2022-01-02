let radius = 0;
let increment = 1;

function drawTriangleMesh( cx, cy ) {
  const maxIterations = 3;
  const rgbColours = [
    "#FF9263", // orange
    "#92C6F9", // soft blue
    "#F1E7CE", // STROKE
    "#A2E5B3", // greenish
    "#E5D2A2",
    "#E5C675", // light orange/cream
    "#7A4BB7", // purple
  ];
  const colourPoints = [{
    x: 0,
    y: 0,
    c: color(rgbColours[3])
  },
  {
    x: width,
    y: height,
    c: color(rgbColours[6])
  }
];
  const segments = 10;
  const angle = 360 / segments;
  const inset = 20;
  /// /END PARAMS


  /** MAKE A CIRCLE! **/
  if (radius > Math.min( cx, cy ) * 0.6) {
    increment *= -1;
  }
  radius += increment;

  let inner = new Point(
    cos(4*frameCount) * radius + cx,
    sin(4*frameCount) * radius + cy
  );

  let hexPoints = [
    inner
  ];

  for (var n = 0; n < segments; n++) {
    hexPoints.push(
      new Point(
        cos(n * angle) * (cx - (cos(10 * frameCount) * 0.5 + 0.5) * 10) + cx,
        sin(n * angle) * (cy - (sin(10 * frameCount) * 0.5 + 0.5) * 10) + cy
      )
    );
  }

  f = [];
  for (n = 1; n <= segments; n++) {
    let t = (n == segments) ? 1 : n + 1;
    f.push(
      new Face([
        hexPoints[0],
        hexPoints[n],
        hexPoints[t]
      ])
    );
  }


  let ratio = 0.5;

  for (var l = 0; l < maxIterations; l++) {
    let f_prime = [];
    for (var i = 0, len = f.length; i < len; i++) {
      // if (f[i].skip) {
      //   f_prime.push(f[i]);
      // } else {
        let ff = f[i].subdivide(ratio);
        f_prime = [...f_prime, ...ff];
      // }
    }
    f = [...f_prime];
  }

  f.forEach(n => n.draw( colourPoints[0], colourPoints[1] ));
}