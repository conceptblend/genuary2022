

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
  },
];


class Arm {
  constructor( options ) {
    this.angle = options?.angle ?? 0;
    this.length = options?.length ?? length;
    this.rotSpeed = options?.speed ?? 2;
    this.vect = createVector( this.length * cos( this.angle * Math.PI/180 ), this.length * sin( this.angle * Math.PI/180 ) );
  }
  update() {
    this.vect.rotate( this.rotSpeed * Math.PI/180 );
  }
  draw( x, y ) {
    line( x, y, x+this.vect.x, y+this.vect.y );
    circle( x, y, 2*this.length );
  }
}

// PARAMETERS IN USE
const P = PARAMS[ PARAMS.length - 1 ];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.height, P.renderAsVector ? SVG : P2D );

  colorMode( RGB, 255 );
  
  noFill();
  stroke( 255 );

  arms = [
    new Arm({
      angle: P.startAngle,
      length: Math.min( P.width, P.height ) * 0.25,
      speed: 3
    }),
    new Arm({
      angle: 0,
      length: Math.min( P.width, P.height ) * 0.05,
      speed: -7
    }),
    new Arm({
      angle: 0,
      length: 37,
      speed: 6
    }),
    // new Arm({
    //   angle: 0,
    //   length: 23,
    //   speed: -3
    // }),
  ];
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}

let arms;
let trail = [];

const DEBUG = !true;
let MAX_LENGTH = P.maxLength;

const CX =  P.width * 0.5;
const CY =  P.height * 0.5;

function draw() {
  background( P.bgColour );

  // DO YOUR DRAWING HERE!
  let b = createVector(0, 0 );

  push();
  stroke( 192, 0, 0 );
  arms.forEach( a => {
    a.update();
    DEBUG && a.draw( CX + b.x, CY + b.y );
    b.add( a.vect );
  });
  pop();
  trail.push( b );

  // Trim the trail
  trail = trail.slice( Math.max( trail.length - MAX_LENGTH, 0 ) );

  push();
  noStroke();
  fill( P.ribbonColour );

  drawSegment( trail, P.scale );

  if ( trail.length >= P.minPoints ) {
    let p = 1;
    while ( p < trail.length ) {
      let len = P.minPoints + Math.floor( Math.random() * ( P.maxPoints-P.minPoints ) );
      let pp = Math.min( p+len, trail.length-1 );
      if ( p !== pp && Math.random() < P.paintProbability ) {
        let seg = trail.slice( p, pp );
        fill( P.colours[ Math.floor( Math.random() * P.colours.length )] )
        drawSegment( seg, P.scale * 0.75 );
      }
      p += len;
    }
  }

  pop();

  // beginShape();
  // trail.forEach( t => vertex( t.x, t.y ));
  // endShape();

  // stroke( 0, 255, 0 );
  // beginShape();
  // trail.forEach( t => vertex( t.x * 1.07, t.y * 0.93 ));
  // endShape();

  // stroke( 0, 0, 255 );
  // beginShape();
  // trail.forEach( t => vertex( t.x * 1.02, t.y * 0.89 ));
  // endShape();

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

function drawSegment( pts, scale ) {
  let norm;
  beginShape();
  pts.forEach( t => {
    norm = t.copy().mult( 1.0 + scale )
    vertex( CX + norm.x, CY + norm.y );
  });
  vertex( CX + norm.x, CY + norm.y );
  let lairt = [...pts].reverse().forEach( t => {
    norm = t.copy().mult( 1.0 - scale )
    vertex( CX + norm.x, CY + norm.y );
  });
  vertex( CX + norm.x, CY + norm.y );
  endShape(CLOSE);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    MAX_LENGTH++;
  } else if (keyCode === DOWN_ARROW) {
    MAX_LENGTH--;
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
