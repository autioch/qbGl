import Blade from './Blade';
import Lib from '../../../lib';

export default class Bunch {
  constructor(context, color) {
    this.blade = new Blade(context, color);

    this.rawColor = color;
    this.color = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: [
        ...color,
        ...color,
        ...color,
        ...color,
        ...color,
        ...color,
        ...color
      ]
    });

    this.rotations = [
      null,
      [45, [0, 1, 0] ],
      [75, [0, 1, 0] ],
      [60, [0, 1, 0] ],
      [30, [0, 1, 0] ],
      [90, [0, 1, 0] ]
    ];
  }

  render(matrix, matrixLocation, positionLocation) {
    matrix.push();
    this.rotations.forEach((rotation) => {
      rotation && matrix.rotate(...rotation);
      matrix.fillBuffer(matrixLocation);

      this.blade.render(positionLocation);
    });
    matrix.pop();
  }
}
