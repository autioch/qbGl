import Lib from '../../lib';
import { normalData, textureCoordData, vertexPositionData, indexData } from './consts';
import './moon.gif';

export default class extends Lib.Scene2 {
  initialize({ context, el }) {
    this.light = new Lib.Light(context);
    this.effectiveFPMS = 60 / 1000;
    this.textureMoon = new Lib.Texture(context, {
      url: 'moon.gif',
      magFilter: context.LINEAR,
      minFilter: context.LINEAR_MIPMAP_NEAREST,
      mipmap: true
    });
    this.mouse = Lib.mouse({
      selector: el,
      onMove: this.mouseMove.bind(this)
    });

    this.moonRotationMatrix = new Lib.Matrix();
    this.moonRotationMatrix.identity();

    this.bufferStash = new Lib.Shape(context);

    this.bufferStash.setBuffer('normals', new Float32Array(normalData), context.ARRAY_BUFFER, normalData.length / 3, 3);
    this.bufferStash.setBuffer('textures', new Float32Array(textureCoordData), context.ARRAY_BUFFER, textureCoordData.length / 2, 2);
    this.bufferStash.setBuffer('positions', new Float32Array(vertexPositionData), context.ARRAY_BUFFER, vertexPositionData.length / 3, 3);
    this.bufferStash.setBuffer('indices', new Uint16Array(indexData), context.ELEMENT_ARRAY_BUFFER, indexData.length, 1);
    this.bufferStash.setTexture('moon', this.textureMoon);

    this.lastMouseX = null;
    this.lastMouseY = null;
  }

  render({ context, program, mMatrix, setMatrixUniforms }) {
    // const lighting = document.getElementById('lighting').checked;

    context.uniform1i(program.getUniform('uUseLighting'), false);

    //        context.uniform1i(program.getUniform("uUseLighting"), lighting);
    //        if (lighting) {
    //            light.get3f(program.getUniform("uAmbientColor"), getVal("ambientR"), getVal("ambientG"), getVal("ambientB"));
    //            light.get3fv(program.getUniform("uLightingDirection"), getVal("lightDirectionX"), getVal("lightDirectionY"), getVal("lightDirectionZ"));
    //            light.get3f(program.getUniform("uDirectionalColor"), getVal("directionalR"), getVal("directionalG"), getVal("directionalB"));
    //        }

    mMatrix
      .translate([0, 0, -6])
      .multiply(this.moonRotationMatrix);

    this.bufferStash.getTexture('moon', program.getUniform('uSampler'));
    this.bufferStash.getBuffer('positions', program.getAttrib('aVertexPosition'));
    this.bufferStash.getBuffer('textures', program.getAttrib('aTextureCoord'));
    this.bufferStash.getBuffer('normals', program.getAttrib('aVertexNormal'));

    const indices = this.bufferStash.getBuff('indices');

    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indices);
    setMatrixUniforms();
    context.uniformMatrix3fv(program.getUniform('uNMatrix'), false, mMatrix.toInvTraMat3());

    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);
  }

  mouseMove(ev) {
    const newX = ev.clientX;
    const newY = ev.clientY;
    const newRotationMatrix = new Lib.Matrix();

    newRotationMatrix
      .identity()
      .rotate((newX - this.lastMouseX) / 10, [0, 1, 0])
      .rotate((newY - this.lastMouseY) / 10, [1, 0, 0]);

    this.moonRotationMatrix.multiply(newRotationMatrix);
    this.lastMouseX = newX;
    this.lastMouseY = newY;
  }
}
