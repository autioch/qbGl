import Lib from 'lib';
import { generateColor } from './utils';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [0, 0, 50, 50, 0, 50, 75, 75, 150, 75, 75, 150]
    });

    const color1 = generateColor();
    const color2 = generateColor();

    this.colors = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: [...color1, ...color1, ...color1, ...color2, ...color2, ...color2]
    });

    this.translation = [10, 10];
    this.angleInRadians = 0;
    this.scale = [1, 1];
    this.mMatrix = new Lib.Matrix3(context);

    this.axes = new Lib.Axes(context);
  }

  ready({ canvas }) {
    this.mMatrix
      .projection(canvas.clientWidth, canvas.clientHeight)
      .translate(this.translation)
      .rotate(this.angleInRadians)
      .scale(this.scale);
  }

  render({ context, attributes, uniforms }) {
    this.position.fillBuffer(attributes.a_position);
    this.colors.fillBuffer(attributes.a_color);
    this.mMatrix.fillBuffer(uniforms.u_matrix);

    context.drawArrays(context.TRIANGLES, 0, 6);

    this.axes.render(attributes.a_color, attributes.a_position);
  }
}
