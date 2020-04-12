import Lib from '../../lib';
import m3 from '../../m3';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.buffer = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [0, -50, 75, 62.5, -87.5, 50]
    });

    this.translation = [200, 150];
    this.angleInRadians = 0;
    this.scale = [1, 1];
  }

  ready({ context, canvas, uniforms, attributes }) {
    this.matrix = this.calculateMatrix(canvas);
    context.uniformMatrix3fv(uniforms.u_matrix, false, this.matrix);
    this.buffer.fillBuffer(attributes.a_position);
  }

  calculateMatrix(canvas) {
    let matrix = m3.projection(canvas.clientWidth, canvas.clientHeight);

    matrix = m3.translate(matrix, this.translation[0], this.translation[1]);
    matrix = m3.rotate(matrix, this.angleInRadians);
    matrix = m3.scale(matrix, this.scale[0], this.scale[1]);

    return matrix;
  }

  render({ context }) {
    context.drawArrays(context.TRIANGLES, 0, 3);
  }
}
