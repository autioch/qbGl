import Lib from 'lib';
import Lawn from './grass/Lawn';
import Tree from './tree/Tree';
import Butterfly from './butterfly/Butterfly';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.lawn = new Lawn(context);
    this.tree = new Tree(context);
    this.butterfly1 = new Butterfly(context, [1.0, 0.0, 1.0]);
    this.butterfly2 = new Butterfly(context, [1.0, 1.0, 0.0]);

    this.rotateY = 0;
    this.translation = [0, -200, -800];
    this.scale = [1, 1, 1];
  }

  ready({ context, canvas, uniforms }) {
    this.pMatrix = new Lib.Matrix4(context).perspective(Lib.degToRad(70), canvas.clientWidth / canvas.clientHeight, 1, 2000).fillBuffer(uniforms.uPMatrix);
    this.uMatrix = new Lib.Matrix4(context);
    this.lightDirectionVec = new Lib.Vec3(1, 1, 1);
    this.directionColorVec = new Lib.Vec3(0.8, 0.8, 0.8);
    this.ambientColorVec = new Lib.Vec3(0.2, 0.2, 0.2);
  }

  render({ context, attributes, uniforms }) {
    this.lightDirectionVec.fillUniform(context, uniforms.uLightingDirection);
    this.directionColorVec.fillUniform(context, uniforms.uDirectionalColor);
    this.ambientColorVec.fillUniform(context, uniforms.uAmbientColor);

    this.uMatrix
      .push()
      .translate(this.translation)
      .scale(this.scale)
      .rotateY(Lib.degToRad(this.rotateY));

    context.uniformMatrix3fv(uniforms.uNMatrix, false, this.uMatrix.toInvTraMat3());

    this.lawn.render(this.uMatrix, uniforms.uMVMatrix, attributes.a_color, attributes.a_position, attributes.a_normal);
    this.tree.render(this.uMatrix, uniforms.uMVMatrix, attributes.a_color, attributes.a_position, attributes.a_normal);

    this.uMatrix.translate([200, 200, 200]);
    this.butterfly1.render(this.uMatrix, uniforms.uMVMatrix, attributes.a_color, attributes.a_position, attributes.a_normal);
    this.uMatrix.rotateY(Lib.degToRad(90));
    this.butterfly2.render(this.uMatrix, uniforms.uMVMatrix, attributes.a_color, attributes.a_position, attributes.a_normal);

    this.uMatrix.pop();
  }

  update({ pulse }) {
    this.butterfly1.update();
    this.butterfly2.update();

    this.rotateY += pulse / 50;
  }
}
