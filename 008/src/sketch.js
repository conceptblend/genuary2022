// PARAMETER SETS
const MULT = 2;
const PARAMS = [
  {
    name: "set one",
    seed: "hello world",
    width: 540*MULT,
    height: 540*MULT,
    fps: 24,
    duration: 24 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !false,
    isAnimated: !false,
    blockSize: 27*MULT,
    sinMultiplier: 12,
    // aniCurveHandles: [[ 1, 0 ],[ 0, 0 ]],
    // aniCurveHandles: [[ 1, 0 ],[ 0, 1 ]],
    aniCurveHandles: [[ .42, 0 ],[ .58, 1 ]],
  },
  {
    name: "set one",
    seed: "hello world",
    width: 540*MULT,
    height: 540*MULT,
    fps: 24,
    duration: 24 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: !false,
    blockSize: 4*MULT,
    sinMultiplier: 3,
    aniCurveHandles: [[ 1, 0 ],[ 0, 0 ]],
    // aniCurveHandles: [[ 1, 0 ],[ 0, 1 ]],
    // aniCurveHandles: [[ .42, 0 ],[ .58, 1 ]],
  },
  {
    name: "box-topples",
    seed: "hello world",
    width: 540*MULT,
    height: 540*MULT,
    fps: 16,
    duration: 721, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !true,
    isAnimated: true,
    blockSize: 27*MULT,
    sinMultiplier: 3,
    aniCurveHandles: [[ 0, .95 ],[ .92, .69 ]],
    // aniCurveHandles: [[ 1, 0 ],[ 0, 0 ]],
  },
];

// PARAMETERS IN USE
const P = PARAMS[ PARAMS.length - 1 ];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

// DRAWING
const aniCurve = [
  new Point( 0, 0 ),
  new Point( P.aniCurveHandles[0][0], P.aniCurveHandles[0][1] ),
  new Point( P.aniCurveHandles[1][0], P.aniCurveHandles[1][1] ),
  new Point( 1, 1 ),
];

const MIN_W = P.width * 0.1;
const MAX_W = P.width * 0.9;

function setup() {
  createCanvas( P.width, P.height );
  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  noStroke();
  fill( 255 );
  // fill( 0 );
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}

function mapToScale( val, aLow, aHigh, bLow, bHigh ) {
  return ( val / (aHigh - aLow) * (bHigh - bLow )) + bLow;
}

function draw() {
  background( 0, 0, 0, 20 );
  // background( 255, 255, 255, 20 );

  let x = 0,
      T = 0;

  /** STAGGERED START */
  let max = Math.min(
    ( frameCount * 0.5 ) * P.blockSize,
    P.height
  );
  /** UNIFORM START */
  // let max = P.height;

  for( let y = P.blockSize; y < max - P.blockSize; y += P.blockSize ) {
    T = 0.5 + 0.5 * cos( (frameCount + y) * P.sinMultiplier );

    let aniTiming = cubicBezier(aniCurve[0], aniCurve[1], aniCurve[2], aniCurve[3], T);

    x = MIN_W + aniTiming.y * ( MAX_W - P.blockSize - MIN_W );    

    let d = mapToScale( aniTiming.y, 0, 1, P.blockSize*.25, P.blockSize );
    // rect( x, y, d, d ); // DYNAMIC SIZE
    circle( x+P.blockSize*0.5, y+P.blockSize*0.5, d, d ); // DYNAMIC SIZE
    // rect( x, y, P.blockSize, P.blockSize ); // STATIC SIZE
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
      saveConfig();
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
