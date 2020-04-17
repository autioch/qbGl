import Lib from '../../../lib';
import { GARDEN_SIZE } from './consts';

const COLOR = [0.5, 0.5, 0, 1];

export default class Earth {
  constructor(context) {
    this.context = context;

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: [
        -GARDEN_SIZE, 0, -GARDEN_SIZE,
        GARDEN_SIZE, 0, -GARDEN_SIZE,
        -GARDEN_SIZE, 0, GARDEN_SIZE,
        GARDEN_SIZE, 0, GARDEN_SIZE
      ]
    });

    this.color = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: [
        ...COLOR,
        ...COLOR,
        ...COLOR,
        ...COLOR,
        ...COLOR,
        ...COLOR,
        ...COLOR
      ]
    });
  }

  render(colorLocation, positionLocation) {
    const isColorUniform = colorLocation instanceof WebGLUniformLocation;

    if (isColorUniform) {
      this.context.uniform4fv(colorLocation, COLOR);
    } else {
      this.color.fillBuffer(colorLocation);
    }

    this.position.fillBuffer(positionLocation);
    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.position.count);
  }
}