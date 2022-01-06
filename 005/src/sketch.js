// PARAMETER SETS
const PARAMS = [
  {
    name: "destroy-a-square",
    seed: "bang bang bang",
    width: 540*2,
    height: 540*2,
    fps: 1,
    duration: 8 * 2, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !true,
    exportFrames: !true,
    isAnimated: true,
    strokeWeight: 2*2,
    fillModulus: 7,
    omissionRate: 0.3,
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

let points = [];

function setup() {
  createCanvas( P.width, P.height );
  angleMode( DEGREES );
  colorMode( HSB, 360, 100, 100, 1 );
  
  noFill();
  stroke( 0, 0, 100 );
  strokeWeight( P.strokeWeight );
  strokeCap( SQUARE );
  strokeJoin( BEVEL );
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}

const MARGIN = Math.min( P.width, P.height ) * 0.1;

function draw() {
  background(0);

  let poly1 = new Polygon(
    [
      new Point( MARGIN, MARGIN ),
      new Point( P.width - MARGIN, MARGIN ),
      new Point( P.width - MARGIN, P.height-MARGIN ),
      new Point( MARGIN, P.height-MARGIN )
    ], false );
  
  const iterations = 2 + ( (frameCount - 1) % 4 );
  let polysIn = [ poly1 ];
  let polysOut;
  for (let n = iterations; n > 0; n-- ) {
    polysOut = [];
    polysIn.forEach( ( pp, n ) => {
      polysOut = polysOut.concat( pp.subdivide( clamp( Math.random(), 0.2, 0.8 ), P.omissionRate ) );
    });
    polysIn = polysOut;
  }

  polysOut.forEach( (p,i) => {
    fill( 0, 0, ( i % P.fillModulus === 0 ) ? 100: 0 );
    p.draw();
  });

  if ( !EXPORTVIDEO && P.isAnimated && P.exportFrames ) {
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
      saveConfig();
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

function clamp( val, min, max ) {
  return Math.max(
    Math.min(
      val,
      max
    ),
    min
  );
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%