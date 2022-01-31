// PARAMETER SETS
const PARAMS = [
  {
    name: "organic-rex",
    seed: "hello world",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: !false,
    renderAsVector: !true,
    r1: 0.835,
    r2: 0.45,
    widthToHeightRatio: 0.705,
    iterations: 16,
    colours: [
      // "#B21F52", // Maroon flush
      "#E96BAA", // Deep blush
      "#9AB146", // Sushi
      "#CDC646", // Tumeric
      "#53BC4E", // Apple
    ],
    alpha: 16,
    backgroundColour: "#000000",
  },
  {
    name: "organic-rex",
    seed: "hello world",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: !false,
    renderAsVector: !true,
    r1: 0.835,
    r2: 0.45,
    widthToHeightRatio: 0.705,
    iterations: 16,
    colours: [
      "#00152c", // Midnight
      "#023962", // Astronaut
      "#035a81", // Venice
      "#0baec9", // Cerulean
      "#99fbfd", // Anikawa
      // "#ccffff", // Onahau
    ],
    alpha: 64,
    backgroundColour: "#000000",
    originXFactor: 0.2,
    originYFactor: 0.8,
    originScaleFactor: 0.3,
  },
  {
    name: "organic-rex",
    seed: "hello world",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    r1: 0.83,
    r2: 0.45,
    widthToHeightRatio: 0.76,
    iterations: 32,
    colours: [
      "#00152c", // Midnight
      "#023962", // Astronaut
      "#035a81", // Venice
      "#0baec9", // Cerulean
      "#99fbfd", // Anikawa
      "#ccffff", // Onahau
    ],
    alpha: 64,
    backgroundColour: "#000000",
    originXFactor: 0.1,
    originYFactor: 0.75,
    originScaleFactor: 0.3,
  },
  {
    name: "blue-octo",
    seed: "hello world",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    r1: 0.83,
    r2: 0.45,
    widthToHeightRatio: 0.76,
    iterations: 32,
    colours: [
      "#023962", // Astronaut
      "#035a81", // Venice
      "#0baec9", // Cerulean
      "#99fbfd", // Anikawa
    ],
    alpha: 255,
    backgroundColour: "#000000",
    originXFactor: 0.1,
    originYFactor: 0.75,
    originScaleFactor: 0.3,
    layerCount: 2,
  },
  {
    name: "green-octo",
    seed: "squiddooo",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    r1: 0.9,
    r2: 0.45,
    widthToHeightRatio: 0.76,
    iterations: 32,
    colours: [
      "#9AB146", // Sushi
      "#CDC646", // Tumeric
      "#53BC4E", // Apple
    ],
    alpha: 255,
    backgroundColour: "#000000",
    drawStroke: true,
    originXFactor: 0.1,
    originYFactor: 0.75,
    originScaleFactor: 0.3,
    layerCount: 3,
  },
  {
    name: "clouds-octo",
    seed: "squiddooo",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: !true,
    renderAsVector: !true,
    r1: 0.6,
    r2: 0.45,
    widthToHeightRatio: 0.76,
    iterations: 16,
    colours: [
      "#023962", // Astronaut
      "#035a81", // Venice
      "#0baec9", // Cerulean
    ],
    alpha: 16,
    backgroundColour: "#000000",
    originXFactor: 0.1,
    originYFactor: 0.6,
    originScaleFactor: 0.5,
    layerCount: 3,
    placements: Rex.SLICE_ENUM.SE | Rex.SLICE_ENUM.NE
  },
  {
    name: "clouds-octo",
    seed: "squiddooo",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: !true,
    renderAsVector: !true,
    r1: 0.6,
    r2: 0.45,
    widthToHeightRatio: 0.93,
    iterations: 8,
    colours: [
      "#023962", // Astronaut
      "#035a81", // Venice
      "#0baec9", // Cerulean
      // "#FFFFFF",
    ],
    alpha: 64,
    drawStroke: true,
    backgroundColour: "#000000",
    originXFactor: 0.1,
    originYFactor: 0.6,
    originScaleFactor: 0.5,
    layerCount: 2,
    placements: Rex.SLICE_ENUM.SE | Rex.SLICE_ENUM.NW
  },
  {
    name: "clouds-octo-bloom",
    seed: "squiddooo",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: !true,
    renderAsVector: !true,
    r1: 0.6,
    r2: 0.45,
    widthToHeightRatio: 0.8,
    iterations: 16,
    colours: [
      "#023962", // Astronaut
      "#035a81", // Venice
      "#0baec9", // Cerulean
      // "#FFFFFF",
    ],
    alpha: 255,
    drawStroke: false,
    backgroundColour: "#000000",
    originXFactor: 0.35,
    originYFactor: 0.85,
    originScaleFactor: 0.3,
    layerCount: 1,
    placements: Rex.SLICE_ENUM.NW | Rex.SLICE_ENUM.NE
  },
  {
    name: "organic-rex",
    seed: "hello world",
    width: 540*2,
    height: 540*2,
    fps: 8,
    duration: 300,
    exportVideo: false,
    isAnimated: false,
    renderAsVector: false,
    r1: 0.83,
    r2: 0.4268277863398974,
    widthToHeightRatio: 0.76,
    iterations: 32,
    colours: [
      "#023962",
      "#035a81",
      "#0baec9",
      "#99fbfd"
    ],
    alpha: 255,
    backgroundColour: "#000000",
    drawStroke: false,
    originXFactor: 0.1,
    originYFactor: 0.75,
    originScaleFactor: 0.3,
    layerCount: 2,
    isolateBranches: true,
    placements: Rex.SLICE_ENUM.NW | Rex.SLICE_ENUM.NE,
  }
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
const INC = 0.005;
let COLOURS;

let layers = [];

function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.height, P.renderAsVector ? SVG : P2D );

  angleMode( DEGREES );
  colorMode( RGB, 255 );
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  // Convert the HEX colours into p5 colours with alpha
  COLOURS = P.colours.map(c => color( red(c), green(c), blue(c), P.alpha ));

  strokeWeight( 2 );
  noStroke();
  noFill();

  let xx = P.width * P.originXFactor,
      yy = P.height * P.originYFactor;
  let p0 = createVector( xx, yy );
  let p1 = createVector( xx + P.width * P.originScaleFactor, yy );

  layers.push( new Rex( p0, p1, P.widthToHeightRatio ) );
  
  let maxLayers = P.layerCount ? P.layerCount : 0;

  for( let n=0; n < maxLayers; n++ ) {
    layers.push( new Rex(
      p5.Vector.add( p0, p5.Vector.random2D().mult( 8 ) ),
      p5.Vector.add( p1, p5.Vector.random2D().mult( 8 ) ),
      P.widthToHeightRatio
    ) );
  }

  layers.forEach( l => init( l ));

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}


