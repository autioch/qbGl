import Lib from '../../lib';
import { positions, colors } from './consts';

const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.rotation = [190, 20, 15];
    this.translation = [-100, 50, -200];
    this.scale = [1, 1, 1];
    this.fieldOfViewRadians = Lib.degToRad(60);

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
  }

  ready({ context, canvas }) {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;

    this.uMatrix = new Lib.Matrix4(context)
      .perspective(this.fieldOfViewRadians, aspect, zNear, zFar)
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
  }

  update() {
    this.rotation[1]++;
  }
}
