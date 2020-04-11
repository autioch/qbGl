import Lib from '../../lib';
import { generateRects } from './utils';

export default class extends Lib.Scene {
  initialize({ context, canvas }) {
    this.rects = generateRects(50, canvas.width, canvas.height);
    this.buffer = new Lib.ArrayDataBuffer(context, {
      size: 2
    });
  }

  render({ context, attributes, uniforms, canvas }) {
    const resolution = uniforms.u_resolution;
    const color = uniforms.u_color;

    context.uniform2f(resolution, canvas.width, canvas.height);

    this.buffer.fillBuffer(attributes.a_position);
    this.rects.forEach((rect) => {
      context.bufferData(context.ARRAY_BUFFER, rect.vertices, context.STATIC_DRAW);
      context.uniform4f(color, ...rect.color, 1);
      context.drawArrays(context.TRIANGLES, 0, 6);
    });
  }
}
