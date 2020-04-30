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

  ready({ context, canvas }) {
    this.uMatrix = new Lib.Matrix4(context).perspective(Lib.degToRad(70), canvas.clientWidth / canvas.clientHeight, 1, 2000);
  }

  render({ attributes, uniforms }) {
    this.uMatrix
      .push()
      .translate(this.translation)
      .scale(this.scale)
      .rotateY(Lib.degToRad(this.rotateY));

    this.lawn.render(this.uMatrix, uniforms.u_matrix, attributes.a_color, attributes.a_position);
    this.tree.render(this.uMatrix, uniforms.u_matrix, attributes.a_color, attributes.a_position);

    this.uMatrix.translate([200, 200, 200]);
    this.butterfly1.render(this.uMatrix, uniforms.u_matrix, attributes.a_color, attributes.a_position);
    this.uMatrix.rotateY(Lib.degToRad(90));
    this.butterfly2.render(this.uMatrix, uniforms.u_matrix, attributes.a_color, attributes.a_position);

    this.uMatrix.pop();
  }

  update({ pulse }) {
    this.butterfly1.update();
    this.butterfly2.update();

    this.rotateY += pulse / 50;
  }
}
