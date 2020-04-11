import Lib from '../../lib';
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

  render({ context, attributes, uniforms, mMatrix, setMatrixUniforms }) {
    mMatrix.translate([-1.5, 0.0, -6.0]);
    this.triangle.fillBuffer(attributes.aVertexPosition);
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, this.triangle.count);

    mMatrix.translate([3, 0, 0]);
    this.square.fillBuffer(attributes.aVertexPosition);
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLE_STRIP, 0, this.square.count);
  }
}
