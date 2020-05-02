import ArrayDataBuffer from './ArrayDataBuffer';

const AXIS_LENGTH = 10000;

const AXES = [{
  vertices: [0, 0, 0, AXIS_LENGTH, 0, 0],
  color: [255, 0, 0, 1]
}, {
  vertices: [0, 0, 0, 0, AXIS_LENGTH, 0],
  color: [0, 255, 0, 1]
}, {
  vertices: [0, 0, 0, 0, 0, AXIS_LENGTH],
  color: [0, 0, 255, 1]
}, {
  vertices: [0, 0, 0, -AXIS_LENGTH, -AXIS_LENGTH, -AXIS_LENGTH],
  color: [255, 255, 255, 1]
}];

export default class Axes {
  constructor(context) {
    this.context = context;

    this.axes = AXES.map(({ vertices, color }) => ({
      vertices: new ArrayDataBuffer(context, {
        size: 3,
        data: vertices
      }),
      color: new ArrayDataBuffer(context, {
        size: 4,
        data: color
      }),
      normals: new ArrayDataBuffer(context, {
        size: 3,
        data: vertices.map((vert) => vert === 0 ? 0 : 1) // eslint-disable-line no-confusing-arrow
      })
    }));
  }

  render(colorLocation, positionLocation, normalLocation) {
    const isColorUniform = colorLocation instanceof WebGLUniformLocation;

    this.axes.forEach((axis, index) => {
      axis.vertices.fillBuffer(positionLocation);
      if (isColorUniform) {
        this.context.uniform4fv(colorLocation, AXES[index].color);
      } else {
        axis.color.fillBuffer(colorLocation);
      }
      normalLocation && axis.normals.fillBuffer(normalLocation);
      this.context.drawArrays(this.context.LINES, 0, 2);
    });
  }
}
