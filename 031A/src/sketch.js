class Point2D {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
}

// PARAMETER SETS
const PARAMS = [
  {
    name: "genuary-031-moon",
    seed: "hello world",
    width: 1080,
    height: 1080,
    fps: 4,
    duration: 30 * 4, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    jitter: 16,
    diameter: 0.9,
    bezierPoints: 3,
    fg: 255,
    bg: 0,
    alpha: 10,
    exportVideo: !true,
    isAnimated: true,
  },
];

// PARAMETERS IN USE
const P = PARAMS[0];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
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
  
  if ( P.exportVideo || P.isAnimated ) {
    frameRate( P.fps );
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
  drawChords();

  drawFrown();
  drawEyes();

  if (EXPORTVIDEO) {
    if (!isRecording) {
      cnvsrecorder = new CanvasRecorder( P.fps );
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

function drawFrown() {

  push();
  stroke( 0 );
  strokeWeight( 30 );
  noFill();
  let theta = 30;
  let o = Math.sin( frameCount ) * R * 0.015;
  let xr = Math.random() * R * 0.02;

  drawQuadraticBezier(
    new Point2D( xr + CX + Math.cos( (180-theta*0.5) * Math.PI / 180 ) * R * 0.8, CY + Math.sin( (180-theta*0.5) * Math.PI / 180 ) * R * 0.9 ),
    new Point2D( xr + CX, CY+o ),
    new Point2D( xr + CX + Math.cos( theta * Math.PI / 180 ) * R * 0.8, -o + CY + Math.sin( theta * Math.PI / 180 ) * R * 0.8 ),
    16
  );
  pop();
}
function drawEyes() {
  push();
  stroke( 0 );
  strokeWeight( 30 );
  noFill();
  let yy = CY * 0.85;
  let r = R * 0.2;
  // Left eye
  let xx = CX * 0.35;
  let o = Math.cos( frameCount ) * R * 0.015;
  let xr = Math.random() * R * 0.02;
  drawQuadraticBezier(
    new Point2D( xr + xx - r, o+yy + r * 0.5 ),
    new Point2D( xr + xx, yy + r ),
    new Point2D( xr + xx + r, o+yy ),
    16
  );

  // Right eye
  xx = CX * 1.45;
  yy += R * 0.025;
  xr = Math.random() * R * 0.02;
  drawQuadraticBezier(
    new Point2D( xr + xx - r, o+yy ),
    new Point2D( xr + xx, yy + r ),
    new Point2D( xr + xx + r, o+yy + r * 0.5 ),
    16
  );
  pop();
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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

function saveImage( ext = "png" ) {
  save(`${ getName() }.${ ext }`);
}

function saveConfig() {
  saveJSON( P, `${getName()}-config.json` );
}

function downloadOutput() {
  saveImage();
  saveConfig();
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
