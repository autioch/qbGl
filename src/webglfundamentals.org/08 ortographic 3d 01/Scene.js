import Lib from '../../lib';
import { positions, colors } from './consts';
import m4 from '../../m4';

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
  }

  calculateMatrices(canvas) {
    const left = 0;
    const right = canvas.clientWidth;
    const bottom = canvas.clientHeight;
    const top = 0;// eslint-disable-line no-shadow
    const near = 400;
    const far = -400;

    let matrix = m4.orthographic(left, right, bottom, top, near, far);

    matrix = m4.translate(matrix, this.translation[0], this.translation[1], this.translation[2]);
    matrix = m4.xRotate(matrix, degToRad(this.rotation[0]));
    matrix = m4.yRotate(matrix, degToRad(this.rotation[1]));
    matrix = m4.zRotate(matrix, degToRad(this.rotation[2]));
    matrix = m4.scale(matrix, this.scale[0], this.scale[1], this.scale[2]);

    return matrix;
  }

  render({ context, attributes, uniforms, canvas }) {
    const matrix = this.calculateMatrices(canvas);

    context.uniformMatrix4fv(uniforms.u_matrix, false, matrix);

    this.position.fillBuffer(attributes.a_position);
    this.color.fillBuffer(attributes.a_color);

    context.drawArrays(context.TRIANGLES, 0, 16 * 6);
  }

  update() {
    this.rotation[1]++;
  }
}
