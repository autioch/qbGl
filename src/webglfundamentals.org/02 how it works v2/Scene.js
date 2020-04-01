import Lib from '../../lib';
import m3 from './m3';
import { generateColor } from './utils';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.triangle = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, this.triangle);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([0, 0, 50, 50, 0, 50, 75, 75, 150, 75, 75, 150]), context.STATIC_DRAW);

    const color1 = generateColor();
    const color2 = generateColor();

    this.colors = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, this.colors);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([...color1, ...color1, ...color1, ...color2, ...color2, ...color2]), context.STATIC_DRAW);

    this.translation = [10, 10];
    this.angleInRadians = 0;
    this.scale = [1, 1];
  }

  render({ context, program, canvas }) { // eslint-disable-line class-methods-use-this
    const position = program.locateAttribute('a_position');
    const color = program.locateAttribute('a_color');
    const umatrix = program.locateUniform('u_matrix');

    context.enableVertexAttribArray(position);
    context.bindBuffer(context.ARRAY_BUFFER, this.triangle);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);

    context.enableVertexAttribArray(color);
    context.bindBuffer(context.ARRAY_BUFFER, this.colors);
    context.vertexAttribPointer(color, 4, context.FLOAT, false, 0, 0);

    // Compute the matrix
    let matrix = m3.projection(canvas.clientWidth, context.canvas.clientHeight);

    matrix = m3.translate(matrix, this.translation[0], this.translation[1]);
    matrix = m3.rotate(matrix, this.angleInRadians);
    matrix = m3.scale(matrix, this.scale[0], this.scale[1]);

    context.uniformMatrix3fv(umatrix, false, matrix);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
