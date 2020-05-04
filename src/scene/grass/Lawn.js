import Bunch from './Bunch';
import Lib from 'lib';
import { BLADE_VERTICES, BUNCH_COLOR_MIN, BUNCH_COLOR_RANGE, BUNCH_COLOR_STEP, BUNCH_COUNT, EARTH_COLOR, EARTH_NORMAL, EARTH_VERTICES } from './consts';
import { GARDEN_SIZE } from '../consts';
import { range, arrRandom } from '../utils';

// const randomOnCircle = (radius) => {
//   const angle = Math.random() * Math.PI * 2;
//   const r = Math.sqrt(Math.random());
//
//   return [
//     r * Math.cos(angle) * radius,
//     0,
//     r * Math.sin(angle) * radius
//   ];
// };

export default class Lawn {
  constructor(context) {
    this.bunch = new Bunch(context);

    this.colors = Lib.makeArr(BUNCH_COLOR_RANGE, (_, index) => new Lib.ArrayDataBuffer(context, { // eslint-disable-line no-unused-vars
      size: 4,
      data: Lib.makeArr(BLADE_VERTICES.length / 3, [0, BUNCH_COLOR_MIN + (BUNCH_COLOR_STEP * index), 0, 1]).flat()
    }));

    this.bunches = Lib.makeArr(BUNCH_COUNT, () => ({
      // translate: randomOnCircle(GARDEN_SIZE),

      translate: [range(-GARDEN_SIZE, GARDEN_SIZE), 0, range(-GARDEN_SIZE, GARDEN_SIZE)],
      rotateY: range(0, 360),
      scale: Lib.makeArr(3, range(0.4, 1)),
      colorBuffer: arrRandom(this.colors)
    }));

    this.earth = new Lib.ColorShape(context, {
      vertices: EARTH_VERTICES,
      colors: Lib.makeArr(EARTH_VERTICES.length / 3, EARTH_COLOR).flat(),
      normals: Lib.makeArr(EARTH_VERTICES.length / 3, EARTH_NORMAL).flat(),
      mode: context.TRIANGLE_STRIP
    });
  }

  render(matrix, matrixLocation, colorLocation, positionLocation, normalLocation) {
    matrix.fillBuffer(matrixLocation);
    this.earth.render(colorLocation, positionLocation, normalLocation);

    this.bunches.forEach((bunch) => {
      matrix.push().translate(bunch.translate).rotateY(bunch.rotateY).scale(bunch.scale);
      bunch.colorBuffer.fillBuffer(colorLocation);
      this.bunch.render(matrix, matrixLocation, positionLocation, normalLocation);
      matrix.pop();
    });
  }
}
