import ArrayDataBuffer from './ArrayDataBuffer';

export default class ColorShape {
  constructor(context, options) {
    const { vertices, colors, normals, mode = context.TRIANGLES } = options;

    this.context = context;
    this.mode = mode;
    this.position = new ArrayDataBuffer(context, {
      size: 3,
      data: vertices
    });

    colors && (this.color = new ArrayDataBuffer(context, {
      size: 4,
      data: colors
    }));

    normals && (this.normals = new ArrayDataBuffer(context, {
      size: 4,
      data: normals
    }));
  }

  render(colorLocation, positionLocation, normalLocation) {
    this.normals && normalLocation && this.normals.fillBuffer(normalLocation);
    this.color && this.color.fillBuffer(colorLocation);
    this.position.fillBuffer(positionLocation);
    this.context.drawArrays(this.mode, 0, this.position.count);
  }
}
