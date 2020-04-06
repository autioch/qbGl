import Lib from '../../lib';
import { positions } from './consts';
import { m3 } from './m3';

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

  render({ context, program, canvas }) {
    context.uniform2f(program.locateUniform('u_resolution'), canvas.width, canvas.height);
    context.uniform4fv(program.locateUniform('u_color'), this.color);

    // Compute the matrices
    const translationMatrix = m3.translation(this.translation[0], this.translation[1]);
    const rotationMatrix = m3.rotation(this.radians);
    const scaleMatrix = m3.scaling(this.scale[0], this.scale[1]);

    this.position.fillBuffer(program.locateAttribute('a_position'));

    // Starting Matrix.
    let matrix = m3.identity();

    for (let i = 0; i < 5; ++i) {
      context.uniformMatrix3fv(program.locateUniform('u_matrix'), false, matrix);
      context.drawArrays(context.TRIANGLES, 0, 18);

      // Multiply the matrices.
      matrix = m3.multiply(matrix, translationMatrix);
      matrix = m3.multiply(matrix, rotationMatrix);
      matrix = m3.multiply(matrix, scaleMatrix);
    }
  }
}
