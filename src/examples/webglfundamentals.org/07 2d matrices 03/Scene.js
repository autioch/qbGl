import Lib from 'lib';
import { positions } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.radians = Lib.degToRad(13);
    this.translation = [150, 100];
    this.scale = [1, 1];
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
    this.mMatrix = new Lib.Matrix3(context).translate([-75, -50]);

    this.tMatrix.multiply(this.rMatrix).multiply(this.sMatrix).multiply(this.mMatrix);
  }

  render({ context, attributes, uniforms, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.uniform4fv(uniforms.u_color, this.color);

    this.tMatrix.fillBuffer(uniforms.u_matrix);
    this.position.fillBuffer(attributes.a_position);

    context.drawArrays(context.TRIANGLES, 0, 18);

    this.axes.render(attributes.a_color, attributes.a_position);
  }
}
