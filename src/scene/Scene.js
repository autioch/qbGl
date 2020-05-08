import Lib from 'lib';
import Lawn from './grass/Lawn';
import Tree from './tree/Tree';
import Butterfly from './butterfly/Butterfly';
import Oscillate from './Oscillate';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.lawn = new Lawn(context);
    this.tree = new Tree(context);
    this.butterflies = [
      [1.0, 1.0, 1.0],
      [0.0, 1.0, 1.0],
      [1.0, 0.0, 1.0],
      [1.0, 1.0, 0.0]
    ].map((color) => new Butterfly(context, color));

    this.rotateY = 0;
    this.translation = [0, -250, -1000];
    this.scale = [1, 1, 1];
    this.lightDirection = new Oscillate();
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(Lib.degToRad(70), canvas.clientWidth / canvas.clientHeight, 300, 2000).fillBuffer(uniforms.u_worldViewProjection);
    this.uMatrix = new Lib.Matrix4(context);
    this.lightDirectionVec = new Lib.Vec3(1, 1, 1);
    this.directionColorVec = new Lib.Vec3(0.8, 0.8, 0.8);
    this.ambientColorVec = new Lib.Vec3(0.2, 0.2, 0.2);
  }

  render({ context, attributes, uniforms }) {
    this.lightDirectionVec.x = this.lightDirection.value;
    this.lightDirectionVec.fillUniform(context, uniforms.uLightingDirection);
    this.directionColorVec.fillUniform(context, uniforms.uDirectionalColor);
    this.ambientColorVec.fillUniform(context, uniforms.uAmbientColor);

    this.uMatrix
      .push()
      .translate(this.translation)
      .scale(this.scale)
      .rotateY(Lib.degToRad(this.rotateY));

    context.uniformMatrix3fv(uniforms.u_worldInverseTranspose, false, this.uMatrix.toInvTraMat3());

    this.lawn.render(this.uMatrix, uniforms.uMVMatrix, attributes.a_color, attributes.a_position, attributes.a_normal);
    this.tree.render(this.uMatrix, uniforms.uMVMatrix, attributes.a_color, attributes.a_position, attributes.a_normal);

    this.butterflies.forEach((butterfly) => {
      butterfly.render(this.uMatrix, uniforms.uMVMatrix, attributes.a_color, attributes.a_position, attributes.a_normal);
    });

    this.uMatrix.pop();
  }

  update({ pulse }) {
    this.butterflies.forEach((butterfly) => butterfly.update({
      pulse
    }));
    this.lightDirection.update({
      pulse
    });

    // this.rotateY += pulse / 50;
  }
}
