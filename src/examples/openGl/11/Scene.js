import Lib from 'lib';
import { normalData, textureCoordData, vertexPositionData, indexData } from './consts';
import './moon.gif';

export default class extends Lib.Scene {
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

    this.moonRotationMatrix = new Lib.Matrix4();

    this.bufferStash = new Lib.Shape(context);

    this.bufferStash.setBuffer('normals', new Float32Array(normalData), context.ARRAY_BUFFER, normalData.length / 3, 3);
    this.bufferStash.setBuffer('textures', new Float32Array(textureCoordData), context.ARRAY_BUFFER, textureCoordData.length / 2, 2);
    this.bufferStash.setBuffer('positions', new Float32Array(vertexPositionData), context.ARRAY_BUFFER, vertexPositionData.length / 3, 3);
    this.bufferStash.setBuffer('indices', new Uint16Array(indexData), context.ELEMENT_ARRAY_BUFFER, indexData.length, 1);
    this.bufferStash.setTexture('moon', this.textureMoon);

    this.lastMouseX = null;
    this.lastMouseY = null;
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(45, canvas.width / canvas.height, 0.1, 100.0).fillBuffer(uniforms.uPMatrix);
    this.mMatrix = new Lib.Matrix4(context);
  }

  render({ context, attributes, uniforms }) {
    // const lighting = document.getElementById('lighting').checked;

    context.uniform1i(uniforms.uUseLighting, false);

    //        context.uniform1i(program.locateUniform("uUseLighting"), lighting);
    //        if (lighting) {
    //            light.get3f(program.locateUniform("uAmbientColor"), getVal("ambientR"), getVal("ambientG"), getVal("ambientB"));
    //            light.get3fv(program.locateUniform("uLightingDirection"), getVal("lightDirectionX"), getVal("lightDirectionY"), getVal("lightDirectionZ"));
    //            light.get3f(program.locateUniform("uDirectionalColor"), getVal("directionalR"), getVal("directionalG"), getVal("directionalB"));
    //        }

    this.mMatrix
      .push()
      .translate([0, 0, -6])
      .multiply(this.moonRotationMatrix)
      .fillBuffer(uniforms.uMVMatrix);

    this.bufferStash.getTexture('moon', uniforms.uSampler);
    this.bufferStash.getBuffer('positions', attributes.aVertexPosition);
    this.bufferStash.getBuffer('textures', attributes.aTextureCoord);
    this.bufferStash.getBuffer('normals', attributes.aVertexNormal);

    const indices = this.bufferStash.getBuff('indices');

    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indices);
    context.uniformMatrix3fv(uniforms.uNMatrix, false, this.mMatrix.toInvTraMat3());
    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);

    this.mMatrix.pop();
  }

  mouseMove(ev) {
    const newX = ev.clientX;
    const newY = ev.clientY;
    const newRotationMatrix = new Lib.Matrix4()
      .rotate((newX - this.lastMouseX) / 10, [0, 1, 0])
      .rotate((newY - this.lastMouseY) / 10, [1, 0, 0]);

    this.moonRotationMatrix.multiply(newRotationMatrix);
    this.lastMouseX = newX;
    this.lastMouseY = newY;
  }
}
