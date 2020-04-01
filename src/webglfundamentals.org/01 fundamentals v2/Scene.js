import Lib from '../../lib';
import { positions } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.buffer = context.createBuffer();

    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
  }

  render({ context, program, canvas }) {
    context.uniform2f(program.locateUniform('u_resolution'), canvas.width, canvas.height);
    const positionAttribute = program.locateAttribute('a_position');

    context.enableVertexAttribArray(positionAttribute);

    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = context.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer

    context.vertexAttribPointer(positionAttribute, size, type, normalize, stride, offset);

    // execute program
    const primitiveType = context.TRIANGLES;
    const offset2 = 0;
    const count2 = 6;

    context.drawArrays(primitiveType, offset2, count2);
  }
}
