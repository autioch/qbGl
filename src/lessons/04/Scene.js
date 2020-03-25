import Lib from '../../lib';
import { pyramidDef, cubeDef } from './consts';

export default class Lesson4Scene extends Lib.Scene {
  constructor() {
    super('webgl04');
    this.program = new Lib.Program(this.context);

    this.program.setShader('shader-vs02');
    this.program.setShader('shader-fs02');
    this.program.use();

    this.pyramid = new Lib.Shape(this.context);

    this.pyramid.setBuffer('vertices', new Float32Array(pyramidDef.vertices), this.context.ARRAY_BUFFER, 12, 3);
    this.pyramid.setBuffer('colors', new Float32Array(pyramidDef.colors), this.context.ARRAY_BUFFER, 12, 4);
    this.pyramid.rotate = 0;

    this.cube = new Lib.Shape(this.context);

    this.cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), this.context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('colors', new Float32Array(cubeDef.colors), this.context.ARRAY_BUFFER, 24, 4);
    this.cube.setBuffer('indices', new Uint16Array(cubeDef.indices), this.context.ELEMENT_ARRAY_BUFFER, 36, 1);
    this.cube.rotate = 0;
  }

  render() {
    this.mMatrix
      .translate([-1.5, 0.0, -6.0])
      .push()
      .rotate(this.pyramid.rotate, [0, 1, 0]);
    const pyramidVertices = this.pyramid.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));

    this.pyramid.getBuffer('colors', this.program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    this.context.drawArrays(this.context.TRIANGLES, 0, pyramidVertices.count);

    this.mMatrix.pop();

    this.mMatrix.translate([3, 0, 0])
      .push()
      .rotate(this.cube.rotate, [1, 1, 1]);

    this.cube.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));
    this.cube.getBuffer('colors', this.program.getAttrib('aVertexColor'));

    const indices = this.cube.getBuff('indices');

    this.context.bindBuffer(indices.type, indices);
    this.setMatrixUniforms();
    this.context.drawElements(this.context.TRIANGLES, indices.count, this.context.UNSIGNED_SHORT, 0);

    this.mMatrix.pop();
  }

  update(elapsedTime) {
    this.pyramid.rotate += (90 * elapsedTime) / 1000.0;
    this.cube.rotate += (75 * elapsedTime) / 1000.0;
  }
}
