import Lib from '../../lib';
import { positions } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: positions
    });
  }

  ready({ context, uniforms, attributes, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    this.position.fillBuffer(attributes.a_position);
  }

  render({ context }) {
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
