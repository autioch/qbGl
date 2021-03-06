import Lib from 'lib';
import { positions } from './consts';

// Copy of 01 fundamentals v2
export default class extends Lib.Scene {
  initialize({ context }) {
    this.translation = [100, 50];
    const radians = Lib.degToRad(30);

    this.rotation = [Math.sin(radians), Math.cos(radians)];
    this.width = 100;
    this.height = 30;
    this.color = [0, 255, 0, 1];
    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: positions
    });

    this.axes = new Lib.Axes(context);
  }

  render({ context, attributes, uniforms, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.uniform4fv(uniforms.u_color, this.color);
    context.uniform2fv(uniforms.u_translation, this.translation);
    context.uniform2fv(uniforms.u_rotation, this.rotation);

    this.position.fillBuffer(attributes.a_position);

    context.drawArrays(context.TRIANGLES, 0, 18);

    this.axes.render(attributes.a_color, attributes.a_position);
  }
}
