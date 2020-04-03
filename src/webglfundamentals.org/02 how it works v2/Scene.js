import Lib from '../../lib';
import m3 from './m3';
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
  }

  render({ context, program, canvas }) { // eslint-disable-line class-methods-use-this
    const umatrix = program.locateUniform('u_matrix');

    this.position.fillBuffer(program.locateAttribute('a_position'));
    this.colors.fillBuffer(program.locateAttribute('a_color'));

    // Compute the matrix
    let matrix = m3.projection(canvas.clientWidth, context.canvas.clientHeight);

    matrix = m3.translate(matrix, this.translation[0], this.translation[1]);
    matrix = m3.rotate(matrix, this.angleInRadians);
    matrix = m3.scale(matrix, this.scale[0], this.scale[1]);

    context.uniformMatrix3fv(umatrix, false, matrix);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
