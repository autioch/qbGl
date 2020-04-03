import Lib from '../../lib';
const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.rotationRadian = [];

    for (let i = 0; i <= 360; i += 10) { // 1, 5, 15 number of line draw
      this.rotationRadian.push(Math.cos(degToRad(i)), Math.sin(degToRad(i)), 0);
    }

    this.circles = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: this.rotationRadian
    });
  }

  render({ context, program }) {
    this.circles.fillBuffer(program.locateAttribute('pos'));

    context.drawArrays(context.LINE_LOOP, 0, this.rotationRadian.length / 3);

    // context.drawArrays(context.TRIANGLE_STRIP, 0, this.rotationRadian.length / 3);
  }
}
