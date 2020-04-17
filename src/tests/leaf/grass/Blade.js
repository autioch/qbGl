import Lib from '../../../lib';

export default class Blade {
  constructor(context) {
    this.context = context;
    this.position = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: [
        10, 0, 0,
        -10, 0, 0,
        8, 10, 3.6,
        -6, 20, 10.8,
        4, 30, 21.6,
        -2, 40, 32.4,
        0, 50, 45
      ]
    });
  }

  render(positionLocation) {
    this.position.fillBuffer(positionLocation);
    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.position.count);
  }
}
