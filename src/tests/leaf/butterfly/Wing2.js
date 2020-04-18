import Lib from '../../../lib';

const VERTICE_COLORS = [
  [0.5, 0.0, 0.2],
  [0.5, 0.0, 0.2],
  [1.0, 0.9, 0.0],
  [1.0, 0.9, 0.0],
  [0.9, 0.7, 0.2],
  [0.9, 0.7, 0.2],
  [0.8, 0.7, 0.0],
  [0.0, 0.0, 1.0],
  [0.9, 0.7, 0.0],
  [1.0, 0.8, 0.0],
  [1.0, 0.9, 0.0],
  [1.0, 1.0, 0.0]
];

function generateColors(rMod, gMod, bMod) {
  return VERTICE_COLORS
    .map(([r, g, b]) => [r * rMod, g * gMod, b * bMod, 1])
    .flat();
}

export default class Wing {
  constructor(context, colorMod = [1, 1, 1]) {
    this.context = context;
    this.position = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: [
        0.0, 0.0, 0.0,
        0.0, 0.2, 0.0,
        0.1, 0.25, 0.0,
        0.25, 0.25, 0.0,
        0.35, 0.2, 0.0,
        0.35, 0.1, 0.0,
        0.3, 0.0, 0.0,
        0.25, -0.05, 0.0,
        0.2, -0.15, 0.0,
        0.15, -0.2, 0.0,
        0.05, -0.2, 0.0,
        0.0, -0.1, 0.0
      ].map((val) => val * 100)
    });

    this.color = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: generateColors(...colorMod)
    });
  }

  render(colorLocation, positionLocation) {
    if (colorLocation instanceof WebGLUniformLocation) {
      throw Error('Butterfly wing cannot use uniform color.');
    } else {
      this.color.fillBuffer(colorLocation);
    }

    this.position.fillBuffer(positionLocation);
    this.context.drawArrays(this.context.TRIANGLE_FAN, 0, this.position.count);
  }
}
