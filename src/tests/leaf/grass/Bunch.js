import Blade from './Blade';

export default class Bunch {
  constructor(context, color) {
    this.blade = new Blade(context, color);

    this.rotations = [
      null,
      [45, [0, 1, 0] ],
      [75, [0, 1, 0] ],
      [60, [0, 1, 0] ],
      [30, [0, 1, 0] ],
      [90, [0, 1, 0] ]
    ];
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    matrix.push();
    this.rotations.forEach((rotation) => {
      rotation && matrix.rotate(...rotation);
      matrix.fillBuffer(matrixLocation);
      this.blade.render(colorLocation, positionLocation);
    });
    matrix.pop();
  }
}
