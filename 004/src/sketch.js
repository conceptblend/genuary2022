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
    segmentDensity: 0.71,
    gridSize: 16,
    paletteStart: 162,//255,//162,
    paletteSize: 64,
    paletteRange: 120,
    strokeMax: 24,
  },
  {
    name: "notfidenza",
    seed: "this is not a fidenza",
    width: 540*2,
    height: 540*2,
    exportVideo: !true,
    exportImages: !true,
    animated: !true,
    fps: 4,
    duration: 4 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    numSegmentsPerLine: 24*2,
    lineSegmentLength: 24*2,
    segmentDensity: 0.2,
    gridSize: 24,
    paletteStart: 162,//255,//162,
    paletteSize: 24,
    paletteRange: 120,
    strokeMax: 12*2,
    noiseStart: 73.1415926, // 285937
    noiseIncrement: 0.001,
  },
  {
    name: "notfidenza2",
    seed: "this is not a fidenza",
    width: 540*2,
    height: 540*2,
    exportVideo: !true,
    exportImages: !true,
    animated: !true,
    fps: 4,
    duration: 4 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    numSegmentsPerLine: 24*2,
    lineSegmentLength: 24*2,
    segmentDensity: 0.55,
    gridSize: 16,
    paletteStart: 32,//255,//162,
    paletteSize: 8,
    paletteRange: 180,
    strokeMax: 12*3,
    noiseStart: 87,//3.1415926, // 285937
    noiseIncrement: 0.001,
    continuousSegmentColour: !true,
  },
  {
    "name": "notfidenza-smushy",
    "seed": "this is not a fidenza",
    "width": 1080,
    "height": 1080,
    "exportVideo": false,
    "exportImages": false,
    "animated": false,
    "fps": 4,
    "duration": 40,
    "numSegmentsPerLine": 24,
    "lineSegmentLength": 16,
    "segmentDensity": 0.15,
    "gridSize": 32,
    "paletteStart": 65,
    "paletteSize": 8,
    "paletteRange": 180,
    "strokeMax": 36,
    "noiseStart": 87,
    "noiseIncrement": 0.008,
    "continuousSegmentColour": false,
    blackAndWhiteMode: true,
  }  
];

/**
 * 0.00001, -> straight lines?!?
 * 0.0001,  -> bowed lines
 */

// PARAMETERS IN USE
const P = PARAMS[ PARAMS.length - 2 ];

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

