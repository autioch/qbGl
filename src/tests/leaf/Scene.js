import Lib from '../../lib';

import Earth from './grass/Earth';
import Lawn from './grass/Lawn';
import Tree from './tree/Tree';
import Wing from './butterfly/Wing';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.lawn = new Lawn(context);
    this.earth = new Earth(context);
    this.tree = new Tree(context);
    this.wing = new Wing(context);

    this.rotationDegrees = 0;
    this.rotation = [0, 0, 0];
    this.translation = [0, -200, -800];
    this.scale = [1, 1, 1];
    this.axes = new Lib.Axes(context);
  }

  ready({ context, canvas }) {
    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.uMatrix = new Lib.Matrix4(context)
      .perspective(Lib.degToRad(70), aspect, 1, 2000);
  }

  render({ attributes, uniforms }) {
    this.uMatrix.push();
    this.uMatrix
      .translate(this.translation)
      .scale(this.scale)
      .rotateX(Lib.degToRad(this.rotation[0]))
      .rotateY(Lib.degToRad(this.rotation[1]))
      .rotateZ(Lib.degToRad(this.rotation[2]));

    this.uMatrix.fillBuffer(uniforms.u_matrix);
    this.axes.render(attributes.a_color, attributes.a_position);

    this.earth.render(attributes.a_color, attributes.a_position);
    this.lawn.render(this.uMatrix, uniforms.u_matrix, attributes.a_color, attributes.a_position);
    this.tree.render(this.uMatrix, uniforms.u_matrix, attributes.a_color, attributes.a_position);

    this.uMatrix.translate([200, 200, 200]);
    this.uMatrix.fillBuffer(uniforms.u_matrix);
    this.wing.render(attributes.a_color, attributes.a_position);
    this.uMatrix.pop();
  }

  update({ pulse }) {
    this.rotation[1] += pulse / 100;
  }
}
