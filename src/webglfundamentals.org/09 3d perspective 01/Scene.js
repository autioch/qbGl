import Lib from '../../lib';
import { positions, colors } from './consts';
import { m4 } from './m4';

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

    // context.enable(context.CULL_FACE);
  }

  render({ context, program, canvas }) {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    let matrix = m4.perspective(this.fieldOfViewRadians, aspect, zNear, zFar);

    matrix = m4.translate(matrix, this.translation[0], this.translation[1], this.translation[2]);
    matrix = m4.xRotate(matrix, degToRad(this.rotation[0]));
    matrix = m4.yRotate(matrix, degToRad(this.rotation[1]));
    matrix = m4.zRotate(matrix, degToRad(this.rotation[2]));
    matrix = m4.scale(matrix, this.scale[0], this.scale[1], this.scale[2]);
    context.uniformMatrix4fv(program.locateUniform('u_matrix'), false, matrix);

    this.position.fillBuffer(program.locateAttribute('a_position'));
    this.color.fillBuffer(program.locateAttribute('a_color'));

    context.drawArrays(context.TRIANGLES, 0, 16 * 6);
  }

  update() {
    this.rotation[1]++;
  }
}
