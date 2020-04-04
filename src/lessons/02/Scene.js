import Lib from '../../lib';
import { TRIANGLE_DEF, SQUARE_DEF } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.triangleVertices = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: TRIANGLE_DEF.vertices
    });
    this.triangleColors = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: TRIANGLE_DEF.colors
    });
    this.squareVertices = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: SQUARE_DEF.vertices
    });
    this.squareColors = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: SQUARE_DEF.colors
    });
  }

  render({ context, program, mMatrix, setMatrixUniforms }) {
    mMatrix.translate([-1.5, 0.0, -6.0]);
    this.triangleVertices.fillBuffer(program.locateAttribute('aVertexPosition'));
    this.triangleColors.fillBuffer(program.locateAttribute('aVertexColor'));
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, this.triangleVertices.count);

    mMatrix.translate([3, 0, 0]);
    this.squareVertices.fillBuffer(program.locateAttribute('aVertexPosition'));
    this.squareColors.fillBuffer(program.locateAttribute('aVertexColor'));
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLE_STRIP, 0, this.squareVertices.count);
  }
}
