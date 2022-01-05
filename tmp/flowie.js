
function flowField( w, h ) {
    const cellSize = 4;
    const rows = h / cellSize;
    const cols = w / cellSize;
    const inc = 0.01;
    let xOff = 0,
        yOff = 0,
        zOff = 8 * frameCount * inc;
  
    noStroke();
    for (let y = 0; y < rows; y++) {
      yOff = y * inc;
      xOff = 0;
      for (let x = 0; x < cols; x++ ) {
        xOff += inc;
        let c = noise( xOff, yOff, zOff );
        fill( c * 255 );
        rect( x * cellSize, y * cellSize, cellSize, cellSize )
      }
    }
  }
  