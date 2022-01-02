class Point2D {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
}

const METHODS = {
  CHORDS: 0x01,
  CURVES: 0x02,
  CURVESORGANIC: 0x03,
};

// PARAMETER SETS
const PARAMS = [
  {
    name: "genuary-001-moon",
    seed: "hello world",
    width: 1080,
    height: 1080,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    jitter: 16,
    diameter: 0.9,
    bezierPoints: 3,
    fg: 0,
    bg: 255,
    alpha: 10,
    method: METHODS.CHORDS,
  },
  {
    name: "genuary-001-crisp",
    seed: "hello world",
    width: 1080,
    height: 1080,
    jitter: 0,
    diameter: 0.9,
    bezierPoints: 3,
    fg: 0,
    bg: 255,
    alpha: 10,
    method: METHODS.CURVES,
  },
  {
    name: "genuary-001-furry",
    seed: "10,000 somethings",
    width: 1080,
    height: 1080,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    jitter: 32,
    diameter: 0.9,
    bezierPoints: 3,
    fg: 0,
    bg: 255,
    alpha: 10,
    strokeWeight: 1,
    exportVideo: false,
    method: METHODS.CURVESORGANIC,
  },
];

// PARAMETERS IN USE
const P = PARAMS[0];

const FG = P.fg;
const BG = P.bg;

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

function setup() {
  createCanvas( P.width, P.height );
  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  stroke( P.fg, P.fg, P.fg, P.alpha );
  strokeJoin( BEVEL );
  strokeWeight( P.strokeWeight ?? 1 );
  
  noFill();
  
  Math.seedrandom( P.seed );
  
  if ( P.exportVideo ) {
    frameRate( FPS );
  } else {
    noLoop();
  }
}

const CX = P.width * 0.5,
      CY = P.height * 0.5,
      D = Math.min( P.width, P.height ) * P.diameter,
      R = D * 0.5,
      COUNT = 10000;

function draw() {
  background( P.bg );

  switch ( P.method ) {
    case METHODS.CURVES:
      drawPolyBezier();
      break;
    case METHODS.CURVESORGANIC:
      drawPolyBezierOrganic();
      break;
    case METHODS.CHORDS:
    default:
      drawChords();
      break;
  }

  if (EXPORTVIDEO) {
    if (!isRecording) {
      cnvsrecorder = new CanvasRecorder(FPS);
      cnvsrecorder.start();
      isRecording = true;
      console.log('Recording...');
    }
    // Example to end automatically after 361 frames to get a full loop
    if (frameCount > DURATION) {
      cnvsrecorder.stop(`${getName()}`);
      noLoop();
      console.log('Done.');
    }
  }
}

function getName() {
  // Encode the parameters into the filename
  // let params = window.btoa(JSON.stringify(P));
  let params = MD5( JSON.stringify(P) );
  return `${P.name}-${params}-${new Date().toISOString()}`;
}

function drawChords() {
  for (let i = 0; i < COUNT; i++ ) {
    let angle1 = Math.random() * 360;
    let angle2 = Math.random() * 360;
    line(
      CX + Math.cos( angle1 ) * R,
      CY + Math.sin( angle1 ) * R,
      CX + Math.cos( angle2 ) * R,
      CY + Math.sin( angle2 ) * R
    );
  }
}

function drawPolyBezier() {
  // NOTE: If using transparency for the effect, you cannot use
  // beginShape/endShape because the entire polyline will have
  // the same color and the transparency is lost.
  let last = null;

  // let p1 = new Point2D( CX, CY - 1.25*R );
  let p1 = new Point2D( CX - 0.6*R, CY + 1.15*R );
  for (let i = 0; i < COUNT; i++ ) {
    let angle1 = Math.random() * 360;
    if ( last ) {
      let p0 = new Point2D(
        CX + Math.cos( last ) * R,
        CY + Math.sin( last ) * R
      );

      let p2 = new Point2D(
        CX + Math.cos( angle1 ) * R,
        CY + Math.sin( angle1 ) * R
      )
      drawQuadraticBezier( p0, p1, p2, 3 );
    }
    last = angle1;
  }
}

function drawPolyBezierOrganic() {
  // NOTE: If using transparency for the effect, you cannot use
  // beginShape/endShape because the entire polyline will have
  // the same color and the transparency is lost.
  let last = null;

  let p1 = new Point2D( CX - 0.6*R, CY + 1.15*R );

  const JITTER = Math.abs( P.jitter - frameCount );

  for (let i = 0; i < COUNT; i++ ) {
    let angle1 = Math.random() * 360;
    if ( last ) {
      let nlastx = ( 2 * noise( 13 * last ) - 1 ) * JITTER;
      let nlasty = ( 2 * noise( 13 * last + i ) - 1 ) * JITTER;
      let nangle1x = ( 2 * noise( angle1 ) - 1 ) * JITTER;
      let nangle1y = ( 2 * noise( angle1 + i) - 1 ) * JITTER;

      let p0 = new Point2D(
        CX + Math.cos( last ) * R + nlastx,
        CY + Math.sin( last ) * R + nlasty
      );

      let p2 = new Point2D(
        CX + Math.cos( angle1 ) * R + nangle1x,
        CY + Math.sin( angle1 ) * R + nangle1y
      )

      drawQuadraticBezier( p0, p1, p2, P.bezierPoints );

    }
    last = angle1;
  }
}

function drawQuadraticBezier( p0, p1, p2, steps ) {
  steps = steps ?? 10;
  let step = 0;
  beginShape();
  while (step <= steps) {
    let p = quadraticBezierPoint( p0, p1, p2, step / steps );
    vertex( p.x, p.y );
    step++;
  }
  endShape();
}

function quadraticBezierPoint(p0, p1, p2, t) {
  // SLOW implementation
  let x1 = lerp( p0.x, p1.x, t );
  let y1 = lerp( p0.y, p1.y, t );
  let x2 = lerp( p1.x, p2.x, t );
  let y2 = lerp( p1.y, p2.y, t );

  return new Point2D( lerp( x1, x2, t ), lerp( y1, y2, t ) );
}

//////////

function saveImage( ext ) {
  save(`${ getName() }.${ ext ?? 'jpg' }`);
}

function saveConfig() {
  saveJSON( P, `${getName()}-config.json` );
}

function downloadOutput() {
  saveImage();
  saveConfig();
}