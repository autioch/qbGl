import Lib from '../../lib';
import { positions, colors } from './consts';

const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.rotation = [20, 20, 10];
    this.translation = [100, 50, 0];
    this.scale = [1, 1, 1];

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: positions
    });

    this.color = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: new Uint8Array(colors),
      normalize: true,
      type: context.UNSIGNED_BYTE
    });

    this.axes = new Lib.Axes(context);
  }

  ready({ context, canvas }) {
    const left = 0;
    const right = canvas.clientWidth;
    const bottom = canvas.clientHeight;
    const top = 0;// eslint-disable-line no-shadow
    const near = 400;
    const far = -400;

    this.uMatrix = new Lib.Matrix4(context)
      .orthographic(left, right, bottom, top, near, far)
      .translate(this.translation)
      .scale(this.scale);
  }

  render({ context, attributes, uniforms }) {
    this.uMatrix
      .push()
      .rotateX(degToRad(this.rotation[0]))
      .rotateY(degToRad(this.rotation[1]))
      .rotateZ(degToRad(this.rotation[2]))
      .fillBuffer(uniforms.u_matrix)
      .pop();

    this.position.fillBuffer(attributes.a_position);
    this.color.fillBuffer(attributes.a_color);

    context.drawArrays(context.TRIANGLES, 0, 16 * 6);

    this.axes.render(attributes.a_color, attributes.a_position);
  }

  update() {
    this.rotation[1]++;
  }
}
