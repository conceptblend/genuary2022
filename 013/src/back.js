const PIXELS = {
  RECT: 0x01,
  DOT: 0x02,
  TRIANGLE: 0x03,
  QUAD: 0x04,
  LINE: 0x05,
};

// const P = {
//   seed: 0xDEADBEEFE,
//   size: 540 * 0.5, // 1080 // Use half of the output width you want
//   steps: 20,
//   noiseIncrement: 0.045,
//   levels: 16, // 16
//   fps: 10,
//   periodLength: 361,
// };

// const P = {
//   seed: "sizzle", // dog,
//   size: 540 * 0.5, // 1080 // Use half of the output width you want
//   steps: 20,
//   noiseIncrement: 0.045,
//   levels: 16, // 16
//   fps: 10,
//   periodLength: 361,
// };

// const P = {
//   seed: "bang",
//   size: 540 * 0.5, // 1080 // Use half of the output width you want
//   steps: 30,
//   noiseIncrement: 0.045,
//   levels: 16, // 16
//   fps: 10,
//   periodLength: 361,
//   pixels: PIXELS.QUAD,
//   palette: [
//     [240, 192, 89], // Ronchi
//     [240, 107, 55], // Flamingo
//     [73-25, 96-25, 130+25], // Blue Bayoux
//   ]
// };

const P = {
  seed: "bangbangbang",
  size: 540 * 0.5, // 1080 // Use half of the output width you want
  steps: 30,
  noiseIncrement: 0.045,
  levels: 16, // 16
  fps: 10,
  periodLength: 361,
  pixels: PIXELS.QUAD,
  palette: [
    [0, 0, 0], // Ronchi
    [48, 48, 48], // Flamingo
    [255, 255, 255], // Blue Bayoux
  ]
};

const SEED = P.seed;
const SIZE = P.size;
const SIZEx2 = SIZE * 2;
const STEPS = P.steps;
const STEP_SIZE = SIZE / STEPS;
const STEP_SIZE_HALF = STEP_SIZE * 0.5;
const NOISE_INC = P.noiseIncrement;
const NOISE_INC_Z = NOISE_INC * 0.5;
const LEVELS = P.levels;
const PIXEL_METHOD = P.pixels || PIXELS.RECT;

// VIDEO
const EXPORTVIDEO = true; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.periodLength;
let cnvsrecorder;
let isRecording = false;

// const rawPalette = [
//   [255, 255, 255], // White
//   [240, 192, 89], // Ronchi
//   [242, 164, 85], // Sandy Brown
//   [240, 107, 55], // Flamingo
//   [73, 96, 130], // Blue Bayoux
// ];
// const rawPalette = [
//   [255, 255, 255], // White
//   [0, 0, 0], // Black
//   // [242, 164, 85], // Sandy Brown
//   [240, 107, 55], // Flamingo
//   [0, 0, 0], // Black
//   [73, 96, 130], // Blue Bayoux
// ];


// const rawPalette = [
//   [214, 206, 190], // Sisal
//   [159, 65, 75], // Apple Blossom
//   [244, 239, 229], // Spring wood
//   [33, 131, 154], // Jelly bean
// ];

// const rawPalette = [
//   [0, 0, 0], // Sisal
//   [32, 32, 32], // Apple Blossom
//   [255, 255, 255], // Apple Blossom
//   [33, 131, 154], // Jelly bean
// ];

const rawPalette = [
  // [0, 0, 0], // Black
  [244, 239, 229], // Spring wood
  [159, 65, 75], // Apple Blossom
  [0, 0, 0], // Black
  [33, 131, 154], // Jelly bean
];


let palette = [];

function setup() {
  createCanvas(SIZE*2, SIZE*2);
  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  noStroke();
  
  noiseSeed( SEED );
  
  // Turn the palette arrays into p5.colors
  if ( P.palette ) {
    P.palette.forEach( c => palette.push( color( c )));  
  } else {
    rawPalette.forEach( c => palette.push( color( c )));
  }
  
  frameRate( FPS );
  // noLoop();
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
  
  for( let j=0; j<STEPS; j++ ) {
    noiseX = 0;
    jj = j * STEP_SIZE;
    jj2 = SIZEx2 - (1 + j) * STEP_SIZE;
    
    // let ny = noiseY * sin( frameCount*0.1 );
    for( let i=0; i<STEPS; i++ ) {
      c = 0;//noise( noiseX, noiseY, noiseZ );
      // let nx = noiseX * cos( frameCount*0.1 );
      // c2 = noise( 0.47 + noiseX + nx, 1.893 + noiseY + ny, 0.773 + noiseZ );
      c2 = noise( 0.47 + noiseX, 1.893 + noiseY, 0.773 + noiseZ );
      
      // drawPixel( i * STEP_SIZE,                j * STEP_SIZE,                { c1: c, c2 }, METHOD );
      // drawPixel( SIZEx2 - (1 + i) * STEP_SIZE, j * STEP_SIZE,                { c1: c, c2 }, METHOD );
      // drawPixel( SIZEx2 - (1 + i) * STEP_SIZE, SIZEx2 - (1 + j) * STEP_SIZE, { c1: c, c2 }, METHOD );
      // drawPixel( i * STEP_SIZE,                SIZEx2 - (1 + j) * STEP_SIZE, { c1: c, c2 }, METHOD );

      /* OPTIMIZATIONS */
      
      cc = { c1: c, c2 };
      
      ii = i * STEP_SIZE;
      ii2 = SIZEx2 - (1 + i) * STEP_SIZE;
      
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
    if ( !isRecording ) {
      cnvsrecorder = new CanvasRecorder( FPS );
      cnvsrecorder.start();
      isRecording = true;
      console.log( "Recording..." );
    }
		// Example to end automatically after 361 frames to get a full loop
    if ( angle > DURATION ) {
      cnvsrecorder.stop( `${getName()}` );
      noLoop();
      console.log( "Done." );
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

  // fill( c1 * 255, 192, 128 + c2 * 63 );
  // fill( 128 + c2 * 64, c1 * 255, 255 );
  // fill( lerpColor( color(palette[0]), color(palette[3]), c1))
  // fill ( palette[ Math.floor( c1 * palette.length ) / palette.length ] );
  
  let ct = c2 * palette.length;
  let cc = lerpColor(
    palette[ Math.floor( ct ) ],
    palette[ Math.min( Math.ceil( ct ), palette.length-1) ],
    ct % 1);
  
  fill( cc );
  
  switch ( PIXEL_METHOD ) {
    case PIXELS.DOT:
      ellipse( x + STEP_SIZE_HALF, y + STEP_SIZE_HALF, STEP_SIZE-2 );
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

function keyPressed() {
  if (keyCode === 32) {
    if( isLooping() ) {
      noLoop();
    } else {
      loop();
    }
  }
}

function _lerp( a, b, t ) {
  return a * (1 - t) + b * t;
}

function getName() {
  let tmp = P;
  
  // ugly method for inserting the palette but usually makes the 
  // bas64 value too long and extends the full URL length beyond 
  // the 255 char limit for createObjectURL.
  // tmp.palette = palette.map(c => p5ColorToHex( c ) );
  
  let params = window.btoa( JSON.stringify( tmp ));
  return `EthClds-${params}-${new Date().toISOString()}`;
}


function colorToHex( color ) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
}

function rgbToHex( rgb ) {
  return "#" + colorToHex(rgb[0]) + colorToHex(rgb[1]) + colorToHex(rgb[2]);
}
function p5ColorToHex( c ) {
  return rgbToHex([
    red(c),
    green(c),
    blue(c)
  ]);
}

