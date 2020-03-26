import Lib from '../../lib';
import { cubeDef } from './consts';

export default class Lesson5Scene extends Lib.Scene {
  constructor() { // eslint-disable-line max-statements
    super('webgl06');

    this.program = new Lib.Program(this.context);
    this.program.setShader('shader-vs05');
    this.program.setShader('shader-fs05');
    this.program.use();

    this.cube = new Lib.Shape(this.context);
    this.textures = Lib.loadTextures(this.context, ['podloga.jpg', 'podloga.jpg', 'podloga.jpg'], (textures) => {
      this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, true);
      textures[0].bind(this.context.NEAREST, this.context.NEAREST);
      textures[1].bind(this.context.LINEAR, this.context.LINEAR);
      textures[2].bind(this.context.LINEAR, this.context.LINEAR_MIPMAP_NEAREST);
      this.context.generateMipmap(this.context.TEXTURE_2D);
      this.context.bindTexture(this.context.TEXTURE_2D, null);
    });

    this.cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), this.context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('textures', new Float32Array(cubeDef.textures), this.context.ARRAY_BUFFER, 24, 2);
    this.cube.setBuffer('indices', new Uint16Array(cubeDef.indices), this.context.ELEMENT_ARRAY_BUFFER, 36, 1);
    this.cube.setTexture('0', this.textures[0]);
    this.cube.setTexture('1', this.textures[1]);
    this.cube.setTexture('2', this.textures[2]);
    this.xRot = 0;
    this.xSpeed = 0;
    this.yRot = 0;
    this.ySpeed = 0;
    this.z = -5.0;
    this.filter = 0;

    this.keyboard = Lib.keyboard({
      selector: document.getElementById('container06'),
      onKeydown: this.handleKeyDown.bind(this)
    });
  }

  handleKeyDown(ev) {
    if (String.fromCharCode(ev.keyCode) === 'F') {
      this.filter += 1;
      if (this.filter === 3) {
        this.filter = 0;
      }
      document.getElementById('tooltip06').textContent = `Filter: ${this.filter}`;
    }
  }

  render() {
    this.mMatrix
      .translate([0.0, 0.0, this.z])
      .rotate(this.xRot, [1, 0, 0])
      .rotate(this.yRot, [0, 1, 0]);

    this.cube.getBuffer('vertices', this.program.getAttrib('aVertexPosition'));
    this.cube.getBuffer('textures', this.program.getAttrib('aTextureCoord'));
    this.cube.getTexture(this.filter, this.program.getUniform('uSampler'));

    const indices = this.cube.getBuff('indices');

    this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, indices);
    this.setMatrixUniforms();
    this.context.drawElements(this.context.TRIANGLES, indices.count, this.context.UNSIGNED_SHORT, 0);
  }

  update(timeSinceLastUpdate) {
    this.xRot += (this.xSpeed * timeSinceLastUpdate) / 1000.0;
    this.yRot += (this.ySpeed * timeSinceLastUpdate) / 1000.0;
    this.handleKeys();
  }

  handleKeys() {
    if (this.keyboard[33]) { // Page Up
      this.z -= 0.05;
    }
    if (this.keyboard[34]) { // Page Down
      this.z += 0.05;
    }
    if (this.keyboard[37]) { // Left cursor key
      this.ySpeed -= 1;
    }
    if (this.keyboard[39]) { // Right cursor key
      this.ySpeed += 1;
    }
    if (this.keyboard[38]) { // Up cursor key
      this.xSpeed -= 1;
    }
    if (this.keyboard[40]) { // Down cursor key
      this.xSpeed += 1;
    }
  }
}
