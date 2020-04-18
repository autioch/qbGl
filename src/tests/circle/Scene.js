import Lib from '../../lib';
const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.rotationRadian = [];

    for (let i = 0; i <= 360; i += 10) { // 1, 5, 15 number of line draw
      this.rotationRadian.push(Math.cos(degToRad(i)), Math.sin(degToRad(i)), 0);
    }

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: this.rotationRadian
    });

    this.axes = new Lib.Axes(context);
  }

  render({ context, attributes, uniforms }) {
    this.position.fillBuffer(attributes.a_position);
    context.uniform4fv(uniforms.u_color, [255, 255, 255, 1]);
    context.drawArrays(context.LINE_LOOP, 0, this.rotationRadian.length / 3);

    this.axes.render(uniforms.u_color, attributes.a_position);
  }
}
