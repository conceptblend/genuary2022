// PARAMETER SETS
const PARAMS = [
  {
    name: "notfidenza",
    seed: "this is not a fidenza",
    width: 540,
    height: 540,
    exportVideo: !true,
    exportImages: !true,
    animated: !true,
    fps: 4,
    duration: 4 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    numSegmentsPerLine: 16,
    lineSegmentLength: 16,
    gridSize: 24,
    b: 0,
  },
];

// PARAMETERS IN USE
const P = PARAMS[0];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

const LINESEGMENTLENGTH = P.lineSegmentLength ?? P.width / 64;
const GRIDSIZE = P.gridSize ?? 20;
const GRIDSTEP = P.width / GRIDSIZE;

const cStrokeBase = {
  hue: 0,
  saturation: 80,
  brightness: 30
}; // HSB( 360, 100, 100 );

const cFillBase = {
  hue: 0,
  saturation: 40,
  brightness: 80
}; // HSB( 360, 100, 100 );

let cStroke;
let cFills = [];


function drawPath1( points ) {
  stroke( 255 );
  noFill();
  beginShape();
  points.forEach( p => vertex( p.x, p.y ) );
  endShape();
}
function drawPath( points ) {
  // stroke( Math.floor( Math.random() * 255 ) );
  stroke( cFills[ Math.floor( Math.random() * cFills.length ) ]);
  noFill();

  for( let n = 1, len = points.length; n < len; n++ ) {
    strokeWeight( Math.floor( Math.random() * 8 ) );
    line( points[ n-1 ].x, points[ n-1 ].y, points[ n ].x, points[ n ].y );
  }
}

let paths = [];

function setup() {
  createCanvas( P.width, P.height );
  angleMode( DEGREES );
  // colorMode( RGB, 255 );
  colorMode( HSB, 360, 100, 100, 1 );

  strokeCap( ROUND );
  // stroke( cStroke );
  // strokeWeight( 2 );
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  cStroke = color( cStrokeBase.hue, cStrokeBase.saturation, cStrokeBase.brightness );
  
  let n = 16;
  let start = Math.floor( Math.random() * 360 );
  while ( n-- > 0 ) {
    cFills.push(
      color( newHue( start, 90 ), cFillBase.saturation, cFillBase.brightness )
    );
  }

  if ( !EXPORTVIDEO && !P.animated ) noLoop();
}

function buildAPath( sx, sy, steps ) {
  let _path = new Path( drawPath );
  steps = steps ?? 5; // why 5? I dunno.

  let stepVec = createVector( 1, 0 ).mult( LINESEGMENTLENGTH );
  let prev;

  for( let n=0; n<steps; n++ ) {
    if (n === 0 ) {
      _path.addPoint( createVector( sx, sy ) );
    } else {
      prev = _path.points[ 0 ]; // 0 because I'm unshifting to the "top" of the array
      let val = getFlowFieldValue( prev.x, prev.y ) * 360;
      stepVec.setHeading( val * Math.PI / 180 ); // Super annoying. Only implemented in RADIANS. Log a bug?
      _path.addPoint( p5.Vector.add( prev, stepVec ) );
    }
  }
  return _path;
}


function draw() {
  background( 0 );

  paths = [];

  for( let y = 1; y < GRIDSIZE; y++ ) {
    for( let x = 1; x < GRIDSIZE; x++ ) {
      paths.push( buildAPath( x * GRIDSTEP, y * GRIDSTEP, P.numSegmentsPerLine ) );
    }
  }

  // flowField( P.width, P.height );
  paths.forEach( path => path.draw() );

  if ( P.animated && P.exportImages ) {
    saveImage();
  }

  if ( EXPORTVIDEO ) {
    if ( !isRecording ) {
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

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function getName() {
  // Encode the parameters into the filename
  // let params = window.btoa(JSON.stringify(P));
  let params = MD5( JSON.stringify(P) );
  return `${P.name}-${params}-${new Date().toISOString()}`;
}

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

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



function flowField( w, h ) {
  const cellSize = 8;
  const rows = h / cellSize;
  const cols = w / cellSize;
  const inc = 0.001;
  let xOff = 0,
      yOff = 0,
      zOff = 8 * frameCount * inc;

  noStroke();
  for (let y = 0; y < rows; y++) {
    yOff = y * inc;
    xOff = 0;
    for (let x = 0; x < cols; x++ ) {
      xOff += inc;
      let c = noise( xOff, yOff, zOff );
      fill( c * 255 );
      rect( x * cellSize, y * cellSize, cellSize, cellSize )
    }
  }
}

function getFlowFieldValue( x, y ) {
  // const cellSize = 8;
  const inc = 0.005;
  let xOff = x * inc,
      yOff = y * inc,
      zOff = 8 * (frameCount + 1) * inc;

  return noise( xOff, yOff, zOff );
}

function newHue( startAngle = 0, range = 360 ) {
  return ( startAngle + Math.floor( Math.random() * range ) ) % 360;
}