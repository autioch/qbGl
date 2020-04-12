import Lib from '../../lib';
import { positions } from './consts';
import m3 from '../../m3';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.radians = Lib.degToRad(15);
    this.translation = [100, 50];
    this.scale = [1.5, 0.5];
    this.color = [0, 255, 0, 1];

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: positions
    });
  }

  calculateMatrices(canvas) {
    let matrix = m3.projection(canvas.width, canvas.height);

    matrix = m3.translate(matrix, this.translation[0], this.translation[1]);
    matrix = m3.rotate(matrix, this.radians);
    matrix = m3.scale(matrix, this.scale[0], this.scale[1]);

    return matrix;
  }

  render({ context, attributes, uniforms, canvas }) {
    const matrix = this.calculateMatrices(canvas);

    context.uniform4fv(uniforms.u_color, this.color);
    context.uniformMatrix3fv(uniforms.u_matrix, false, matrix);

    this.position.fillBuffer(attributes.a_position);

    context.drawArrays(context.TRIANGLES, 0, 18);
  }
}
