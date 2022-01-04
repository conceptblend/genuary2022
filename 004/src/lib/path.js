class Path {
  constructor(fn, points) {
    this.drawFn = fn ?? (() => {
      console.log('Path.drawFn undefined');
    });
    this.points = points ?? [];
  }
  addPoint(point) {
    this.points.unshift( point );
  }
  removePoint(index) {
    this.points.splice( index, 1 );
  }
  draw() {
    this.drawFn.call( this, this.points );
  }
}
