import Lib from '../../lib';
import { pyramidDef, cubeDef } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.pyramid = new Lib.Shape(context);

    this.pyramid.setBuffer('vertices', new Float32Array(pyramidDef.vertices), context.ARRAY_BUFFER, 12, 3);
    this.pyramid.setBuffer('colors', new Float32Array(pyramidDef.colors), context.ARRAY_BUFFER, 12, 4);
    this.pyramid.rotate = 0;

    this.cube = new Lib.Shape(context);

    this.cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), context.ARRAY_BUFFER, 24, 3);
    this.cube.setBuffer('colors', new Float32Array(cubeDef.colors), context.ARRAY_BUFFER, 24, 4);
    this.cube.setBuffer('indices', new Uint16Array(cubeDef.indices), context.ELEMENT_ARRAY_BUFFER, 36, 1);
    this.cube.rotate = 0;
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(45, canvas.width / canvas.height, 0.1, 100.0).fillBuffer(uniforms.uPMatrix);
    this.mMatrix = new Lib.Matrix4(context).translate([-1.5, 0.0, -6.0]);
  }

  render({ context, attributes, uniforms }) {
    this.mMatrix.push().rotate(this.pyramid.rotate, [0, 1, 0]).fillBuffer(uniforms.uMVMatrix)
      .pop();
    const pyramidVertices = this.pyramid.getBuffer('vertices', attributes.aVertexPosition);

    this.pyramid.getBuffer('colors', attributes.aVertexColor);
    context.drawArrays(context.TRIANGLES, 0, pyramidVertices.count);

    this.mMatrix.push().translate([3, 0, 0]).rotate(this.cube.rotate, [1, 1, 1])
      .fillBuffer(uniforms.uMVMatrix)
      .pop();

    this.cube.getBuffer('vertices', attributes.aVertexPosition);
    this.cube.getBuffer('colors', attributes.aVertexColor);

    const indices = this.cube.getBuff('indices');

    context.bindBuffer(indices.type, indices);
    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);
  }

  update({ pulse }) {
    this.pyramid.rotate += (90 * pulse) / 1000.0;
    this.cube.rotate += (75 * pulse) / 1000.0;
  }
}
