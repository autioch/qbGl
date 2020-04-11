import Lib from '../../lib';
import { cubeDef } from './consts';
import './glass.gif';

function getVal(id) {
  return parseFloat(document.getElementById(id).value);
}

export default class extends Lib.Scene {
  initialize({ context, el }) {
    this.textures = Lib.loadTextures(context, ['glass.gif', 'glass.gif', 'glass.gif'], (textures) => {
      context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
      textures[0].bind(context.NEAREST, context.NEAREST);
      textures[1].bind(context.LINEAR, context.LINEAR);
      textures[2].bind(context.LINEAR, context.LINEAR_MIPMAP_NEAREST);
      context.generateMipmap(context.TEXTURE_2D);
      context.bindTexture(context.TEXTURE_2D, null);
    });

    this.light = new Lib.Light(context);
    this.keyboard = Lib.keyboard({
      selector: el,
      onKeydown: this.handleKeyDown.bind(this)
    });

    this.cube = new Lib.Shape(context);
    this.cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('normals', new Float32Array(cubeDef.normals), context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('textures', new Float32Array(cubeDef.textures), context.ARRAY_BUFFER, 24, 2);
    this.cube.setBuffer('indices', new Uint16Array(cubeDef.indices), context.ELEMENT_ARRAY_BUFFER, 36, 1);
    this.cube.setTexture('0', this.textures[0]);
    this.cube.setTexture('1', this.textures[1]);
    this.cube.setTexture('2', this.textures[2]);
    this.cube.xRot = 0;
    this.cube.xSpeed = 0;
    this.cube.yRot = 0;
    this.cube.ySpeed = 0;
    this.cube.z = -5.0;
    this.cube.filter = 0;
  }

  render({ context, attributes, uniforms, mMatrix, setMatrixUniforms }) {
    mMatrix
      .translate([0.0, 0.0, this.cube.z])
      .rotate(this.cube.xRot, [1, 0, 0])
      .rotate(this.cube.yRot, [0, 1, 0]);

    this.cube.getBuffer('vertices', attributes.aVertexPosition);
    this.cube.getBuffer('normals', attributes.aVertexNormal);
    this.cube.getBuffer('textures', attributes.aTextureCoord);
    this.cube.getTexture(this.cube.filter, uniforms.uSampler);

    const lighting = document.getElementById('lighting').checked;

    context.uniform1i(uniforms.uUseLighting, lighting);
    if (lighting) {
      this.light.get3f(uniforms.uAmbientColor, getVal('ambientR'), getVal('ambientG'), getVal('ambientB'));
      this.light.get3fv(uniforms.uLightingDirection, getVal('lightDirectionX'), getVal('lightDirectionY'), getVal('lightDirectionZ'));
      this.light.get3f(uniforms.uDirectionalColor, getVal('directionalR'), getVal('directionalG'), getVal('directionalB'));
    }

    const blending = document.getElementById('blending').checked;

    if (blending) {
      context.blendFunc(context.SRC_ALPHA, context.ONE);

      context.enable(context.BLEND);
      context.disable(context.DEPTH_TEST);
      context.uniform1f(uniforms.uAlpha, getVal('alpha'));
    } else {
      context.disable(context.BLEND);
      context.enable(context.DEPTH_TEST);
    }

    const indices = this.cube.getBuff('indices');

    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indices);
    setMatrixUniforms();
    context.uniformMatrix3fv(uniforms.uNMatrix, false, mMatrix.toInvTraMat3());

    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);
  }

  update(timeSinceLastUpdate) {
    this.cube.xRot += (this.cube.xSpeed * timeSinceLastUpdate) / 1000.0;
    this.cube.yRot += (this.cube.ySpeed * timeSinceLastUpdate) / 1000.0;
    this.handleKeys();
  }

  handleKeys() {
    if (this.keyboard[33]) { // Page Up
      this.cube.z -= 0.05;
    }
    if (this.keyboard[34]) { // Page Down
      this.cube.z += 0.05;
    }
    if (this.keyboard[37]) { // Left cursor key
      this.cube.ySpeed -= 1;
    }
    if (this.keyboard[39]) { // Right cursor key
      this.cube.ySpeed += 1;
    }
    if (this.keyboard[38]) { // Up cursor key
      this.cube.xSpeed -= 1;
    }
    if (this.keyboard[40]) { // Down cursor key
      this.cube.xSpeed += 1;
    }
  }

  handleKeyDown(ev) {
    if (String.fromCharCode(ev.keyCode) === 'F') {
      this.filter += 1;
      if (this.filter === 3) {
        this.filter = 0;
      }

      document.getElementById('toolti08').textContent = `Filter: ${this.filter}`;
    }
  }
}
