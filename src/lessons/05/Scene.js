import Lib from '../../lib';
import { cubeDef } from './consts';

export default class Lesson5Scene extends Lib.Scene {
  constructor() {
    super('webgl05');

    this.program = new Lib.Program(this.context);
    this.program.setShader('shader-vs05');
    this.program.setShader('shader-fs05');
    this.program.use();

    const texture = new Lib.Texture(this.context, {
      url: 'podloga.jpg'
    });

    this.cube = new Lib.Shape(this.context);

    this.cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), this.context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('textures', new Float32Array(cubeDef.textures), this.context.ARRAY_BUFFER, 24, 2);
    this.cube.setBuffer('indices', new Uint16Array(cubeDef.indices), this.context.ELEMENT_ARRAY_BUFFER, 36, 1);
    this.cube.setTexture('podloga', texture);
    this.cube.rotate = 0;
  }

  render() {
    this.mMatrix
      .translate(cubeDef.translate)
      .push()
      .rotate(this.cube.rotate, cubeDef.rotateVertex);

    this.cube.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));
    this.cube.getBuffer('textures', this.program.getAttrib('aTextureCoord'));
    this.cube.getTexture('podloga', this.program.getUniform('uSampler'));
    const indices = this.cube.getBuff('indices');

    this.setMatrixUniforms();
    this.context.drawElements(this.context.TRIANGLES, indices.count, this.context.UNSIGNED_SHORT, 0);

    this.mMatrix.pop();
  }

  update(timeSinceLastUpdate) {
    this.cube.rotate += ((cubeDef.rotateSpeed * timeSinceLastUpdate) / 1000.0) * cubeDef.rotateDirection;
  }
}
