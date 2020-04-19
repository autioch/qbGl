import Lib from 'lib';
import { triangleDef, squareDef } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.triangleVertices = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: triangleDef.vertices
    });
    this.triangleColors = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: triangleDef.colors
    });
    this.squareVertices = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: squareDef.vertices
    });
    this.squareColors = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: squareDef.colors
    });

    this.triangleRotate = 0;
    this.squareRotate = 0;
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(45, canvas.width / canvas.height, 0.1, 100.0).fillBuffer(uniforms.uPMatrix);
    this.mMatrix = new Lib.Matrix4(context).translate([-1.5, 0.0, -6.0]);
  }

  render({ context, attributes, uniforms }) {
    this.mMatrix.push()
      .rotate(this.triangleRotate, [-1.5, 0.0, -6.0])
      .fillBuffer(uniforms.uMVMatrix)
      .pop();
    this.triangleVertices.fillBuffer(attributes.aVertexPosition);
    this.triangleColors.fillBuffer(attributes.aVertexColor);
    context.drawArrays(context.TRIANGLES, 0, this.triangleVertices.count);

    this.mMatrix.push()
      .translate([3, 0, 0])
      .rotate(this.squareRotate, [1, 0, 0])
      .fillBuffer(uniforms.uMVMatrix)
      .pop();
    this.squareVertices.fillBuffer(attributes.aVertexPosition);
    this.squareColors.fillBuffer(attributes.aVertexColor);
    context.drawArrays(context.TRIANGLE_STRIP, 0, this.squareVertices.count);
  }

  update({ pulse }) {
    this.triangleRotate += (90 * pulse) / 1000.0;
    this.squareRotate += (75 * pulse) / 1000.0;
  }
}
