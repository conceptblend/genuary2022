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
    src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
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
    src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
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
    src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
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
    src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
  },
  {
    name: "genuary-2022-002-E",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 30, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    useNoise: !true,
    scaleFactor: 2,
    ditherType: Ditherer.typeEnum.RANDOM,
    src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
  },
  {
    name: "genuary-2022-002-F",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 30, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    useNoise: true,
    scaleFactor: 2,
    ditherType: Ditherer.typeEnum.SEQUENTIAL,
    src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
  },
  {
    name: "genuary-2022-002-G",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 30, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    useNoise: !true,
    scaleFactor: 4,
    ditherType: Ditherer.typeEnum.SEQUENTIAL,
    src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
  },
  {
    name: "genuary-2022-002-ALT",
    seed: "ditherers be dithering",
    width: 540*2,
    height: 540*2,
    fps: 10,
    duration: 10 * 6, // frameCount (fps * seconds)
    useNoise: !true,
    scaleFactor: 4,
    ditherType: Ditherer.typeEnum.BAYERISH2,
    src: null,
    exportVideo: !true,
    // src: 'imgs/Rene-Magritte-The-Treachery-of-Images-This-is-Not-a-Pipe-1929--scaled-1080.jpg',
  },
];

// PARAMETERS IN USE
const P = PARAMS[ PARAMS.length-1 ];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

let ditherer = new Ditherer( P.ditherType, P.scaleFactor, P.useNoise );
let img;

function preload() {
  if ( P.src ) img = loadImage( P.src );
}

function setup() {
  createCanvas( P.width, P.height );
  pixelDensity( 1 );
  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  noStroke();
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !!!P.exportVideo ) noLoop();
}


function draw() {
  background( 255 );

  if ( img ) {
    image( img, 0, (P.height - img.height) * 0.5 );
  } else {
    flowField( P.width, P.height );
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

function flowField( w, h ) {
  const cellSize = 4;
  const rows = h / cellSize;
  const cols = w / cellSize;
  const inc = 0.01;
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

