import Lib from '../../lib';
import { TRIANGLE_DEF, SQUARE_DEF } from './consts';

class Lesson2Scene extends Lib.Scene {
  constructor() {
    super('webgl02');

    this.triangle = new Lib.Shape(this.context);
    this.triangle.setBuffer('vertices', new Float32Array(TRIANGLE_DEF.vertices), this.context.ARRAY_BUFFER, 3, 3);
    this.triangle.setBuffer('colors', new Float32Array(TRIANGLE_DEF.colors), this.context.ARRAY_BUFFER, 3, 4);

    this.square = new Lib.Shape(this.context);
    this.square.setBuffer('vertices', new Float32Array(SQUARE_DEF.vertices), this.context.ARRAY_BUFFER, 4, 3);
    this.square.setBuffer('colors', new Float32Array(SQUARE_DEF.colors), this.context.ARRAY_BUFFER, 4, 4);

    this.program = new Lib.Program(this.context);
    this.program.setShader('shader-vs02');
    this.program.setShader('shader-fs02');
    this.program.use();
  }

  render() {
    this.mMatrix.translate([-1.5, 0.0, -6.0]);

    const triangleVertices = this.triangle.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));

    this.triangle.getBuffer('colors', this.program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    this.context.drawArrays(this.context.TRIANGLES, 0, triangleVertices.count);

    this.mMatrix.translate([3, 0, 0]);
    const squareVertices = this.square.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));

    this.square.getBuffer('colors', this.program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, squareVertices.count);
  }
}

export default Lesson2Scene;
