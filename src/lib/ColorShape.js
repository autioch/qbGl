import ArrayDataBuffer from './ArrayDataBuffer';

export default class ColorShape {
  constructor(context, options) {
    const { vertices, colors, mode = context.TRIANGLES } = options;

    this.context = context;
    this.mode = mode;
    this.position = new ArrayDataBuffer(context, {
      size: 3,
      data: vertices
    });

    this.color = new ArrayDataBuffer(context, {
      size: 4,
      data: colors
    });
  }

  render(colorLocation, positionLocation) {
    this.color.fillBuffer(colorLocation);
    this.position.fillBuffer(positionLocation);
    this.context.drawArrays(this.mode, 0, this.position.count);
  }
}