// BONUS: B&W EDITION
const cFillBase = P.blackAndWhiteMode ?
  {
    hue: 0,
    saturation: 0,
    brightness: 100
  }  // HSB( 360, 100, 100 );
  :
  {
    hue: 0,
    saturation: 60,
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
//
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
function drawPath2( points ) {
  // stroke( Math.floor( Math.random() * 255 ) );
  stroke( cFills[ Math.floor( Math.random() * cFills.length ) ]);
  noFill();

  // for( let n = 1, len = points.length; n < len; n++ ) {
  let n = 1, len = points.length;
  while ( n < len ) {

    if ( Math.random() < P.segmentDensity ) {
      let s = Math.floor( 1 + Math.random() * P.strokeMax );
      let l = Math.floor( 2 + Math.random() * 5 );
      push();
      stroke( 0, 80, 30 );
      strokeWeight( s+2 );
      beginShape();
      vertex(points[ n-1 ].x, points[ n-1 ].y);
      for( let ss = 0; ss < l && (n+ss) < len; ss++ ) {
        // line( points[ n-1+ss ].x, points[ n-1+ss ].y, points[ n+ss ].x, points[ n+ss ].y );
        vertex( points[ n+ss ].x, points[ n+ss ].y );
      }
      endShape();
      pop();

      // stroke( cFills[ Math.floor( Math.random() * cFills.length ) ]);
      strokeWeight( s );
      beginShape();
      vertex(points[ n-1 ].x, points[ n-1 ].y);
      for( ss = 0; ss < l && (n+ss) < len; ss++ ) {
        // line( points[ n-1+ss ].x, points[ n-1+ss ].y, points[ n+ss ].x, points[ n+ss ].y );
        vertex( points[ n+ss ].x, points[ n+ss ].y );
      }
      endShape();
    }
    n += ss;
  }
}
//
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//
function drawPath( points ) {
  // stroke( Math.floor( Math.random() * 255 ) );
  P.continuousSegmentColour && stroke( cFills[ Math.floor( Math.random() * cFills.length ) ]);
  noFill();

  let n = 1,
      len = points.length,
      offset = 4,
      ss = 0;
  while ( n < len ) {

    if ( Math.random() < P.segmentDensity ) {
      let s = Math.floor( 2 + Math.random() * P.strokeMax );
      let l = Math.floor( 2 + Math.random() * 5 );
      
      strokeWeight( s );

      push();
      P.blackAndWhiteMode ? stroke( 0, 0, 0 ) : stroke( 0, 80, 30 );
      beginShape();
      curveVertex(points[ n-1 ].x + offset, points[ n-1 ].y + offset); // repeat the start point
      curveVertex(points[ n-1 ].x + offset, points[ n-1 ].y + offset);
      for( ss = 0; ss < l && (n+ss) < len; ss++ ) {
        curveVertex( points[ n + ss ].x, points[ n + ss ].y + offset);
      }
      curveVertex( points[ n + ss - 1 ].x + offset, points[ n + ss - 1 ].y + offset);// repeat the last point
      endShape();
      pop();

      !!!P.continuousSegmentColour && stroke( cFills[ Math.floor( Math.random() * cFills.length ) ]);

      beginShape();
      curveVertex(points[ n-1 ].x, points[ n-1 ].y); // repeat the start point
      curveVertex(points[ n-1 ].x, points[ n-1 ].y);
      for( ss = 0; ss < l && (n+ss) < len; ss++ ) {
        curveVertex( points[ n + ss ].x, points[ n + ss ].y );
      }
      curveVertex( points[ n + ss - 1 ].x, points[ n + ss - 1 ].y );// repeat the last point
      endShape();
    }
    n += ss;
  }
}
//
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//

let paths = [];

function setup() {
  createCanvas( P.width, P.height );
  angleMode( DEGREES );
  colorMode( HSB, 360, 100, 100, 1 );

  strokeCap( SQUARE );
  // strokeCap( ROUND );
  // strokeCap( PROJECT );
  strokeJoin( ROUND );
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  cStroke = color( cStrokeBase.hue, cStrokeBase.saturation, cStrokeBase.brightness );
  
  let n = P.paletteSize ?? 16;
  let start = P.paletteStart ?? Math.floor( Math.random() * 360 );
  while ( n-- > 0 ) {
    cFills.push(
      color( newHue( start, P.paletteRange ), cFillBase.saturation, cFillBase.brightness )
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
      let val = getFlowFieldValue( prev.x, prev.y, P.noiseIncrement ) * 360;
      stepVec.setHeading( val * Math.PI / 180 ); // Super annoying. Only implemented in RADIANS. Log a bug?
      _path.addPoint( p5.Vector.add( prev, stepVec ) );
    }
  }
  return _path;
}


function draw() {
  // background( 0, 80, 70 );
  background( 0, 80, 10 );

  paths = [];

  for( let y = 0; y < GRIDSIZE + 1; y++ ) {
    for( let x = 0; x < GRIDSIZE + 1; x++ ) {
      paths.push( buildAPath( x * GRIDSTEP, y * GRIDSTEP, P.numSegmentsPerLine ) );
    }
  }

  paths.reverse().forEach( path => path.draw() );

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

function getFlowFieldValue( x, y, _inc ) {
  // const cellSize = 8;
  const inc = _inc ?? 0.005;
  let xOff = x * inc,
      yOff = y * inc,
      zOff = P.noiseStart + 8 * (frameCount + 1) * inc;

  return noise( xOff, yOff, zOff );
}

function newHue( startAngle = 0, range = 360 ) {
  return ( startAngle + Math.floor( Math.random() * range ) ) % 360;
}