import Lib from '../../lib';

// Copy of 01 fundamentals v2
export default class extends Lib.Scene {
  initialize({ context }) {
    this.translation = [100, 100];
    this.width = 100;
    this.height = 30;
    this.color = [0, 255, 0, 1];
    this.buffer = context.createBuffer();
  }

  render({ context, program, canvas }) {
    context.uniform2f(program.locateUniform('u_resolution'), canvas.width, canvas.height);
    context.uniform4fv(program.locateUniform('u_color'), this.color);

    const position = program.locateAttribute('a_position');

    context.enableVertexAttribArray(position);
    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);

    const [x1, y1] = this.translation;
    const x2 = x1 + this.width;
    const y2 = y1 + this.height;
    const data = new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]);

    context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
