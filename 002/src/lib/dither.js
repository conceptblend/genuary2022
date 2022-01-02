//
// dither.js
//
// Assumes a pixelDensity of 1
//

class Ditherer {
  constructor( matrixIndex = 0, scaleFactor = 1, useNoise = false ) {
    this.activeMatrix = null; //Ditherer.matrices.dispersed;
    this.getIntensity = null; //this.getIntensity9;
    this.setMatrix(matrixIndex);
    this.scaleFactor = scaleFactor;
    this.useNoise = useNoise;
  }

  // colour range / units;
  static fract4 = Math.floor(256 / 4);
  static fract9 = Math.floor(256 / 9);
  static fract16 = Math.floor(256 / 16);

  static typeEnum = {
    DISPERSED: 0x00,
    CLUSTERED: 0x01,
    SEQUENTIAL: 0x02,
    JUMBLED: 0x03,
    BAYERISH: 0x04,
    BAYERISH2: 0x05,
    MUNGED: 0x06,
    RANDOM: 0xFF,
  };

  static matrices = {
    clustered: [
      8, 3, 4, 
      6, 1, 2, 
      7, 5, 9],
    dispersed: [
      1, 7, 4, 
      5, 8, 3, 
      6, 2, 9],
    sequential: [
      1, 2, 3, 
      4, 5, 6, 
      7, 8, 9],
    jumbled: [
      9, 2, 3, 
      8, 1, 4, 
      7, 6, 5],
    bayerish: [
      1, 3, 
      4, 2],
    bayerish2: [
       1,  9,  3, 11,
      13,  5, 15,  7,
       4, 12,  2, 10,
      16,  8, 14,  6],
    munged: [
      1, 4, 9,
      6, 2, 5,
      8, 7, 3,
    ],
  };

  scale( n ) {
    return Math.floor( n / this.scaleFactor );
  }

  getIntensity16(x, y) {
    let _x = x % 4,
        _y = y % 4;
    return this.activeMatrix[_x + _y * 4] * Ditherer.fract16;
  }
  getIntensity9(x, y) {
    let _x = x % 3,
        _y = y % 3;
    return this.activeMatrix[_x + _y * 3] * Ditherer.fract9;
  }

  getIntensity4(x, y) {
    let _x = x % 2,
        _y = y % 2;
    return this.activeMatrix[_x + _y * 2] * Ditherer.fract4;
  }

  setMatrix(index) {
    switch (index) {
      case Ditherer.typeEnum.CLUSTERED:
        this.activeMatrix = Ditherer.matrices.clustered;
        this.getIntensity = this.getIntensity9;
        break;
      case Ditherer.typeEnum.SEQUENTIAL:
        this.activeMatrix = Ditherer.matrices.sequential;
        this.getIntensity = this.getIntensity9;
        break;
      case Ditherer.typeEnum.JUMBLED:
        this.activeMatrix = Ditherer.matrices.jumbled;
        this.getIntensity = this.getIntensity9;
        break;
      case Ditherer.typeEnum.BAYERISH:
        this.activeMatrix = Ditherer.matrices.bayerish;
        this.getIntensity = this.getIntensity4;
        break;
      case Ditherer.typeEnum.BAYERISH2:
        this.activeMatrix = Ditherer.matrices.bayerish2;
        this.getIntensity = this.getIntensity16;
        break;
      case Ditherer.typeEnum.RANDOM:
        this.activeMatrix = null;
        this.getIntensity = null;
        break;
      case Ditherer.typeEnum.MUNGED:
        this.activeMatrix = Ditherer.matrices.munged;
        this.getIntensity = this.getIntensity9;
        break;
      case Ditherer.typeEnum.DISPERSED:
      default:
        this.activeMatrix = Ditherer.matrices.dispersed;
        this.getIntensity = this.getIntensity9;
        break;
    }
  }

  dither() {
    loadPixels();

    let i = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Calculate the lightness value of the current pixel and
        // scale to the 0 - 255 range.

        // ~35-40x faster than using p5.Color.lightness()
        // 2.4ms vs 75.0ms
        let l =
          (Math.min(pixels[i] /*R*/, pixels[i + 1] /*G*/, pixels[i + 2 /*B*/]) +
            Math.max(
              pixels[i] /*R*/,
              pixels[i + 1] /*G*/,
              pixels[i + 2 /*B*/]
            )) *
          0.5;

        // Determine the intensity to compare against based
        // on the value from the Active matrix (cluster or disperse).
        let intensity = this.getIntensity ? this.getIntensity( this.scale( x ), this.scale( y ) ) : Math.random() * 255;
        this.useNoise && (intensity += (0.5 - Math.random()) * 16);

        // Choose black if the lightness is less than intensity.
        // Choose white if the lightess is greater than or
        // equal to intensity.
        let c = l < intensity ? 0 : 255;

        // Set the colour.
        // pixels[i] = c * 0.3; /* R */
        // pixels[i + 1] = c * 0.8; /* G */
        // pixels[i + 2] = c * 0.1; /* B */
        // pixels[i + 3] = 255; /* A */
        /* ==================== */
        pixels[i] = c; /* R */
        pixels[i + 1] = c; /* G */
        pixels[i + 2] = c; /* B */
        pixels[i + 3] = 255; /* A */
        /* ==================== */
        // pixels[i] = c * 0.94;//0.62; /* R */
        // pixels[i + 1] = c * 0.12;//0.25; /* G */
        // pixels[i + 2] = c * 0.91;//0.29; /* B */
        // pixels[i + 3] = 255; /* A */

        // ALTERNATE: Just adjust the transparency
        // pixels[i + 3] = c; /* A */

        i += 4;
      }
    }
    updatePixels();
  }
}