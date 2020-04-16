import Lib from '../../lib';

// Copy of 01 fundamentals v2
export default class extends Lib.Scene {
  initialize({ context }) {
    this.translation = [100, 100];
    this.width = 100;
    this.height = 30;
    this.color = [0, 255, 0, 1];
    this.buffer = context.createBuffer();

    this.axes = new Lib.Axes(context);
  }

  render({ context, attributes, uniforms, canvas }) {
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.uniform4fv(uniforms.u_color, this.color);

    context.enableVertexAttribArray(attributes.a_position);
    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    context.vertexAttribPointer(attributes.a_position, 2, context.FLOAT, false, 0, 0);

    const [x1, y1] = this.translation;
    const x2 = x1 + this.width;
    const y2 = y1 + this.height;
    const data = new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]);

    context.bufferData(context.ARRAY_BUFFER, data, context.STATIC_DRAW);
    context.drawArrays(context.TRIANGLES, 0, 6);

    this.axes.render(attributes.a_color, attributes.a_position);
  }
}
