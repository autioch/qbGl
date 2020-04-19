import Lib from 'lib';
import { pyramidDef, cubeDef } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.pyramidRotate = 0;
    this.cubeRotate = 0;

    this.pyramidVertices = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: pyramidDef.vertices
    });
    this.pyramidColors = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: pyramidDef.colors
    });

    this.cubeVertices = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: cubeDef.vertices
    });
    this.cubeColors = new Lib.ArrayDataBuffer(context, {
      size: 4,
      data: cubeDef.colors
    });

    this.cubeIndices = new Lib.ArrayDataBuffer(context, {
      target: context.ELEMENT_ARRAY_BUFFER,
      size: 1,
      data: new Uint16Array(cubeDef.indices)
    });
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(45, canvas.width / canvas.height, 0.1, 100.0).fillBuffer(uniforms.uPMatrix);
    this.mMatrix = new Lib.Matrix4(context).translate([-1.5, 0.0, -6.0]);
  }

  render({ context, attributes, uniforms }) {
    this.mMatrix.push().rotate(this.pyramidRotate, [0, 1, 0]).fillBuffer(uniforms.uMVMatrix).pop();
    this.pyramidVertices.fillBuffer(attributes.aVertexPosition);
    this.pyramidColors.fillBuffer(attributes.aVertexColor);
    context.drawArrays(context.TRIANGLES, 0, this.pyramidVertices.count);

    this.mMatrix.push().translate([3, 0, 0]).rotate(this.cubeRotate, [1, 1, 1]).fillBuffer(uniforms.uMVMatrix).pop();
    this.cubeVertices.fillBuffer(attributes.aVertexPosition);
    this.cubeColors.fillBuffer(attributes.aVertexColor);
    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.cubeIndices.buffer);
    context.drawElements(context.TRIANGLES, this.cubeIndices.count, context.UNSIGNED_SHORT, 0);
  }

  update({ pulse }) {
    this.pyramidRotate += (90 * pulse) / 1000.0;
    this.cubeRotate += (75 * pulse) / 1000.0;
  }
}
