import Lib from '../../lib';
import { positions, colors } from './consts';
import { m4 } from './m4';

const { degToRad } = Lib;

export default class extends Lib.Scene {
  initialize({ context }) {
    this.rotation = [0, 0, 0];
    this.translation = [0, 0, -200];
    this.scale = [1, 1, 1];
    this.fieldOfViewRadians = degToRad(60);
    this.cameraAngleRadians = degToRad(0);

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

    // context.enable(context.CULL_FACE);
  }

  render({ context, program, canvas }) {
    const numFs = 5;
    const radius = 200;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const positionLocation = program.locateAttribute('a_position');
    const colorLocation = program.locateAttribute('a_color');
    const matrixLocation = program.locateUniform('u_matrix');

    this.position.fillBuffer(positionLocation);
    this.color.fillBuffer(colorLocation);

    const projectionMatrix = m4.perspective(this.fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the position of the first F
    const fPosition = [radius, 0, 0];

    // Use matrix math to compute a position on a circle where
    // the camera is
    let cameraMatrix = m4.yRotation(this.cameraAngleRadians);

    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

    const up = [0, 1, 0];

    const cameraPosition = [// Get the camera's position from the matrix we computed
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14]
    ];

    cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);// Compute the camera's matrix using look at.

    const viewMatrix = m4.inverse(cameraMatrix);// Make a view matrix from the camera matrix

    // Compute a view projection matrix
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    for (let ii = 0; ii < numFs; ++ii) {
      const angle = ii * Math.PI * 2 / numFs;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // starting with the view projection matrix
      // compute a matrix for the F
      const matrix = m4.translate(viewProjectionMatrix, x, 0, y);

      // Set the matrix.
      context.uniformMatrix4fv(matrixLocation, false, matrix);

      context.drawArrays(context.TRIANGLES, 0, 16 * 6);
    }
  }
}
