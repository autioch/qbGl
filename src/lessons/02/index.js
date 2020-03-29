import Lib from '../../lib';
import { TRIANGLE_DEF, SQUARE_DEF } from './consts';

import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  title: 'Colors',
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition', 'aVertexColor']
  },
  fsh: {
    source: fsh
  },
  Scene: class Lesson1 extends Lib.Scene2 {
    initialize({ context }) {
      this.triangle = new Lib.Shape(context);
      this.triangle.setBuffer('vertices', new Float32Array(TRIANGLE_DEF.vertices), context.ARRAY_BUFFER, 3, 3);
      this.triangle.setBuffer('colors', new Float32Array(TRIANGLE_DEF.colors), context.ARRAY_BUFFER, 3, 4);

      this.square = new Lib.Shape(context);
      this.square.setBuffer('vertices', new Float32Array(SQUARE_DEF.vertices), context.ARRAY_BUFFER, 4, 3);
      this.square.setBuffer('colors', new Float32Array(SQUARE_DEF.colors), context.ARRAY_BUFFER, 4, 4);
    }

    render({ context, program, mMatrix, setMatrixUniforms }) {
      mMatrix.translate([-1.5, 0.0, -6.0]);

      const triangleVertices = this.triangle.getBuffer('vertices', program.getAttrib('aVertexPosition'));

      this.triangle.getBuffer('colors', program.getAttrib('aVertexColor'));
      setMatrixUniforms();
      context.drawArrays(context.TRIANGLES, 0, triangleVertices.count);

      mMatrix.translate([3, 0, 0]);
      const squareVertices = this.square.getBuffer('vertices', program.getAttrib('aVertexPosition'));

      this.square.getBuffer('colors', program.getAttrib('aVertexColor'));
      setMatrixUniforms();
      context.drawArrays(context.TRIANGLE_STRIP, 0, squareVertices.count);
    }
  }
};
