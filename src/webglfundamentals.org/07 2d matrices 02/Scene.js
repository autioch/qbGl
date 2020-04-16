import Lib from '../../lib';
import { positions } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.radians = 0;
    this.translation = [80, 15];
    this.scale = [0.85, 0.85];
    this.color = [0, 255, 0, 1];

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: positions
    });

    this.axes = new Lib.Axes(context);
  }

  ready({ context }) {
    this.tMatrix = new Lib.Matrix3(context).translate(this.translation);
    this.rMatrix = new Lib.Matrix3(context).rotate(this.radians);
    this.sMatrix = new Lib.Matrix3(context).scale(this.scale);
    this.mMatrix = new Lib.Matrix3(context);
  }

  render({ context, attributes, uniforms, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.uniform4fv(uniforms.u_color, this.color);
    this.position.fillBuffer(attributes.a_position);
    this.mMatrix.push();

    for (let i = 0; i < 5; ++i) {
      this.mMatrix.fillBuffer(uniforms.u_matrix);
      this.mMatrix.multiply(this.tMatrix).multiply(this.rMatrix).multiply(this.sMatrix);
      context.drawArrays(context.TRIANGLES, 0, 18);
    }

    this.mMatrix.pop();

    this.axes.render(attributes.a_color, attributes.a_position);
  }
}
