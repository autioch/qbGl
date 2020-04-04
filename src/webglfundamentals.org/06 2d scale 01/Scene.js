import Lib from '../../lib';
import { positions } from './consts';

// Copy of 01 fundamentals v2
export default class extends Lib.Scene {
  initialize({ context }) {
    const radians = Lib.degToRad(30);

    this.rotation = [Math.sin(radians), Math.cos(radians)];
    this.translation = [100, 50];
    this.scale = [2, 0.5];

    this.width = 100;
    this.height = 30;

    this.color = [0, 255, 0, 1];

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: positions
    });
  }

  render({ context, program, canvas }) {
    context.uniform2f(program.locateUniform('u_resolution'), canvas.width, canvas.height);
    context.uniform4fv(program.locateUniform('u_color'), this.color);
    context.uniform2fv(program.locateUniform('u_translation'), this.translation);
    context.uniform2fv(program.locateUniform('u_rotation'), this.rotation);
    context.uniform2fv(program.locateUniform('u_scale'), this.scale);

    this.position.fillBuffer('a_position');

    context.drawArrays(context.TRIANGLES, 0, 18);
  }
}