function draw() {
  background( P.backgroundColour );

  P.isAnimated && (P.r2 = cos( frameCount ) * 0.15 + 0.35);

  layers.forEach( l => {
    l.destroy();
    init( l );
  });

  layers.forEach( l => l.draw( P.drawStroke ) );

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

function saveImage( ext = 'png' ) {
  save(`${ getName() }.${ ext }`);
}

function saveConfig() {
  saveJSON( P, `${getName()}-config.json` );
}

function downloadOutput() {
  saveImage( P.renderAsVector ? 'svg' : undefined );
  saveConfig();
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


function keyPressed() {
  let updateRequired = true;
  if (keyCode === UP_ARROW) {
    P.r1 = clamp( P.r1 + INC, 0, 1 );
  } else if (keyCode === DOWN_ARROW) {
    P.r1 = clamp( P.r1 - INC, 0, 1 );
  } else if (keyCode === LEFT_ARROW) {
    P.r2 = clamp( P.r2 - INC, 0, 1 );
  } else if (keyCode === RIGHT_ARROW) {
    P.r2 = clamp( P.r2 + INC, 0, 1 );
  } else if (key === 'a') {
    P.widthToHeightRatio = clamp( P.widthToHeightRatio - INC, 0, 2 );
  } else if (key === 'd') {
    P.widthToHeightRatio = clamp( P.widthToHeightRatio + INC, 0, 2 );
  } else if (key === ' ') {
    P.r1 = Math.random();
    P.r2 = Math.random();
    P.widthToHeightRatio = Math.random() * 2;
  } else {
    updateRequired = false;
  }

  if ( updateRequired ) {
    layers.forEach( l => {
      l.destroy();
      init( l );
    });

    console.log( `r1: ${P.r1}   r2: ${P.r2}   ratio: ${P.widthToHeightRatio}`);
  }

  return false;
}

function init( r ) {
  r.build( P.widthToHeightRatio ); // redundant on first init but oh well.

  if ( !P.isolateBranches ) { // 
    let placement = P.placements ? P.placements : Rex.SLICE_ENUM.NW;
    r.addChildren( P.r1, P.r2, placement, P.iterations );
  } else {
    ( P.placements & Rex.SLICE_ENUM.NE ) && r.addChildren( P.r1, P.r2, Rex.SLICE_ENUM.NE, P.iterations );
    ( P.placements & Rex.SLICE_ENUM.NW ) && r.addChildren( P.r1, P.r2, Rex.SLICE_ENUM.NW, P.iterations );
    ( P.placements & Rex.SLICE_ENUM.SE ) && r.addChildren( P.r1, P.r2, Rex.SLICE_ENUM.SE, P.iterations );
    ( P.placements & Rex.SLICE_ENUM.SW ) && r.addChildren( P.r1, P.r2, Rex.SLICE_ENUM.SW, P.iterations );
  }
}

function clamp( val, min, max ) {
  return Math.max(
    Math.min(
      val,
      max
    ),
    min
  );
}