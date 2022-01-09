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
    blockSize: 9*MULT,
    sinMultiplier: 3,
    aniCurveHandles: [[ 1, 0 ],[ 0, 0 ]],
    // aniCurveHandles: [[ 1, 0 ],[ 0, 1 ]],
    // aniCurveHandles: [[ .42, 0 ],[ .58, 1 ]],
  },
];

// PARAMETERS IN USE
const P = PARAMS[ PARAMS.length - 2 ];

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
  
  noStroke();
  fill( 255 );
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}


const aniCurve = [
  new Point( 0, 0 ),
  new Point( P.aniCurveHandles[0][0], P.aniCurveHandles[0][1] ),
  new Point( P.aniCurveHandles[1][0], P.aniCurveHandles[1][1] ),
  new Point( 1, 1 ),
];

let x = 0;
let lastPosition;
let T = 0;
const STEPS = 60;
const STEPSIZE = P.width / STEPS;

function draw() {
  background(0);

  // T = (( frameCount % STEPS ) / STEPS );
  const max = Math.min(
    ( frameCount * 0.5 ) * P.blockSize,
    P.height
  );

  for( let y = 0; y < max; y += P.blockSize ) {
    T = 0.5 + 0.5 * sin( (frameCount + y) * P.sinMultiplier );
    // T = 0.5 + ((frameCount*P.sinMultiplier) + y - P.height * 0.5) / P.height;

    let aniTiming = cubicBezier(aniCurve[0], aniCurve[1], aniCurve[2], aniCurve[3], T);

    x = aniTiming.y * (P.width - P.blockSize);
    x %= P.width;

    rect( y, x, P.blockSize, P.blockSize );
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
