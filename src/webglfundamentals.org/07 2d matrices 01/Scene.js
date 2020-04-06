import Lib from '../../lib';
import { positions } from './consts';
import { m3 } from './m3';

// Copy of 01 fundamentals v2
export default class extends Lib.Scene {
  initialize({ context }) {
    this.radians = Lib.degToRad(30);
    this.translation = [100, 50];
    this.scale = [2, 0.5];
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

    // Multiply the matrices.
    const matrix = m3.multiply(m3.multiply(translationMatrix, rotationMatrix), scaleMatrix);

    context.uniformMatrix3fv(program.locateUniform('u_matrix'), false, matrix);

    this.position.fillBuffer(program.locateAttribute('a_position'));

    context.drawArrays(context.TRIANGLES, 0, 18);
  }
}
