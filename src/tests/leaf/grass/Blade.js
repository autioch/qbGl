import Lib from '../../../lib';

// const color = [0, 0.5, 0, 1];

export default class Blade {
  constructor(context, color) {
    this.context = context;
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

  render(colorLocation, positionLocation) {
    const isColorUniform = colorLocation instanceof WebGLUniformLocation;

    this.position.fillBuffer(positionLocation);

    if (isColorUniform) {
      this.context.uniform4fv(colorLocation, this.rawColor);
    } else {
      this.color.fillBuffer(colorLocation);
    }

    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.position.count);
  }
}
