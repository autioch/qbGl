import Lib from 'lib';

// const COLOR = [0.2, 0.8, 0.2, 1];
const COLOR = [1, 0.5, 1, 1];

export default class Leaf {
  constructor(context) {
    this.context = context;

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: [
        0.0, 0.0, 0.0,
        0.025, 0.0, 0.02,
        0.03, 0.0, 0.02,
        0.04, 0.0, 0.02,
        0.05, 0.0, 0.025,
        0.06, 0.0, 0.03,
        0.07, 0.0, 0.06,
        0.08, 0.01, 0.09,
        0.08, 0.02, 0.1,
        0.07, 0.03, 0.12,
        0.05, 0.04, 0.15,
        0.03, 0.05, 0.18,
        0.0, 0.06, 0.2,

        -0.03, 0.05, 0.18,
        -0.05, 0.04, 0.15,
        -0.07, 0.03, 0.12,
        -0.08, 0.02, 0.1,
        -0.08, 0.01, 0.09,
        -0.07, 0.0, 0.06,
        -0.06, 0.0, 0.03,
        -0.04, 0.0, 0.02,
        -0.03, 0.0, 0.02,
        -0.025, 0.0, 0.02,
        0.0, 0.0, 0.0
      ].map((val, index) => (val * 500) + (index % 3 === 1 ? 100 : 0))
    });

    this.color = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: new Array(this.position.count).fill(COLOR).flat()
    });
  }

  render(colorLocation, positionLocation) {
    this.color.fillBuffer(colorLocation);
    this.position.fillBuffer(positionLocation);
    this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.position.count);
  }
}
