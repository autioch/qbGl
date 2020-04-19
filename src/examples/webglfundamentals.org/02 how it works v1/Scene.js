import Lib from 'lib';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.buffer = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [0, -50, 75, 62.5, -87.5, 50]
    });

    this.translation = [150, 100];
    this.degrees = 0;
    this.scale = [1, 1];
    this.mMatrix = new Lib.Matrix3(context);
  }

  ready({ canvas }) {
    this.mMatrix.projection(canvas.clientWidth, canvas.clientHeight).translate(this.translation).scale(this.scale);
  }

  render({ context, uniforms, attributes }) {
    this.mMatrix
      .push()
      .rotate(Lib.degToRad(this.degrees))
      .fillBuffer(uniforms.u_matrix)
      .pop();
    this.buffer.fillBuffer(attributes.a_position);
    context.drawArrays(context.TRIANGLES, 0, 3);
  }

  update({ pulse }) {
    this.degrees += 90 * pulse / 1000.0;
  }
}
