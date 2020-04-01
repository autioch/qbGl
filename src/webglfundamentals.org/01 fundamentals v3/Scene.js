import Lib from '../../lib';
import { generateRects } from './utils';

export default class extends Lib.Scene {
  initialize({ context, canvas }) {
    this.rects = generateRects(50, canvas.width, canvas.height);
    this.buffer = context.createBuffer();

    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
  }

  render({ context, program, canvas }) {
    const resolution = program.locateUniform('u_resolution');
    const color = program.locateUniform('u_color');
    const position = program.locateAttribute('a_position');

    context.enableVertexAttribArray(position);
    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = context.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer

    context.vertexAttribPointer(position, size, type, normalize, stride, offset);

    context.uniform2f(resolution, canvas.width, canvas.height);
    this.rects.forEach((rect) => {
      context.bufferData(context.ARRAY_BUFFER, rect.vertices, context.STATIC_DRAW);
      context.uniform4f(color, ...rect.color, 1);
      context.drawArrays(context.TRIANGLES, 0, 6);
    });
  }
}
