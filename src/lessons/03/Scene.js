import Lib from '../../lib';
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

  render({ context, attributes, uniforms, mMatrix, setMatrixUniforms }) {
    mMatrix.translate([-1.5, 0.0, -6.0]).push().rotate(this.triangleRotate, [0, 1, 0]);
    this.triangleVertices.fillBuffer(attributes.aVertexPosition);
    this.triangleColors.fillBuffer(attributes.aVertexColor);
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, this.triangleVertices.count);
    mMatrix.pop();

    mMatrix.translate([3, 0, 0]).push().rotate(this.squareRotate, [1, 0, 0]);
    this.squareVertices.fillBuffer(attributes.aVertexPosition);
    this.squareColors.fillBuffer(attributes.aVertexColor);
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLE_STRIP, 0, this.squareVertices.count);
    mMatrix.pop();
  }

  update(elapsedTime) {
    this.triangleRotate += (90 * elapsedTime) / 1000.0;
    this.squareRotate += (75 * elapsedTime) / 1000.0;
  }
}
