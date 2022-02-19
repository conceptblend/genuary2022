const DEBUG = !true;

// PARAMETER SETS
const PARAMS = [
  {
    name: "knots",
    seed: "hello world",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    bgColour: "#84786b",
    ribbonColour: "#fff",
    colours: [
      "#50a3bdff",
      "#728ec2ff",
      "#788accff",
      "#7273c2ff",
      "#ccba78ff",
      "#cc788aff",
      "#8acc78ff"
    ],
    scale: 0.28,
    minPoints: 3,
    maxPoints: 14,
    paintProbability: 0.8,
    maxLength: 143,
    startAngle: 197,
    armSettings: [
      {
        lengthFactor: 0.25,
        speed: 3
      },
      {
        lengthFactor: 0.075,
        speed: -7
      },
      {
        lengthFactor: 0.025,
        speed: 6
      },
    ]
  },
  {
    name: "knots 2",
    seed: "nom nom",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    bgColour: "#a4c486ff",
    ribbonColour: "#fff",
    colours: [
      "#6cb4b3ff",
      "#86a4c4ff",
      "#7181c5ff",
      "#976abeff",
      "#c5b571ff",
      "#c57181ff",
      "#81c571ff"
    ],
    scale: 1.2,
    innerScale: 1.14,
    minPoints: 6,
    maxPoints: 18,
    paintProbability: 0.8,
    maxLength: 99,
    startAngle: 0,
    armSettings: [
      {
        lengthFactor: 0.3,
        speed: -4
      },
      {
        lengthFactor: 0.025,
        speed: -2.3333
      },
      {
        lengthFactor: 0.075,
        speed: 6
      },
    ]
  },
  {
    name: "knots 3",
    seed: "nom nom",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    bgColour: "#94925fff",
    ribbonColour: "#fff",
    colours: [
      "#6cb4b3ff",
      "#86a4c4ff",
      "#7181c5ff",
      "#976abeff",
      "#c5b571ff",
      "#c57181ff",
      "#81c571ff"
    ],
    scale: 1.3,
    innerScale: 1.17,
    minPoints: 2,
    maxPoints: 18,
    paintProbability: 0.92,
    maxLength: 97,
    startAngle: -90,
    armSettings: [
      {
        lengthFactor: 0.095,
        speed: -4
      },
      {
        lengthFactor: 0.195,
        speed: 7
      },
      {
        lengthFactor: 0.115,
        speed: 3
      },
    ]
  },
  {
    name: "knots 4",
    seed: "nom nom",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: true,
    renderAsVector: !true,
    bgColour: "#7528b3ff",
    strokeColour: "#7528b3ff",
    ribbonColour: "#ffffff33",
    hideRibbon: false,
    colours: [
      "#8f4c17ff",
      "#a96929ff",
      "#b37528ff",
      "#b4ac3bff",
      "#2866b3ff",
      "#28b375ff",
    ],
    scale: 1.3,
    innerScale: 1.27,
    minPoints: 2,
    maxPoints: 9,
    paintProbability: 0.88,
    maxLength: 97,
    startAngle: -45,
    armSettings: [
      {
        lengthFactor: 0.095,
        speed: -4
      },
      {
        lengthFactor: 0.195,
        speed: 7
      },
      {
        lengthFactor: 0.115,
        speed: 3
      },
    ]
  },
  {
    name: "ribbonz n knots 5",
    seed: "nom nom",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 34, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !true,
    isAnimated: !false,
    renderAsVector: !true,
    bgColour: "#84786b",
    strokeColour: "#84786b",
    ribbonColour: "#ffffff33",
    hideRibbon: false,
    colours: [
      "#50a3bdff",
      "#728ec2ff",
      "#788accff",
      "#7273c2ff",
      "#ccba78ff",
      "#cc788aff",
      "#8acc78ff"
    ],
    scale: 1.3,
    innerScale: 1.27,
    minPoints: 2,
    maxPoints: 9,
    paintProbability: 0.88,
    maxLength: 201,
    startAngle: -45,
    armSettings: [
      {
        lengthFactor: 0.095,
        speed: -5
      },
      {
        lengthFactor: 0.195,
        speed: 3
      },
      {
        lengthFactor: 0.115,
        speed: -11
      },
    ]
  },
  {
    name: "exploration",
    seed: "nom nom nom",
    width: 540,
    height: 540,
    fps: 30,
    duration: 30 * 34, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !true,
    isAnimated: true,
    renderAsVector: true,
    bgColour: "#D9B5A1",
    strokeColour: "#152845",
    ribbonColour: "#496082",
    hideRibbon: false,
    colours: [
      // "#496082",
      "#7ba68bff",
      "#5f6194ff",
      "#a67b95ff",
      "#fff",
    ],
    scale: 1.14,
    innerScale: 1.085,
    minPoints: 2,
    maxPoints: 9,
    paintProbability: 0.75,
    maxLength: 207,
    startAngle: 37,
    armSettings: [
      {
        lengthFactor: 0.115,
        speed: 1.573
      },
      {
        lengthFactor: 0.115,
        speed: -2.01
      },
      {
        lengthFactor: 0.315,
        speed: 3.83
      },
    ]
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
let arms;
let trail = [];
let segments = [];

const CX =  P.width * 0.5;
const CY =  P.height * 0.5;

function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.height, P.renderAsVector ? SVG : P2D );

  init();

  colorMode( RGB, 255 );
  
  noFill();
  stroke( P.strokeColour ?? 32 );
  strokeWeight( 2 );

  // Using the params, build out the arms of the drawbot
  arms = P.armSettings.map( ( a, i ) => new Arm({
      angle: i == 0 ? P.startAngle : 0,
      length: Math.min( P.width, P.height ) * a.lengthFactor,
      speed: a.speed
    })
  );

  loadTrail();
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}

