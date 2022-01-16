const GRIDSIZE = 108;
const BLOCKSIZE = Math.floor( 1080 / GRIDSIZE );

// PARAMETER SETS
const PARAMS = [
  {
    name: "gradients-gone-wrong",
    seed: "a freaking explosion of colour",
    gridSize: GRIDSIZE,
    blockSize: BLOCKSIZE,
    width: GRIDSIZE*BLOCKSIZE,
    height: GRIDSIZE*BLOCKSIZE,
    fps: 30,
    duration: 30*5, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !true,
    exportFrames: true,
    isAnimated: true,
    renderAsVector: !true,
    aniCurveHandles: [[ 0, 0.95 ],[ 0.92, 0.69 ]],
    useGrayscale: !true,
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


function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.height, P.renderAsVector ? SVG : P2D );

  angleMode( DEGREES );
  colorMode( HSB );
  pixelDensity( 1 );
  
  noStroke();
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}


function draw() {
  background( 0 );

  let c;
    
  for (let y = 0; y < GRIDSIZE; y++ ) {
    let offset = GRIDSIZE * noise( 0.23, y * 0.6, frameCount * 0.05 );
    for (let x = 0; x < GRIDSIZE; x++ ) {
      c = mixColor("bezier", (x + offset) % GRIDSIZE, y, 0, 0, GRIDSIZE);
      fill( c.h, c.s, c.b );
      rect( x*BLOCKSIZE, y*BLOCKSIZE, BLOCKSIZE, BLOCKSIZE );
    }
  }

  if ( P.useGrayscale ) makeGrayscale();

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
  } else if ( P.exportFrames ) {
    saveImage();
    // Example to end automatically after 361 frames to get a full loop
    if (frameCount > DURATION) {
      noLoop();
      saveConfig();
      console.log('Done.');
    }
  }
}

function mixColor( method, x = 0, y = 0, z = 0, min = 0, max = 1 ) {
  let h, s, b;
  
  const T = ((y+frameCount*0.15) % max) / max; //(frameCount % 200) / 200;
  let aniTiming = cubicBezier(aniCurve[0], aniCurve[1], aniCurve[2], aniCurve[3], T);

  switch( method ) {
    case "bezier-bw":
      h = aniTiming.y * 360; //( 2*frameCount ) % 360;
      s = 0;//clamp( (x+y)%max / max * 100, 20, 100 );
      b = clamp( (1.0 - (x / max)) * 100, 0, 100 );

      // b = (1.0 - (x / max)) * 100;
      break;

    case "bezier":
      h = aniTiming.y * 360; //( 2*frameCount ) % 360;
      s = clamp( (x+y)%max / max * 100, 20, 100 );
      b = clamp( (1.0 - (x / max)) * 100, 0, 100 );
      // b = (1.0 - (x / max)) * 100;
      break;
    case "sine2":
      h = ( 2*frameCount ) % 360;
      s = clamp( x / max * 100, 20, 100 );
      b = clamp( (1.0 - ((x+y) / max)) * 100, 20, 100 );
      // b = (1.0 - (x / max)) * 100;
      break;  
    default:
      h = 0;
      s = 50;
      b = 100;
      break;
  }
  return { h, s, b }
}

function makeGrayscale() {
  let i = 0;
  
  loadPixels();
  // for (let y = Math.floor( height*0.5 ); y < height; y++) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      let l = (Math.min(pixels[i] /*R*/, pixels[i + 1] /*G*/, pixels[i + 2 /*B*/]) +
        Math.max(
          pixels[i] /*R*/,
          pixels[i + 1] /*G*/,
          pixels[i + 2 /*B*/]
        )) *
      0.5;
      
      let c = l;

      pixels[i] = c; /* R */
      pixels[i + 1] = c; /* G */
      pixels[i + 2] = c; /* B */
      pixels[i + 3] = 255; /* A */
      
      i += 4;
    }
  }
  updatePixels();
}

function clamp( n, min, max ) {
  return Math.min(
    max,
    Math.max( n, min )
  );
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
