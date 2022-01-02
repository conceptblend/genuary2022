// PARAMETER SETS
const PARAMS = [
  {
    name: "genuary-2022-002-A",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 30, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    useNoise: !true,
    scaleFactor: 2,
    ditherType: Ditherer.typeEnum.DISPERSED,
  },
  {
    name: "genuary-2022-002-B",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 30, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    useNoise: true,
    scaleFactor: 1,
    ditherType: Ditherer.typeEnum.BAYERISH2,
  },
  {
    name: "genuary-2022-002-C",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 30, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    useNoise: true,
    scaleFactor: 4,
    ditherType: Ditherer.typeEnum.BAYERISH2,
  },
  {
    name: "genuary-2022-002-D",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 30, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    useNoise: !true,
    scaleFactor: 1,
    ditherType: Ditherer.typeEnum.RANDOM,
  },
];

// PARAMETERS IN USE
const P = PARAMS[ 2 ];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

let ditherer = new Ditherer( P.ditherType, P.scaleFactor, P.useNoise );

function setup() {
  createCanvas( P.width, P.height );
  pixelDensity( 1 );
  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  noStroke();
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  noLoop();
}


function draw() {
  background( 255 );

  // DO YOUR DRAWING HERE!
  noStroke();
  const SIZE = P.width * 0.1;
  for ( let i = 1024; i>0; i-- ) {
    fill( Math.floor( Math.random() * 255 ) );
    // rect( Math.random() * P.width, Math.random() * P.height, SIZE, SIZE );
    circle( Math.random() * P.width, Math.random() * P.height, SIZE );
  }

  ditherer.dither();

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
