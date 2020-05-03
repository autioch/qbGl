import Lib from 'lib';
import { normals, vertices } from './consts';
import { customLookAt } from './utils';
const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.shape = new Lib.ColorShape(context, {
      vertices,
      normals
    });

    this.fieldOfViewRadians = degToRad(60);
    this.fRotationRadians = 0;
  }

  ready({ context, canvas }) {
    this.viewMatrix = new Lib.Matrix4(context, customLookAt([100, 150, 200], [0, 35, 0], [0, 1, 0])).invert();
    this.viewProjectionMatrix = new Lib.Matrix4(context)
      .perspective(this.fieldOfViewRadians, canvas.clientWidth / canvas.clientHeight, 1, 2000)
      .multiply(this.viewMatrix);

    this.colorVec = new Lib.Vec4(0.2, 1, 0.2, 1);
    this.lightVec = new Lib.Vec3(0.5, 0.7, 1).normalize();
  }

  render({ context, uniforms, attributes }) {
    const worldMatrix = new Lib.Matrix4(context).rotateY(degToRad(this.fRotationRadians));

    this.viewProjectionMatrix.push().multiply(worldMatrix).fillBuffer(uniforms.u_worldViewProjection).pop();

    worldMatrix.invert().transpose().fillBuffer(uniforms.u_worldInverseTranspose);

    this.colorVec.fillUniform(context, uniforms.u_color);
    this.lightVec.fillUniform(context, uniforms.u_reverseLightDirection);

    this.shape.render(undefined, attributes.a_position, attributes.a_normal);
  }

  update() {
    this.fRotationRadians++;
  }
}