function randomizeSeed() {
  P.seed = Date.now(); // could do better ;P
  init();
}

function init() {
  Math.seedrandom( P.seed );
  segments = calcSegments( P.maxLength );
}

function loadTrail() {
  // Pre-load the trail up to the max length
  for( let n=0, len=P.maxLength; n<len; n++ ) {
    let b = createVector( 0, 0 );
    arms.forEach( a => {
      a.update();
      b.add( a.vect );
    });
    trail.push( b );
  }
}

function draw() {
  background( P.bgColour );

  let b = createVector( 0, 0 );

  arms.forEach( a => {
    a.update();
    b.add( a.vect );
  });
  trail.push( b );
  
  // Trim the trail
  trail = trail.slice( Math.max( trail.length - P.maxLength, 0 ) );

  if ( !DEBUG ) {
    if ( !P.hideRibbon ) {
      push();
      // noStroke();
      fill( P.ribbonColour );

      drawSegment( trail, P.scale );
      pop();
    }


    if ( trail.length >= P.minPoints ) {
      let n = 0;
      let p, pp;

      // loop through all segments
      while ( n < segments.length ) {
        p = segments[ n ].startIndex;
        if ( p >= trail.length ) break;

        // Exclude the last point (clamping)
        pp = Math.min( segments[ n ].endIndex, trail.length-1 );

        if ( p !== pp && segments[ n ].colour !== null ) {
          fill( segments[ n ].colour );
          drawSegment(
            trail.slice( p, pp+1 ),
            P.innerScale
          );
        }
        n++;
      }
    }
  } else {
    push();
    stroke( 192, 0, 0 );
    b.set( 0, 0 );
    arms.forEach( a => {
      a.draw( CX + b.x, CY + b.y );
      b.add( a.vect );
    });
    pop();
  }

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

function calcSegments( numPoints ) {
  let segDefs = [],
      p = 1,
      pp,
      len,
      maximum = numPoints-2;
  while ( p < maximum ) {
    len = P.minPoints + Math.floor( Math.random() * ( P.maxPoints-P.minPoints ) );
    pp = Math.min( p+len, maximum );
    if ( p !== pp ) {
      segDefs.push({
        startIndex: p,
        endIndex: pp,
        colour: ( Math.random() < P.paintProbability ) ? P.colours[ Math.floor( Math.random() * P.colours.length )] : null,
      });
    }
    p = pp;
  }
  return segDefs;
}

function drawSegment( pts, scale ) {
  let norm;
  beginShape();
  pts.forEach( t => {
    norm = t.copy().mult( scale )
    vertex( CX + norm.x, CY + norm.y );
  });
  vertex( CX + norm.x, CY + norm.y );
  [...pts].reverse().forEach( t => {
    norm = t.copy().mult( 1.0 / scale )
    vertex( CX + norm.x, CY + norm.y );
  });
  vertex( CX + norm.x, CY + norm.y );
  endShape(CLOSE);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    P.maxLength++;
  } else if (keyCode === DOWN_ARROW) {
    P.maxLength--;
  // } else if (keyCode === LEFT_ARROW) {
  // } else if (keyCode === RIGHT_ARROW) {
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function getName() {
  // Encode the parameters into the filename
  // let params = window.btoa(JSON.stringify(P));
  let params = MD5( JSON.stringify(P) );
  return `${P.name.replace(/\s+/gi, '_')}-${params}-${new Date().toISOString()}`;
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
