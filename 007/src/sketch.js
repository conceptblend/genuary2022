// PARAMETER SETS
const PARAMS = [
  {
    name: 'sol-lewitt-614',
    seed: "let's try somthing new",
    width: 540 * 2,
    height: 540 * 2,
    fps: 2,
    duration: 16, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: true,
    isAnimated: true,
    minDist: 20 * 2,
    maxAttempts: 4,
  },
  {
    name: 'sol-lewitt-614',
    seed: 'go sol go!',
    width: 540 * 2,
    height: 540 * 2,
    fps: 2,
    duration: 16, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: true,
    isAnimated: true,
    minDist: 20 * 2,
    maxAttempts: 4,
  },
  {
    name: 'sol-lewitt-614',
    seed: 'ok sol lfg!',
    width: 540 * 2,
    height: 540 * 2,
    fps: 2,
    duration: 16, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: true,
    isAnimated: true,
    minDist: 40 * 2,
    maxAttempts: 4,
  },
  {
    name: 'sol-lewitt-614',
    seed: 'ok sol lfg!',
    width: 540 * 2,
    height: 540 * 2,
    fps: 4,
    duration: 40, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: true,
    isAnimated: true,
    minDist: 10 * 2,
    maxAttempts: 4,
  },
  {
    name: 'sol-lewitt-614',
    seed: 'ok sol lfg! woooo',
    width: 540 * 2,
    height: 540 * 2,
    fps: 4,
    duration: 40, // no unit (frameCount by default; sometimes seconds or frames or whatever)
    exportVideo: !true,
    isAnimated: true,
    minDist: 10 * 2,
    maxAttempts: 4,
  },
];

// PARAMETERS IN USE
const P = PARAMS[PARAMS.length - 1];

// VIDEO
const EXPORTVIDEO = P.exportVideo ?? false; // set to `false` to not export
const FPS = P.fps;
const DURATION = P.duration;
let cnvsrecorder;
let isRecording = false;

function setup() {
  createCanvas(P.width, P.height);
  angleMode(DEGREES);
  colorMode(RGB, 255);

  noFill();
  stroke(0);
  strokeWeight(P.minDist * 0.5);

  Math.seedrandom(P.seed);

  frameRate(FPS);
  if (!EXPORTVIDEO && !P.isAnimated) noLoop();
}

class ListEntry {
  constructor(n, item) {
    if (n === undefined || item == undefined)
      throw new Error('ListEntry constructor missing arguments');
    this.n = n ?? null;
    this.item = item;
  }
}

class ListSortedByN {
  constructor(initialEntries, min, max) {
    this.entries = initialEntries ? initialEntries : [];
    this.min = min ?? 0;
    this.max = max ?? 0;
  }
  sort() {
    this.entries.sort((a, b) => a.n - b.n);
    return this.entries;
  }
  insert(entry) {
    let index = this.entries.findIndex((i) => i.n > entry.n);
    this.entries.splice(index >= 0 ? index : this.entries.length, 0, entry);
  }
}

let verticalLines = new ListSortedByN(null, 0, P.height);
let horizontalLines = new ListSortedByN(null, 0, P.width);

function vLine(n, y1 = 0, y2 = P.height) {
  return new ListEntry(n, new LineSegment(new Point(n, y1), new Point(n, y2)));
}

function hLine(n, x1 = 0, x2 = P.width) {
  return new ListEntry(n, new LineSegment(new Point(x1, n), new Point(x2, n)));
}

function findNearestPerps(list, testEntry, testN) {
  let position = list.entries.findIndex((entry) => entry.n > testN);
  let leftVal = null;
  let rightVal = null;

  // console.log( "Position: ", position );

  if (position === -1) position = list.entries.length;

  // Find left
  let found = false;
  let index = position - 1;
  while (!found && index >= 0) {
    let intersection = LineSegment.getIntersection(
      testEntry.item,
      list.entries[index].item
    );
    if (intersection) {
      found = true;
    } else {
      index--;
    }
  }
  leftVal = found ? list.entries[index].n : list.min;

  // Find right
  found = false;
  index = position;
  while (!found && index < list.entries.length) {
    let intersection = LineSegment.getIntersection(
      testEntry.item,
      list.entries[index].item
    );
    if (intersection) {
      found = true;
    } else {
      index++;
    }
  }
  rightVal = found ? list.entries[index].n : list.max;

  return [leftVal, rightVal];

  // Should we make sure a minimum space when selecting? I guess we can't...
}

function draw() {
  background(255);

  var testEntry;

  // Let's to N retry attempts if there are minDist issues
  let retryCount = 0;
  let pointFound = false;

  while (retryCount++ < P.maxAttempts && pointFound === false) {
    // Choose a random point
    let pt = new Point(
      Math.floor(Math.random() * P.width),
      Math.floor(Math.random() * P.height)
    );

    let arrN;
    if (frameCount % 2 === 0) {
      // Skip if it's too close to a neighbour
      if (
        verticalLines.entries.findIndex(
          (entry) => Math.abs(entry.n - pt.x) < P.minDist
        ) === -1
      ) {
        testEntry = vLine(pt.x);
        arrN = findNearestPerps(horizontalLines, testEntry, pt.y);
        verticalLines.insert(vLine(pt.x, arrN[0], arrN[1]));
        pointFound = true;
      }
    } else {
      if (
        horizontalLines.entries.findIndex(
          (entry) => Math.abs(entry.n - pt.y) < P.minDist
        ) === -1
      ) {
        testEntry = hLine(pt.y);
        arrN = findNearestPerps(verticalLines, testEntry, pt.x);
        horizontalLines.insert(hLine(pt.y, arrN[0], arrN[1]));
        pointFound = true;
      }
    }
  }

  horizontalLines.entries.forEach((l) =>
    line(l.item.p1.x, l.item.p1.y, l.item.p2.x, l.item.p2.y)
  );
  verticalLines.entries.forEach((l) =>
    line(l.item.p1.x, l.item.p1.y, l.item.p2.x, l.item.p2.y)
  );

  if (EXPORTVIDEO) {
    if (!isRecording) {
      cnvsrecorder = new CanvasRecorder(FPS);
      cnvsrecorder.start();
      isRecording = true;
      console.log('Recording...');
    }
  }
  // Example to end automatically after 361 frames to get a full loop
  if ((EXPORTVIDEO || P.isAnimated) && frameCount > DURATION) {
    EXPORTVIDEO && cnvsrecorder.stop(`${getName()}`);
    saveConfig();
    noLoop();
    console.log('Done.');
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function getName() {
  // Encode the parameters into the filename
  // let params = window.btoa(JSON.stringify(P));
  let params = MD5(JSON.stringify(P));
  return `${P.name}-${params}-${new Date().toISOString()}`;
}

function saveImage(ext) {
  save(`${getName()}.${ext ?? 'jpg'}`);
}

function saveConfig() {
  saveJSON(P, `${getName()}-config.json`);
}

function downloadOutput() {
  saveImage();
  saveConfig();
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%