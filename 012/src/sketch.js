// PARAMETER SETS
const DRAW_OUTPUT_ONLY = true;
const PARAMS = [
  {
    name: "original",
    seed: "hello world",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    maxAttempts: Math.pow(2, 16), // 2^16
    minSteps: 4,
    minRadius:  12,
    targetPerFrame: 4,
    borderSize: 32,
  },
  {
    name: "pakt-revised",
    seed: "hello world",
    width: 540*2,
    height: 540*2,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: !true,
    renderAsVector: !true,
    maxAttempts: Math.pow(2, 8), // 2^16
    minSteps: 4,
    minRadius:  12,
    targetPerFrame: 4,
    borderSize: 32*2,
  },
  {
    name: "pakt-revised-short",
    seed: "hello world",
    width: 540*2,
    height: 540*2,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    maxAttempts: Math.pow(2, 4), // 2^16
    minSteps: 4,
    minRadius:  12,
    targetPerFrame: 128, /* 2^2,3,4,5,6 */
    borderSize: 32*2,
  },
  {
    name: "pakt-revised-attempts-filled",
    seed: "pakt circlez pt. 3",
    width: 540*2,
    height: 540*2,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    maxAttempts: Math.pow(2, 6), /* 2^4,5,6,7 */
    minSteps: 4,
    minRadius:  1080,//12,
    targetPerFrame: 32, 
    borderSize: 32*2,
    noStroke: !true,
    stroke: 255,
    colorSteps: false,
    useDither: false,
    ditherType: Ditherer.typeEnum.SEQUENTIAL,
    ditherScale: 4,
    ditherNoise: !true,
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

let circles = [];
let hasScanned = false;

let ditherer = new Ditherer( P.ditherType, P.ditherScale, P.ditherNoise );

// let buffer;
/**
 * BUFFER
 * 
 * The 'buffered' version is a fair bit slower (didn't measure exactly 
 * how much slower) but it allows for easy toggling between a dithered
 * version and a none-dithered version.
 * 
 * Future optimization?
 */

function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.height, P.renderAsVector ? SVG : P2D );
  pixelDensity( 1 );

  angleMode( DEGREES );
  colorMode( RGB, 255 );

  // buffer = createGraphics( P.width, P.height );
  // buffer.pixelDensity( 1 );
  // buffer.colorMode( RGB, 255 );
  // buffer.noStroke();
  // buffer.fill( 255 );
  // buffer.background( 0 );
  
  // Simplified drawing optimization ignores 
  // circle-specific color properties.
  stroke( P.stroke ?? 255 );
  strokeWeight( 1 );
  P.noStroke && noStroke();
  noFill();

  Math.seedrandom( P.seed );

  let innerBoundsX = P.width - 2 * P.borderSize,
      innerBoundsY = P.height - 2 * P.borderSize;
  let x = P.borderSize + Math.random() * innerBoundsX,
      y = P.borderSize + Math.random() * innerBoundsY;

  // let seedCircle = new Circle( P.width * 0.5, P.height * 0.5 );
  let seedCircle = new Circle( x, y, 255 );
  seedCircle.radius = Math.min( P.width, P.height ) * 0.2;
  seedCircle.isGrowing = false;
  circles.push( seedCircle );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();

  console.log( "Drawing..." );
}


function draw() {
  clear();
  background( 255 );

  let attempts = 0,
      added = 0,
      innerBoundsX = P.width - 2 * P.borderSize,
      innerBoundsY = P.height - 2 * P.borderSize;
  
  while ( !hasScanned && attempts++ < P.maxAttempts && added < P.targetPerFrame ) {
    let x = P.borderSize + Math.random() * innerBoundsX,
        y = P.borderSize + Math.random() * innerBoundsY;
    let p = findSpace( x, y );
    if ( p ) {
      circles.push( new Circle( x, y ));
      added++;
    }
  }

  // If no new circles were added, try again by scanning
  if ( added === 0 && !hasScanned ) {
    console.log( "Scanning..." );
    hasScanned = true;
    for( y = P.borderSize; y < P.height - P.borderSize; y++ ) {
      for ( x = P.borderSize; x < P.width - P.borderSize; x++ ) {
        let p = findSpace( x, y );
        if ( p ) {
          circles.push( new Circle( x, y ));
          added++;
        }
      }
    }
  }

  // Select the growing circles
  let cc = circles.filter(c => c.isGrowing );

  cc.forEach(c => {
    c.contain( P.borderSize, P.borderSize, P.width-P.borderSize, P.height-P.borderSize );

    let intersectionFound = false,
        i=0,
        len=circles.length;

    while ( i<len && !intersectionFound ) {
      if ( c !== circles[i] ) {
        intersectionFound = c.intersects( circles[i] );
        if ( intersectionFound ) {
          c.isGrowing = false;
          // could be redundant but could also an optimization if
          // the test for isGrowing moves back inside the cc.forEach
          circles[i].isGrowing = false; 
          // < DEBUG
          // let pairing = color( Math.random() * 255, Math.random() * 255, 32 );
          // c.color = pairing;
          // circles[i].color = pairing;
          // DEBUG />
        }
      }
      i++;
    }
  });

  // When cc.length === 0, we're done.

  // DRAW and GROW
  circles.forEach(c => {
    if ( ( !DRAW_OUTPUT_ONLY && !P.renderAsVector ) || cc.length === 0 ) {
      c.draw( P.minSteps, P.minRadius, P.colorSteps );
    }
    c.grow();
  });

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
  } else if ( cc.length === 0 ) {
    if ( P.useDither ) ditherer.dither();
    noLoop();
    downloadOutput();
    console.log('Done.');
  }
}

function findSpace( x, y ) {
  let intersectionFound = false,
      i = 0,
      len = circles.length;

  while ( i<len && !intersectionFound ) {
    let dx = x - circles[i].x,
        dy = y - circles[i].y,
        d = Math.sqrt( dx*dx + dy*dy );

    intersectionFound = d-1 < circles[i].radius;
    i++;
  }
  
  return !intersectionFound;
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