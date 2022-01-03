// PARAMETER SETS
const PARAMS = [
  {
    name: "genuary-003-space",
    seed: "to infinity and beyond!",
    width: 540*2,
    height: 540*2,
    exportVideo: !true,
    fps: 24,
    duration: 24 * 15, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    starfield: {
      velocity: 3,
      rotateByAmount: -42,
      density: 0.001,
      useBugFeature: true,
    },
    blendFrames: false,
  },
  {
    name: "genuary-003-space",
    seed: "life the universe and everything",
    width: 540*2,
    height: 540*2,
    exportVideo: !true,
    fps: 24,
    duration: 24 * 15, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    starfield: {
      velocity: 3,
      rotateByAmount: -42,
      density: 0.002,
      useBugFeature: true,
    },
    blendFrames: false,
  },
  {
    name: "genuary-003-space",
    seed: "so long and thanks for all the fish",
    width: 540*2,
    height: 540*2,
    exportVideo: !true,
    fps: 24,
    duration: 24 * 15, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    starfield: {
      velocity: 3,
      rotateByAmount: -42,
      density: 0.006,
      useBugFeature: true,
    },
    blendFrames: false,
  },
  {
    name: "genuary-003-space",
    seed: "the meaning of life",
    width: 540*2,
    height: 540*2,
    exportVideo: !true,
    fps: 24,
    duration: 24 * 15, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    starfield: {
      velocity: 4,
      rotateByAmount: -42,
      density: 0.002,
      useBugFeature: true,
    },
    blendFrames: false,
  },
];

// PARAMETERS IN USE
const P = PARAMS[ PARAMS.length - 4 ];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

// General
let starfield = new StarField( P.width, P.height, P.starfield );

function setup() {
  let cnvs = createCanvas( P.width, P.height );
  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  noStroke();
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  starfield.generateStarField();
  background( 0 );
  fill( 192 );
  noStroke();

  cnvs.mouseClicked( reactToClick );

  if ( !!!P.exportVideo ) noLoop();
}

let mx = 0, my = 0; // for mouse control of velocity and rotation

function reactToClick() {
  mx = mouseX,
  my = mouseY;

  // X-axis controls the velocity
  // Y-axis controls the rotation factor

  starfield.velocity = clamp( mx / P.width, 0, 1 ) * 24;
  starfield.rotateByAmount = ( clamp( my / P.height, 0, 1 ) - 0.5 ) * 360;

  console.log(`//\nvel: ${starfield.velocity}\nrot: ${starfield.rotateByAmount}\n//`);
}

function draw() {
  if( P.blendFrames ) {
    background( 0, 0, 0, 20 );
  }

  starfield.update();
  starfield.draw();

  if ( EXPORTVIDEO ) {
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