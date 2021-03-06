import Lib from 'lib';
import { cubeDef } from './consts';
import './podloga.jpg';

export default class extends Lib.Scene {
  initialize({ context }) {
    const texture = new Lib.Texture(context, {
      url: 'podloga.jpg'
    });

    this.cube = new Lib.Shape(context);

    this.cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('textures', new Float32Array(cubeDef.textures), context.ARRAY_BUFFER, 24, 2);
    this.cube.setBuffer('indices', new Uint16Array(cubeDef.indices), context.ELEMENT_ARRAY_BUFFER, 36, 1);
    this.cube.setTexture('podloga', texture);
    this.cube.rotate = 0;
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(45, canvas.width / canvas.height, 0.1, 100.0).fillBuffer(uniforms.uPMatrix);
    this.mMatrix = new Lib.Matrix4(context).translate(cubeDef.translate);
  }

  render({ context, attributes, uniforms }) {
    this.mMatrix
      .push()
      .rotate(this.cube.rotate, cubeDef.rotateVertex)
      .fillBuffer(uniforms.uMVMatrix)
      .pop();

    this.cube.getBuffer('vertices', attributes.aVertexPosition);
    this.cube.getBuffer('textures', attributes.aTextureCoord);
    this.cube.getTexture('podloga', uniforms.uSampler);
    const indices = this.cube.getBuff('indices');

    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);
  }

  update({ pulse }) {
    this.cube.rotate += ((cubeDef.rotateSpeed * pulse) / 1000.0) * cubeDef.rotateDirection;
  }
}
