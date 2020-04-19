import Lib from 'lib';
import { TRIANGLE_DEF, SQUARE_DEF } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.triangle = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: TRIANGLE_DEF.vertices
    });

    this.square = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: SQUARE_DEF.vertices
    });
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(45, canvas.width / canvas.height, 0.1, 100.0).fillBuffer(uniforms.uPMatrix);
    this.mMatrix = new Lib.Matrix4(context);
  }

  render({ context, attributes, uniforms }) {
    this.mMatrix.push();

    this.mMatrix.translate([-1.5, 0.0, -6.0]).fillBuffer(uniforms.uMVMatrix);
    this.triangle.fillBuffer(attributes.aVertexPosition);
    context.drawArrays(context.TRIANGLES, 0, this.triangle.count);

    this.mMatrix.translate([3, 0, 0]).fillBuffer(uniforms.uMVMatrix);
    this.square.fillBuffer(attributes.aVertexPosition);
    context.drawArrays(context.TRIANGLE_STRIP, 0, this.square.count);

    this.mMatrix.pop();
  }
}
