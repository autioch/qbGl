import Lib from '../../lib';
const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.rotationradian = [];

    for (let i = 0; i <= 360; i += 0.1) { // 1, 5, 15 number of line draw
      this.rotationradian.push(Math.cos(degToRad(i)), Math.sin(degToRad(i)), 0);
    }

    this.circle = new Lib.Shape(context);
    this.circle.setBuffer('circle', new Float32Array(this.rotationradian), context.ARRAY_BUFFER, 3, 3);
  }

  render({ context, program }) {
    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(this.rotationradian), context.STATIC_DRAW);

    const attr = context.getAttribLocation(program.program, 'pos');

    context.enableVertexAttribArray(attr);
    context.vertexAttribPointer(attr, 3, context.FLOAT, false, 0, 0);
    context.drawArrays(context.LINES, 0, this.rotationradian.length / 3);

    // const vertices = this.circle.getBuffer('circle', program.locateAttribute('pos'));

    // context.drawArrays(context.TRIANGLE_STRIP, 0, this.rotationradian.length / 3);
  }
}
