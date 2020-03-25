import Lib from '../../lib';
import { triangleDef, squareDef } from './consts';

class Lesson3Scene extends Lib.Scene {
  constructor() {
    super('webgl03');

    this.triangle = new Lib.Shape(this.context);
    this.triangle.setBuffer('vertices', new Float32Array(triangleDef.vertices), this.context.ARRAY_BUFFER, 3, 3);
    this.triangle.setBuffer('colors', new Float32Array(triangleDef.colors), this.context.ARRAY_BUFFER, 3, 4);
    this.triangle.rotate = 0;

    this.square = new Lib.Shape(this.context);
    this.square.setBuffer('vertices', new Float32Array(squareDef.vertices), this.context.ARRAY_BUFFER, 4, 3);
    this.square.setBuffer('colors', new Float32Array(squareDef.colors), this.context.ARRAY_BUFFER, 4, 4);
    this.square.rotate = 0;

    this.program = new Lib.Program(this.context);
    this.program.setShader('shader-vs02');
    this.program.setShader('shader-fs02');
    this.program.use();
  }

  render() {
    this.mMatrix
      .translate([-1.5, 0.0, -6.0])
      .push()
      .rotate(this.triangle.rotate, [0, 1, 0]);
    const triangleVertices = this.triangle.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));

    this.triangle.getBuffer('colors', this.program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    this.context.drawArrays(this.context.TRIANGLES, 0, triangleVertices.count);

    this.mMatrix.pop();

    this.mMatrix.translate([3, 0, 0])
      .push()
      .rotate(this.square.rotate, [1, 0, 0]);
    const squareVertices = this.square.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));

    this.square.getBuffer('colors', this.program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, squareVertices.count);

    this.mMatrix.pop();
  }

  update(elapsedTime) {
    this.triangle.rotate += (90 * elapsedTime) / 1000.0;
    this.square.rotate += (75 * elapsedTime) / 1000.0;
  }
}

export default Lesson3Scene;
