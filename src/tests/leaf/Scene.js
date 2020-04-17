import Lib from '../../lib';

import Lawn from './grass/Lawn';
import Earth from './grass/Earth';
import Leaf from './tree/leaf';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.lawn = new Lawn(context);
    this.earth = new Earth(context);
    this.leaf = new Leaf(context);

    this.rotationDegrees = 0;
    this.rotation = [0, 0, 0];
    this.translation = [0, -50, -500];
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

    this.leaf.render(attributes.a_color, attributes.a_position);
    this.earth.render(attributes.a_color, attributes.a_position);
    this.lawn.render(this.uMatrix, uniforms.u_matrix, attributes.a_color, attributes.a_position);

    this.uMatrix.pop();
  }

  update() {
    this.rotation[1]++;
  }
}
