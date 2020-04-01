import Lib from '../../lib';
import m3 from './m3';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.buffer = context.createBuffer();

    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([0, -50, 75, 62.5, -87.5, 50]), context.STATIC_DRAW);

    this.translation = [200, 150];
    this.angleInRadians = 0;
    this.scale = [1, 1];
  }

  render({ context, program, canvas }) { // eslint-disable-line class-methods-use-this
    const position = program.locateAttribute('a_position');
    const umatrix = program.locateUniform('u_matrix');

    context.enableVertexAttribArray(position);
    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);

    // Compute the matrix
    let matrix = m3.projection(canvas.clientWidth, context.canvas.clientHeight);

    matrix = m3.translate(matrix, this.translation[0], this.translation[1]);
    matrix = m3.rotate(matrix, this.angleInRadians);
    matrix = m3.scale(matrix, this.scale[0], this.scale[1]);

    context.uniformMatrix3fv(umatrix, false, matrix);
    context.drawArrays(context.TRIANGLES, 0, 3);
  }
}
