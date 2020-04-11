import Lib from '../../lib';
import { generateRects } from './utils';

export default class extends Lib.Scene {
  initialize({ context, canvas }) {
    this.rects = generateRects(10, canvas.width, canvas.height);
    this.buffer = new Lib.ArrayDataBuffer(context, {
      size: 2
    });
  }

  render({ context, attributes, uniforms, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);

    this.buffer.fillBuffer(attributes.a_position);
    this.rects.forEach((rect) => {
      // already bound/activated a_position
      context.bufferData(context.ARRAY_BUFFER, rect.vertices, context.STATIC_DRAW);
      context.uniform4f(uniforms.u_color, ...rect.color, 1);
      context.drawArrays(context.TRIANGLES, 0, 6);
    });
  }
}
