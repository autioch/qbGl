import Lib from '../../lib';
import { positions, colors } from './consts';
import { m4 } from './m4';

const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.fieldOfViewRadians = degToRad(60);
    this.cameraDegrees = 0;

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

    this.numFs = 5;
    this.radius = 100;

    // context.enable(context.CULL_FACE);
  }

  render({ context, program, canvas }) {
    const positionLocation = program.locateAttribute('a_position');
    const colorLocation = program.locateAttribute('a_color');
    const matrixLocation = program.locateUniform('u_matrix');

    this.position.fillBuffer(positionLocation);
    this.color.fillBuffer(colorLocation);

    // Compute a view projection matrix
    const viewProjectionMatrix = this.calculateMatrices(canvas);

    for (let ii = 0; ii < this.numFs; ++ii) {
      // starting with the view projection matrix
      // compute a matrix for the F
      const matrix = m4.translate(viewProjectionMatrix, ...this.calculateRotation(ii));

      // Set the matrix.
      context.uniformMatrix4fv(matrixLocation, false, matrix);

      context.drawArrays(context.TRIANGLES, 0, 16 * 6);
    }
  }

  calculateRotation(index) {
    const angle = index * Math.PI * 2 / this.numFs;
    const x = Math.cos(angle) * this.radius;
    const y = Math.sin(angle) * this.radius;

    return [x, 0, y];
  }

  calculateMatrices(canvas) {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const projectionMatrix = m4.perspective(this.fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the position of the first F
    const fPosition = [this.radius, 0, 0];

    // Use matrix math to compute a position on a circle where
    // the camera is
    let cameraMatrix = m4.yRotation(degToRad(this.cameraDegrees));

    cameraMatrix = m4.translate(cameraMatrix, 0, 0, this.radius * 1.5);

    const cameraPosition = [// Get the camera's position from the matrix we computed
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14]
    ];

    cameraMatrix = m4.lookAt(cameraPosition, fPosition, [0, 1, 0]);// Compute the camera's matrix using look at.

    const viewMatrix = m4.inverse(cameraMatrix);// Make a view matrix from the camera matrix

    // Compute a view projection matrix
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    return viewProjectionMatrix;
  }

  update() {
    this.cameraDegrees++;
  }
}
