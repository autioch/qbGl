import Bunch from './Bunch';
import Lib from '../../../lib';
import { GARDEN_SIZE } from './consts';
import { range } from '../utils';

const BUNCH_COUNT = 500;

export default class Lawn {
  constructor(context) {
    this.bunch = new Bunch(context, [0, range(0.3, 0.7), 0, 1]);

    this.bunches = new Array(BUNCH_COUNT).fill(null).map(() => ({
      translate: [range(-GARDEN_SIZE, GARDEN_SIZE), 0, range(-GARDEN_SIZE, GARDEN_SIZE)],
      rotateY: range(0, 360),
      scale: range(0.4, 1),
      color: [0, range(0.3, 0.7), 0, 1]
    }));

    this.bunches.forEach((bunch) => {
      bunch.colorBuffer = new Lib.ArrayDataBuffer(context, {
        size: 4,
        data: [
          ...bunch.color,
          ...bunch.color,
          ...bunch.color,
          ...bunch.color,
          ...bunch.color,
          ...bunch.color,
          ...bunch.color
        ]
      });
    });
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    this.bunches.forEach((bunch) => {
      matrix.push();
      matrix.translate(bunch.translate);
      matrix.rotateY(bunch.rotateY);

      matrix.scale([bunch.scale, bunch.scale, bunch.scale]);

      const isColorUniform = colorLocation instanceof WebGLUniformLocation;

      if (isColorUniform) {
        this.context.uniform4fv(colorLocation, this.rawColor);
      } else {
        bunch.colorBuffer.fillBuffer(colorLocation);
      }

      this.bunch.render(matrix, matrixLocation, positionLocation);
      matrix.pop();
    });
  }
}
