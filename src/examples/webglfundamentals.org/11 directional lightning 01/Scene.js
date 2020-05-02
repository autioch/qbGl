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

  matrices(context, canvas, uniforms) {
    const mat = {};

    mat.projectionMatrix = new Lib.Matrix4(context).perspective(this.fieldOfViewRadians, canvas.clientWidth / canvas.clientHeight, 1, 2000);
    mat.projectionMatrix = new Lib.Matrix4(context, [1.7741094827651978, 0, 0, 0, 0, 1.7320507764816284, 0, 0, 0, 0, -1.0010005235671997, -1, 0, 0, -2.00100040435791, 0]);
    mat.cameraMatrix = new Lib.Matrix4(context, customLookAt([100, 150, 200], [0, 35, 0], [0, 1, 0]));
    mat.viewMatrix = new Lib.Matrix4(context, mat.cameraMatrix.clone().get()).invert();
    mat.viewProjectionMatrix = new Lib.Matrix4(context, mat.projectionMatrix.multiply(mat.viewMatrix).clone().get());
    mat.worldMatrix = new Lib.Matrix4(context).rotateY(degToRad(this.fRotationRadians));
    mat.worldViewProjectionMatrix = new Lib.Matrix4(context, mat.viewProjectionMatrix.clone().multiply(mat.worldMatrix).get());
    mat.worldInverseTransposeMatrix = new Lib.Matrix4(context, mat.worldMatrix.clone().invert().transpose().get());

    Object.entries(mat).forEach(([key, val]) => console.log(key, Array.from(val.get()).map((v) => Math.round(v))));
    mat.worldViewProjectionMatrix.fillBuffer(uniforms.u_worldViewProjection);
    mat.worldInverseTransposeMatrix.fillBuffer(uniforms.u_worldInverseTranspose);

    // const _worldViewProjectionMatrix = new Lib.Matrix4(context, [1.5868117809295654, -0.35426566004753113, -0.3980979323387146, -0.3977000117301941, 0, 1.5402854681015015, -0.4578125774860382, -0.45735499262809753, -0.7934058904647827, -0.7085313200950623, -0.7961958646774292, -0.7954000234603882, 0, -53.90998458862305, 265.7198486328125, 267.4532470703125]);
    // const _worldInverseTransposeMatrix = new Lib.Matrix4(context, [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]);
    //
    // _worldViewProjectionMatrix.fillBuffer(uniforms.u_worldViewProjection);
    // _worldInverseTransposeMatrix.fillBuffer(uniforms.u_worldInverseTranspose);
  }

  render({ context, canvas, uniforms, attributes }) {
    this.matrices(context, canvas, uniforms);
    context.uniform4fv(uniforms.u_color, [0.2, 1, 0.2, 1]);
    context.uniform3fv(uniforms.u_reverseLightDirection, new Lib.Vec3(0.5, 0.7, 1).normalize());

    this.shape.render(undefined, attributes.a_position, attributes.a_normal);
  }

  update() {
    this.fRotationRadians++;
  }
}
