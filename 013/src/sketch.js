const PIXELS = {
  RECT: 0x01,
  DOT: 0x02,
  TRIANGLE: 0x03,
  QUAD: 0x04,
  LINE: 0x05,
};

// PARAMETER SETS
const PARAMS = [
  {
    name: "800x80-1",
    seed: "hello world",
    width: 800,
    height: 80,
    fps: 10,
    duration: 360, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: true,
    isAnimated: true,
    renderAsVector: !true,
    steps: 30,
    noiseIncrement: 0.045,
    levels: 16, // 16
    blockSize: 10,
    pixels: PIXELS.RECT,
    useFullSquareCanvas: !true,
    palette: [
      [0, 0, 0], // Ronchi
      [48, 48, 48], // Flamingo
      [255, 255, 255], // Blue Bayoux
    ],
  },
  {
    name: "800x80-2",
    seed: "wooohoooo",
    width: 800,
    height: 80,
    fps: 10,
    duration: 360, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: true,
    isAnimated: true,
    renderAsVector: !true,
    steps: 30,
    noiseIncrement: 0.045,
    levels: 16, // 16
    blockSize: 10,
    pixels: PIXELS.RECT,
    useFullSquareCanvas: !true,
    palette: [
      [255, 255, 255], // White
      [0, 0, 0], // Black
      // [242, 164, 85], // Sandy Brown
      [240, 107, 55], // Flamingo
      [0, 0, 0], // Black
      [73, 96, 130], // Blue Bayoux
    
    ],
  },
];

// const rawPalette = [
//   [255, 255, 255], // White
//   [0, 0, 0], // Black
//   // [242, 164, 85], // Sandy Brown
//   [240, 107, 55], // Flamingo
//   [0, 0, 0], // Black
//   [73, 96, 130], // Blue Bayoux
// ];

// PARAMETERS IN USE
const P = PARAMS[ PARAMS.length - 2 ];

const STEPS = P.width / P.blockSize;
const STEP_SIZE = P.blockSize; //SIZE / P.steps;
const STEP_SIZE_HALF = STEP_SIZE * 0.5;
const NOISE_INC = P.noiseIncrement;
const NOISE_INC_Z = NOISE_INC * 0.5;
const LEVELS = P.levels;
const PIXEL_METHOD = P.pixels || PIXELS.RECT;

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

let palette = [];

function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.useFullSquareCanvas ? P.width : P.height, P.renderAsVector ? SVG : P2D );
  // pixelDensity( 1 );

  angleMode( DEGREES );
  colorMode( RGB, 255 );

  noStroke();

  Math.seedrandom( P.seed );

  // Turn the palette arrays into p5.colors
  if ( P.palette ) {
    P.palette.forEach( c => palette.push( color( c )));
  } else {
    rawPalette.forEach( c => palette.push( color( c )));
  }

  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}

const METHODS = {
  BLEND: 0x01,
  SMOOTH: 0x02,
  STEP: 0x03,
};

const METHOD = METHODS.STEP;

let noiseX = 0,
    noiseY = 0,
    noiseZ = 0,
    noiseY_offset = 0,
    angle = 0;

function draw() {
  background( 0 );
  noiseY = 0;// + frameCount * 0.017;
  noiseZ = 320 * ( cos( angle ) ) * NOISE_INC_Z;

  let ii, jj, ii2, jj2;
  let c, c2, cc;

  let OFFSET_Y = P.useFullSquareCanvas ? (P.width - P.height) * 0.5 : 0;

  for( let j=0; j < P.height / STEP_SIZE; j++ ) {
    noiseX = 0;
    // jj = j * STEP_SIZE;
    jj = j * STEP_SIZE + OFFSET_Y;
    jj2 = P.height - (1 + j) * STEP_SIZE + OFFSET_Y;

    // let ny = noiseY * sin( frameCount*0.1 );
    for( let i=0; i < P.width / STEP_SIZE; i++ ) {
      c = 0;
      c2 = noise( 0.47 + noiseX, 1.893 + noiseY, 0.773 + noiseZ );

      /* OPTIMIZATIONS */

      cc = { c1: c, c2 };

      // ii = i * STEP_SIZE;
      ii = i * STEP_SIZE;
      ii2 = P.width - (1 + i) * STEP_SIZE;

      drawPixel( ii,  jj,  cc, METHOD );
      drawPixel( ii2, jj,  cc, METHOD );
      drawPixel( ii2, jj2, cc, METHOD );
      drawPixel( ii,  jj2, cc, METHOD );

      /* END OPTIMIZATIONS */

      noiseX += NOISE_INC;
    }
    noiseY += NOISE_INC;
  }
  angle++;

  if ( EXPORTVIDEO ) {
    if ( P.renderAsVector ) throw new Error("Cannot export video when rendering as Vector");
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

function drawPixel( x, y, cValues, method ) {
  let c1, c2;

  method = method ?? METHOD;

  switch ( method ) {
    case METHODS.STEP:

      c1 = Math.floor( cValues.c1 * LEVELS ) / LEVELS;
      c2 = Math.round( cValues.c2 * LEVELS ) / LEVELS;
      break;

    case METHODS.SMOOTH:
      c1 = _lerp( cValues.c1, cValues.c2, 0.2 );
      c2 = _lerp( cValues.c2, cValues.c1, 0.2 );

      c1 = Math.floor( c1 * LEVELS ) / LEVELS;
      c2 = Math.round( c2 * LEVELS ) / LEVELS;
      break;

    case METHODS.BLEND:
    default:
      c1 = cValues.c1;
      c2 = cValues.c2;
      break;
  }

  let ct = c2 * palette.length;
  let cc = lerpColor(
    palette[ Math.floor( ct ) ],
    palette[ Math.min( Math.ceil( ct ), palette.length-1) ],
    ct % 1);

  fill( cc );

  switch ( PIXEL_METHOD ) {
    case PIXELS.DOT:
      circle( x + STEP_SIZE_HALF, y + STEP_SIZE_HALF, STEP_SIZE-2 );
      break;
    case PIXELS.TRIANGLE:
      triangle( x, y, x, y+STEP_SIZE, x+STEP_SIZE, y+STEP_SIZE );
      break;
    case PIXELS.QUAD:
      quad( x, y, x+STEP_SIZE, y+1, x+STEP_SIZE-1, y+STEP_SIZE, x, y+STEP_SIZE );
      break;
    case PIXELS.LINE:
      rect( x+STEP_SIZE_HALF-2, y, 4, STEP_SIZE );
      break;
    case PIXELS.RECT:
    default:
      rect( x+1, y+1, STEP_SIZE-2, STEP_SIZE-2 );
      break;
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

function saveImage( ext = 'jpg' ) {
  save(`${ getName() }.${ ext }`);
}

function saveConfig() {
  saveJSON( P, `${getName()}-config.json` );
}

function downloadOutput() {
  saveImage( P.renderAsVector ? 'svg' : 'jpg' );
  saveConfig();
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function _lerp( a, b, t ) {
  return a * (1 - t) + b * t;
}

function colorToHex( color ) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
}

function rgbToHex( rgb ) {
  return "#" + colorToHex(rgb[0]) + colorToHex(rgb[1]) + colorToHex(rgb[2]);
}
