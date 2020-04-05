import Lib from '../../lib';
import { positions } from './consts';
import { m3 } from './m3';

// Copy of 01 fundamentals v2
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

  render({ context, program, canvas }) {
    context.uniform4fv(program.locateUniform('u_color'), this.color);

    let matrix = m3.projection(canvas.width, canvas.height);

    matrix = m3.translate(matrix, this.translation[0], this.translation[1]);
    matrix = m3.rotate(matrix, this.radians);
    matrix = m3.scale(matrix, this.scale[0], this.scale[1]);
    context.uniformMatrix3fv(program.locateUniform('u_matrix'), false, matrix);

    this.position.fillBuffer('a_position');

    context.drawArrays(context.TRIANGLES, 0, 18);
  }
}
