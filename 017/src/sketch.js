
const styleEnum = {
  STRAIGHT: 0,
  CURVED: 1,
  RIBBON: 2,
  RIBBONX: 4,
  RIBBONY: 8,
};
const settingsOptions = {
  diag: {
    gridSize: 60,
    strokeWeight: 2,
    style: styleEnum.STRAIGHT
  },
  chunky: {
    gridSize: 24,
    strokeWeight: 8,
    style: styleEnum.STRAIGHT
  },
  tiny: {
    gridSize: 36,
    strokeWeight: 4,
    style: styleEnum.STRAIGHT
  },
  tinyCurved: {
    gridSize: 24,
    strokeWeight: 6,
    style: styleEnum.CURVED
  },
  water: {
    gridSize: 16,
    strokeWeight: 16,
    style: styleEnum.CURVED
  },
  firewater: {
    gridSize: 24,
    strokeWeight: 6,
    style: styleEnum.RIBBON,
  },
  firewater2: {
    gridSize: 48,
    strokeWeight: 4,
    style: styleEnum.RIBBON
  },
  test: {
    gridSize: 16,
    strokeWeight: 24,
    style: styleEnum.RIBBONY
  }
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// PARAMETER SETS
const PARAMS = [
  {
    name: "truchet-colours",
    seed: "but like for realz",
    width: 540*2,
    height: 540*2,
    fps: 30,
    duration: 30 * 10, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    isAnimated: false,
    renderAsVector: !true,
    settings: {
      gridSize: 24,
      strokeWeight: 6,
      style: styleEnum.RIBBON,
    },
    colours: [
      // "#fdecef", // Lavender blush
      "#832161", // Byzantium
      "#eee82c", // Titanium yellow
      "#da4167", // Cerise
      // "#81d2c7", // Middle blue green
    ],
  },
  {
    name: "truchet-colours",
    seed: "but like for realz",
    width: 540*2,
    height: 540*2,
    fps: 8,
    duration: 8 * 4, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: false,
    exportFrames: true,
    isAnimated: true,
    renderAsVector: !true,
    settings: {
      gridSize: 20,
      strokeWeight: 8,
      style: styleEnum.RIBBON,
    },
    colours: [
      "#832161", // Byzantium
      // "#81d2c7", // Middle blue green
      // "#000000", // Black
      "#eee82c", // Titanium yellow
      "#da4167", // Cerise
      // "#ffffff", // White
      // "#fdecef", // Lavender blush
    ],
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
const CELLSIZE = Math.min( P.width, P.height ) / P.settings.gridSize;
let colours;
let cellType = new Array( P.width * P.height );

function setup() {
  // SVG output is MUCH SLOWER but necessary for the SVG exports
  createCanvas( P.width, P.height, P.renderAsVector ? SVG : P2D );

  angleMode( DEGREES );
  colorMode( RGB, 255, 255, 255, 1 );
  strokeCap( ROUND );

  colours = [
    color(0, 21, 44, 1.0), // darkest blue
    color(2, 57, 98, 1.0), // darker blue
    color(3, 90, 129, 1.0), // dark blue
    color(11, 174, 201, 1.0), // blue
    color(153, 251, 253, 1.0), // light blue
    color(204, 255, 255, 1.0), // lighter blue
    color(203, 98, 85, 0.03), // red-orange
    color(201, 192, 156, 1.0), // yellow
    color(129, 201, 148, 1.0), // other green
    // color(104, 154, 130, 1.0), // green
    color(217, 157, 114, 1.0), // orange
    color(68, 41, 48, 1.0), // purple [ background ]
    color(68, 41, 48, 0.1), // purple,
    color(255, 247, 214, 1.0), // cream bg,
    color(255, 159, 53, 1.0), // bright orange // 13
    color(255, 87, 98, 1.0), // reddish
  ];

  // background( colours[12] );
  // stroke( colours[3] ) ;
  strokeWeight( P.settings.strokeWeight );
  noFill();
  
  Math.seedrandom( P.seed );
  
  frameRate( FPS );

  if ( !EXPORTVIDEO && !P.isAnimated ) noLoop();
}

/////////



/////////
function draw() {
  // background( colours[12] );
  background( P.colours[0] );

  for (var n = 0, len = cellType.length; n < len; n++) {
    // cellType[n] = random() > 0.8 ? 1 : 0;
    let xish = n %  P.settings.gridSize;
    let yish = ( n - xish ) / P.settings.gridSize;
    cellType[n] = Math.round( noise( xish * 0.5, yish * 0.5, frameCount * 0.3 ) );
  }
    
  let offset = CELLSIZE * 0.5;
  
  for (var y = 0; y < P.settings.gridSize; y++) {
    let yn = y * CELLSIZE;
    for (var x = 0; x < P.settings.gridSize; x++) {
      let xn = x * CELLSIZE;
      // FOR DEBUGGING
      // rect(xn, yn, xn + CELLSIZE, yn + CELLSIZE);


      let nx = xn + offset,
        ny = yn,
        wx = xn,
        wy = yn + offset,
        sx = xn + offset,
        sy = yn + CELLSIZE,
        ex = xn + CELLSIZE,
        ey = yn + offset,
        arcRadius;

      if (cellType[y * P.settings.gridSize + x] == 1) {
        // ltr -ve slope \
        
        switch (P.settings.style) {
          // case styleEnum.STRAIGHT:
          //   line(nx, ny, ex, ey);
          //   line(wx, wy, sx, sy);
          //   break;
          // case styleEnum.CURVED:
          //   arc(xn + CELLSIZE, yn, CELLSIZE, CELLSIZE, 90, 180);
          //   arc(xn, yn + CELLSIZE, CELLSIZE, CELLSIZE, 270, 360);
          //   break;
          case styleEnum.RIBBON:
            arcRadius = CELLSIZE - 3*P.settings.strokeWeight;
            // stroke(colours[14]);
            stroke( P.colours[ 2 ] );
            arc(xn + CELLSIZE, yn, CELLSIZE, CELLSIZE, 90, 180); // SW
            arc(xn, yn + CELLSIZE, CELLSIZE, CELLSIZE, 270, 360); // NE
            
            
            // stroke(colours[13]);
            stroke( P.colours[ 1 ] );
            arc(xn + CELLSIZE, yn, arcRadius, arcRadius, 90, 180); // SW
            arc(xn, yn + CELLSIZE, arcRadius, arcRadius, 270, 360); // NE
            break;
          // case styleEnum.RIBBONX:
          //   arcRadius = CELLSIZE + 2*P.settings.strokeWeight;
          //   stroke(colours[14]);
          //   arc(xn + CELLSIZE, yn, CELLSIZE, CELLSIZE, 90, 180);
          //   arc(xn, yn + CELLSIZE, CELLSIZE, CELLSIZE, 270, 360);
            
          //   stroke(colours[13]);
          //   arc(xn + CELLSIZE, yn, arcRadius, arcRadius, 90, 180);
          //   arc(xn, yn + CELLSIZE, arcRadius, arcRadius, 270, 360);
          //   break;
          // case styleEnum.RIBBONY:
          //   arcRadius = CELLSIZE - 2*P.settings.strokeWeight;
          //   noStroke();
          //   fill(colours[3]);
          //   arc(xn + CELLSIZE, yn, CELLSIZE, CELLSIZE, 90, 180);
          //   arc(xn, yn + CELLSIZE, CELLSIZE, CELLSIZE, 270, 360);
            
          //   fill(colours[7]);
          //   arc(xn + CELLSIZE, yn, arcRadius, arcRadius, 90, 180);
          //   arc(xn, yn + CELLSIZE, arcRadius, arcRadius, 270, 360);
          //   break;
        
        }
      } else {
        // ltr +ve slope /
        switch (P.settings.style) {
          // case styleEnum.STRAIGHT:
          //   line(wx, wy, nx, ny);
          //   line(sx, sy, ex, ey);
          //   break;
          // case styleEnum.CURVED:
          //   arc(xn, yn, CELLSIZE, CELLSIZE, 0, 90);
          //   arc(xn + CELLSIZE, yn + CELLSIZE, CELLSIZE, CELLSIZE, 180, 270);
          //   break;
          case styleEnum.RIBBON:
          case styleEnum.RIBBONX:
            arcRadius = CELLSIZE - 3*P.settings.strokeWeight;
            // stroke(colours[3]);
            stroke( P.colours[ 2 ] );
            arc(xn, yn, CELLSIZE, CELLSIZE, 0, 90); // SE
            arc(xn + CELLSIZE, yn + CELLSIZE, CELLSIZE, CELLSIZE, 180, 270); // NW

            // stroke(colours[7]);
            stroke( P.colours[ 1 ] );
            arc(xn, yn, arcRadius, arcRadius, 0, 90); // SE
            arc(xn + CELLSIZE, yn + CELLSIZE, arcRadius, arcRadius, 180, 270); // NW

            break;
          // case styleEnum.RIBBONY:
          //   arcRadius = CELLSIZE - 2*P.settings.strokeWeight;
          //   noStroke()

          //   fill(colours[3]);
          //   arc(xn, yn, CELLSIZE, CELLSIZE, 0, 90);
          //   arc(xn + CELLSIZE, yn + CELLSIZE, CELLSIZE, CELLSIZE, 180, 270);
            
          //   fill(colours[7]);
          //   arc(xn, yn, arcRadius, arcRadius, 0, 90);
          //   arc(xn + CELLSIZE, yn + CELLSIZE, arcRadius, arcRadius, 180, 270);
          //   break;
        }
      }
    }
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
