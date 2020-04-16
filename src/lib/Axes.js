import ArrayDataBuffer from './ArrayDataBuffer';

const AXIS_LENGTH = 10000;

const AXES = [{
  points: [0, 0, 0, AXIS_LENGTH, 0, 0],
  color: [255, 0, 0, 1]
}, {
  points: [0, 0, 0, 0, AXIS_LENGTH, 0],
  color: [0, 255, 0, 1]
}, {
  points: [0, 0, 0, 0, 0, AXIS_LENGTH],
  color: [0, 0, 255, 1]
}, {
  points: [0, 0, 0, AXIS_LENGTH, AXIS_LENGTH, AXIS_LENGTH],
  color: [255, 255, 255, 1]
}];

export default class Axes {
  constructor(context) {
    this.context = context;

    this.axes = AXES.map(({ points, color }) => ({
      points: new ArrayDataBuffer(context, {
        size: 3,
        data: points
      }),
      color: new ArrayDataBuffer(context, {
        size: 4,
        data: color
      })
    }));
  }

  render(colorLocation, positionLocation) {
    const isColorUniform = colorLocation instanceof WebGLUniformLocation;

    this.axes.forEach((axis, index) => {
      axis.points.fillBuffer(positionLocation);
      if (isColorUniform) {
        this.context.uniform4fv(colorLocation, AXES[index].color);
      } else {
        axis.color.fillBuffer(colorLocation);
      }
      this.context.drawArrays(this.context.LINES, 0, 2);
    });
  }
}
