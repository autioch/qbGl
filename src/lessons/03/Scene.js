import Lib from '../../lib';
import { triangleDef, squareDef } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.triangle = new Lib.Shape(context);
    this.triangle.setBuffer('vertices', new Float32Array(triangleDef.vertices), context.ARRAY_BUFFER, 3, 3);
    this.triangle.setBuffer('colors', new Float32Array(triangleDef.colors), context.ARRAY_BUFFER, 3, 4);
    this.triangle.rotate = 0;

    this.square = new Lib.Shape(context);
    this.square.setBuffer('vertices', new Float32Array(squareDef.vertices), context.ARRAY_BUFFER, 4, 3);
    this.square.setBuffer('colors', new Float32Array(squareDef.colors), context.ARRAY_BUFFER, 4, 4);
    this.square.rotate = 0;
  }

  render({ context, program, mMatrix, setMatrixUniforms }) {
    mMatrix
      .translate([-1.5, 0.0, -6.0])
      .push()
      .rotate(this.triangle.rotate, [0, 1, 0]);
    const triangleVertices = this.triangle.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    this.triangle.getBuffer('colors', program.getAttrib('aVertexColor'));
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, triangleVertices.count);

    mMatrix.pop();

    mMatrix.translate([3, 0, 0])
      .push()
      .rotate(this.square.rotate, [1, 0, 0]);
    const squareVertices = this.square.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    this.square.getBuffer('colors', program.getAttrib('aVertexColor'));
    setMatrixUniforms();
    context.drawArrays(context.TRIANGLE_STRIP, 0, squareVertices.count);

    mMatrix.pop();
  }

  update(elapsedTime) {
    this.triangle.rotate += (90 * elapsedTime) / 1000.0;
    this.square.rotate += (75 * elapsedTime) / 1000.0;
  }
}
