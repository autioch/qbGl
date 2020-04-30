import Lib from 'lib';
import { BLADE_VERTICES, BLADE_NORMAL, BLADE_ROTATIONS } from './consts';

export default class Bunch {
  constructor(context) {
    this.blade = new Lib.ColorShape(context, {
      vertices: BLADE_VERTICES,
      normals: Lib.makeArr(BLADE_VERTICES.length / 3, BLADE_NORMAL).flat(),
      mode: context.TRIANGLE_STRIP
    });

    this.rotations = BLADE_ROTATIONS;
  }

  render(matrix, matrixLocation, positionLocation, normalLocation) {
    matrix.push();
    this.rotations.forEach((rotation) => {
      matrix.rotateY(rotation).fillBuffer(matrixLocation);
      this.blade.render(undefined, positionLocation, normalLocation);
    });
    matrix.pop();
  }
}
