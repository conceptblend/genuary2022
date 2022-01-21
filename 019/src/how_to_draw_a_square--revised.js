/**
@author ertdfgcvb + concept_blend
@title  How to draw a square
@desc   Draw a square using a distance function (https://play.ertdfgcvb.xyz/)
*/

import { map } from '/src/modules/num.js';

import { exportFrame } from '/src/modules/exportframe.js';

// Important: the frame exporter works only with the canvas renderer.
// Optional: reset the frame count and time at each new run!
export const settings = {
  renderer: 'canvas',
  restoreState: false, // Reset time
  fps: 4, // Slow down: some browsers can’t keep up with high framerates
};

export function pre(context, cursor, buffer) {
  // The last two parameters are the start and the end frame
  // of the sequence to be exported.
  // exportFrame(context, 'sqr-sqr.png', 2, 211)
  // The image will (probably) be saved in the “Downloads” folder
  // and can be assembled into a movie file; for example with FFmpeg:
  //
  // > ffmpeg -framerate 30 -pattern_type glob -i "export_*.png" \
  //        -vcodec h264 -pix_fmt yuv420p \
  //        -preset:v slow -profile:v baseline -crf 23 export.m4v
}

const density = '@#SQUARE?!;:+=-,._ ';

// Function to measure a distance to a square
export function box(p, size) {
  const dx = Math.max(Math.abs(p.x) - size.x, 0);
  const dy = Math.max(Math.abs(p.y) - size.y, 0);
  // return the distance from the point
  return Math.sqrt(dx * dx + dy * dy);
}

export function main(coord, context, cursor, buffer) {
  const t = context.frame * 20;
  const m = Math.min(context.cols, context.rows);
  const a = context.metrics.aspect;

  // Normalize space and adjust aspect ratio (screen and char)
  const st = {
    x: (2.0 * (coord.x - context.cols / 2)) / m,
    y: (2.0 * (coord.y - context.rows / 2)) / m / a,
  };

  // Transform the coordinate by rotating it
  const ang = t * 0.00075;
  const s = Math.sin(ang * 3);
  const c = Math.cos(-ang);
  const p = {
    x: st.x * c - st.y * s,
    y: st.x * s + st.y * c,
  };

  // Size of the square
  const size = map(Math.sin(t * 0.0023), -1, 1, 0.4, 0.8);

  // Calculate the distance
  const d = box(p, { x: size, y: size });

  const char =
    d == 0
      ? coord.x % 2 == 0
        ? ' '
        : '•'
      : density[Math.round(d * 10) % density.length];
  const out = {
    // the char to be rendered
    char,
    // the foreground color (CSS string)
    color: 'rgba(' + ((255 * d) % 255) + ', 64, 255, 1.0)',
  };
  return out;
}
