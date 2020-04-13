import Lib from '../../lib';
import { positions, colors } from './consts';

const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.fieldOfViewRadians = degToRad(60);
    this.cameraDegrees = 0;
    this.numFs = 5;
    this.radius = 100;

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
  }

  ready({ context, canvas }) {
    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.pMatrix = new Lib.Matrix4(context).perspective(this.fieldOfViewRadians, aspect, 1, 2000);
  }

  render({ context, attributes, uniforms, canvas }) {
    this.position.fillBuffer(attributes.a_position);
    this.color.fillBuffer(attributes.a_color);

    // Compute a view projection matrix
    this.calculateMatrix({
      context,
      canvas
    });

    for (let ii = 0; ii < this.numFs; ++ii) {
      this.vpMatrix.translate(this.calculateRotation(ii)).fillBuffer(uniforms.u_matrix);

      context.drawArrays(context.TRIANGLES, 0, 16 * 6);
    }
  }

  calculateRotation(index) {
    const angle = index * Math.PI * 2 / this.numFs;
    const x = Math.cos(angle) * this.radius;
    const y = Math.sin(angle) * this.radius;

    return [x, 0, y];
  }

  calculateMatrix({ context }) {
    this.cMatrix = new Lib.Matrix4(context).rotateY(degToRad(this.cameraDegrees)).translate([0, 0, this.radius * 1.5]);

    const cameraPosition = [this.cMatrix.get()[12], this.cMatrix.get()[13], this.cMatrix.get()[14]];

    this.laMatrix = new Lib.Matrix4(context).lookAt(cameraPosition, [this.radius, 0, 0], [0, 1, 0]).invert();
    this.vpMatrix = new Lib.Matrix4(context).multiply(this.pMatrix).multiply(this.laMatrix);
  }

  update() {
    this.cameraDegrees++;
  }
}
