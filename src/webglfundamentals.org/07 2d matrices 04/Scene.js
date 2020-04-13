import Lib from '../../lib';
import { positions } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.radians = Lib.degToRad(13);
    this.translation = [75, 50];
    this.scale = [1, 1];
    this.color = [0, 255, 0, 1];

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: positions
    });
  }

  ready({ context, canvas }) {
    this.mMatrix = new Lib.Matrix3(context)
      .projection(canvas.width, canvas.height)
      .translate(this.translation)
      .rotate(this.radians)
      .scale(this.scale);
  }

  render({ context, attributes, uniforms }) {
    context.uniform4fv(uniforms.u_color, this.color);
    this.mMatrix.fillBuffer(uniforms.u_matrix);
    this.position.fillBuffer(attributes.a_position);

    context.drawArrays(context.TRIANGLES, 0, 18);
  }
}
