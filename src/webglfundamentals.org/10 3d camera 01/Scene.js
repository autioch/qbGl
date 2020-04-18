import Lib from '../../lib';
import { positions, colors } from './consts';
import { customLookAt } from './utils';

const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.position = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: positions
    });

    this.color = new Lib.ArrayDataBuffer(context, {
      size: 3,
      data: new Uint8Array(colors),
      normalize: true,
      type: context.UNSIGNED_BYTE
    });

    this.fieldOfViewRadians = degToRad(60);
    this.numFs = 5;
    this.radius = 200;
    this.cameraDegrees = 0;

    this.axes = new Lib.Axes(context);
  }

  ready({ context, canvas }) {
    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.pMatrix = new Lib.Matrix4(context).perspective(this.fieldOfViewRadians, aspect, 1, 2000);
  }

  calculateViewMatrix(context) {
    const cameraPosition = new Lib.Matrix4(context)
      .rotateY(degToRad(this.cameraDegrees))
      .translate([0, 0, this.radius * 1.5])
      .getCamera();

    return new Lib.Matrix4(context, customLookAt(cameraPosition, [this.radius, 0, 0], [0, 1, 0])).invert();
  }

  render({ context, uniforms, attributes }) {
    const viewMatrix = this.calculateViewMatrix(context);

    this.position.fillBuffer(attributes.a_position);
    this.color.fillBuffer(attributes.a_color);
    this.pMatrix.push().multiply(viewMatrix);

    for (let ii = 0; ii < this.numFs; ++ii) {
      const angle = ii * Math.PI * 2 / this.numFs;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;

      this.pMatrix
        .push()
        .translate([x, 0, y])

        .rotate(Lib.degToRad(10), [90, 0, 0])
        .fillBuffer(uniforms.u_matrix)
        .pop();

      context.drawArrays(context.TRIANGLES, 0, 16 * 6);
    }
    this.pMatrix.pop();

    this.axes.render(attributes.a_color, attributes.a_position);
  }

  update() {
    this.cameraDegrees++;
  }
}
