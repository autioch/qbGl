import Lib from '../../lib';
import { positions } from './consts';
import m3 from '../../m3';

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
  }

  calculateMatrices() {
    // Compute the matrices
    const translationMatrix = m3.translation(this.translation[0], this.translation[1]);
    const rotationMatrix = m3.rotation(this.radians);
    const scaleMatrix = m3.scaling(this.scale[0], this.scale[1]);
    const moveOriginMatrix = m3.translation(-75, -50);

    // Multiply the matrices.
    let matrix = m3.multiply(m3.multiply(translationMatrix, rotationMatrix), scaleMatrix);

    matrix = m3.multiply(matrix, moveOriginMatrix);

    return matrix;
  }

  render({ context, attributes, uniforms, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.uniform4fv(uniforms.u_color, this.color);

    const matrix = this.calculateMatrices();

    context.uniformMatrix3fv(uniforms.u_matrix, false, matrix);

    this.position.fillBuffer(attributes.a_position);

    context.drawArrays(context.TRIANGLES, 0, 18);
  }
}
