import Lib from '../../lib';
import { cubeDef } from './consts';

const scene = new Lib.Scene('webgl06');

const context = scene.get();

const texturesLoaded = function() {
  this.loaded = true;
  for (let i = 0; i < textures.length; i++) {
    if (!textures[i].loaded) {
      return;
    }
  }
  context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
  textures[0].bind(context.NEAREST, context.NEAREST);
  textures[1].bind(context.LINEAR, context.LINEAR);
  textures[2].bind(context.LINEAR, context.LINEAR_MIPMAP_NEAREST);
  context.generateMipmap(context.TEXTURE_2D);
  context.bindTexture(context.TEXTURE_2D, null);
};

var textures = [
  new Lib.Texture(context, {
    url: 'podloga.jpg',
    onload: texturesLoaded
  }),
  new Lib.Texture(context, {
    url: 'podloga.jpg',
    onload: texturesLoaded
  }),
  new Lib.Texture(context, {
    url: 'podloga.jpg',
    onload: texturesLoaded
  })
];

export default class Lesson5Scene extends Lib.Scene {
  constructor() { // eslint-disable-line max-statements
    super('webgl06');

    this.program = new Lib.Program(this.context);
    this.program.setShader('shader-vs05');
    this.program.setShader('shader-fs05');
    this.program.use();

    this.cube = new Lib.Shape(context);

    this.cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('textures', new Float32Array(cubeDef.textures), context.ARRAY_BUFFER, 24, 2);
    this.cube.setBuffer('indices', new Uint16Array(cubeDef.indices), context.ELEMENT_ARRAY_BUFFER, 36, 1);
    this.cube.setTexture('0', textures[0]);
    this.cube.setTexture('1', textures[1]);
    this.cube.setTexture('2', textures[2]);
    this.cube.xRot = 0;
    this.cube.xSpeed = 0;
    this.cube.yRot = 0;
    this.cube.ySpeed = 0;
    this.cube.z = -5.0;
    this.cube.filter = 0;

    this.currentlyPressedKeys = {};

    this.container = document.getElementById('container06');

    this.container.onkeydown = this.handleKeyDown.bind(this);
    this.container.onkeyup = this.handleKeyUp.bind(this);
  }

  handleKeyDown(ev) {
    this.currentlyPressedKeys[ev.keyCode] = true;

    if (String.fromCharCode(ev.keyCode) == 'F') {
      this.cube.filter += 1;
      if (this.cube.filter === 3) {
        this.cube.filter = 0;
      }
      document.getElementById('tooltip06').textContent = `Filter: ${cube.filter}`;
    }
  }

  handleKeyUp(ev) {
    this.currentlyPressedKeys[ev.keyCode] = false;
  }

  render() {
    this.mMatrix
      .translate([0.0, 0.0, cube.z])

    // .push()
      .rotate(cube.xRot, [1, 0, 0])
      .rotate(cube.yRot, [0, 1, 0]);

    cube.getBuffer('vertices', program.getAttrib('aVertexPosition'));
    cube.getBuffer('textures', program.getAttrib('aTextureCoord'));
    cube.getTexture(cube.filter, program.getUniform('uSampler'));

    const indices = cube.getBuff('indices');

    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indices);
    this.setMatrixUniforms();
    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);

  // this.mMatrix.pop();
  }

  update(timeSinceLastUpdate) {
    cube.xRot += (cube.xSpeed * timeSinceLastUpdate) / 1000.0;
    cube.yRot += (cube.ySpeed * timeSinceLastUpdate) / 1000.0;
    this.handleKeys();
  }

  handleKeys() {
    if (currentlyPressedKeys[33]) {
      // Page Up
      this.cube.z -= 0.05;
    }
    if (currentlyPressedKeys[34]) {
      // Page Down
      cube.z += 0.05;
    }
    if (currentlyPressedKeys[37]) {
      // Left cursor key
      cube.ySpeed -= 1;
    }
    if (currentlyPressedKeys[39]) {
      // Right cursor key
      cube.ySpeed += 1;
    }
    if (currentlyPressedKeys[38]) {
      // Up cursor key
      cube.xSpeed -= 1;
    }
    if (currentlyPressedKeys[40]) {
      // Down cursor key
      cube.xSpeed += 1;
    }
  }
}
