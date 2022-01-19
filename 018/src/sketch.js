// PARAMETER SETS
const PARAMS = [
  {
    name: "vhs-glitch",
    seed: "beta was better",
    width: 540,
    height: 540,
    fps: 15,
    duration: 540, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !true,
    isAnimated: true,
    renderAsVector: !true,
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


let img;

function preload() {
  img = loadImage('./imgs/toshiba.jpg');
}

function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.height, P.renderAsVector ? SVG : P2D );

  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  noStroke();
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}


function draw() {
  background(0);

  //
  // BEWARE:
  // THERE IS NOTHING EFFICIENT ABOUT WHAT FOLLOWS!
  //

  image( img, (P.width-img.width)*0.5, (P.height-img.height)*0.5 );

  loadPixels();

  let index = 0,
      index2 = 0,
      scanlineMod = 0,
      d = pixelDensity();

  for( let y = 0; y < P.height; y++ ) {
    scanlineMod = y % 2 === 0 ? 0.5 : 1;
    let delta = Math.min(
      7,
      Math.max( 0, ( 4 * (frameCount + 721) - y ) % P.height )
    );

    let offset = /*Math.pow(*/ 2*((frameCount + y) % 3 + delta)/*, 2 )*/;

    for( let x = 0; x < P.width; x++ ) {
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          // loop over
          index = 4 * ((y * d + j) * P.width * d + (x * d + i));
          index2 = 4 * ((y * d + j) * P.width * d + (( x + offset ) * d + i));
          pixels[index] = pixels[index2] * scanlineMod;
          pixels[index+1] = pixels[index+1] * scanlineMod;
          pixels[index+2] = pixels[index2+2] * scanlineMod;
          pixels[index+3] = pixels[index2+3];
        }
      }
    }
  }

  updatePixels();

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
