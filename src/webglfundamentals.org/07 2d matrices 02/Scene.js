import Lib from '../../lib';
import { positions } from './consts';
import m3 from '../../m3';

// Copy of 01 fundamentals v2
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
  }

  calculateMatrices() {
    // Compute the matrices
    const translationMatrix = m3.translation(this.translation[0], this.translation[1]);
    const rotationMatrix = m3.rotation(this.radians);
    const scaleMatrix = m3.scaling(this.scale[0], this.scale[1]);

    return {
      translationMatrix,
      rotationMatrix,
      scaleMatrix
    };
  }

  render({ context, attributes, uniforms, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.uniform4fv(uniforms.u_color, this.color);

    const { translationMatrix, rotationMatrix, scaleMatrix } = this.calculateMatrices();

    this.position.fillBuffer(attributes.a_position);

    // Starting Matrix.
    let matrix = m3.identity();

    for (let i = 0; i < 5; ++i) {
      context.uniformMatrix3fv(uniforms.u_matrix, false, matrix);
      context.drawArrays(context.TRIANGLES, 0, 18);

      // Multiply the matrices.
      matrix = m3.multiply(matrix, translationMatrix);
      matrix = m3.multiply(matrix, rotationMatrix);
      matrix = m3.multiply(matrix, scaleMatrix);
    }
  }
}
