import Bunch from './Bunch';
import Lib from 'lib';
import { GARDEN_SIZE } from './consts';
import { range } from '../utils';

const BUNCH_COUNT = 600;
const COLOR_MIN = 0.3;
const COLOR_MAX = 0.7;
const COLOR_RANGE = 10;

const { makeArr } = Lib;

// const randomIndex = (arr) => Math.floor(Math.random() * arr.length);
const randomColor = (arr) => arr[Math.floor(Math.random() * arr.length)];

// const setDict = (obj, key, value) => {
//   if (obj[key]) {
//     obj[key].push(value);
//   } else {
//     obj[key] = [value];
//   }
//
//   return obj;
// };

export default class Lawn {
  constructor(context) {
    this.bunch = new Bunch(context, [0, range(0.3, 0.7), 0, 1]);
    const colorStep = (COLOR_MAX - COLOR_MIN) / COLOR_RANGE;
    const bladeIndiceCount = 7;

    this.colors = makeArr(COLOR_RANGE, (_, index) => new Lib.ArrayDataBuffer(context, { // eslint-disable-line no-unused-vars
      id: index,
      size: 4,
      data: makeArr(bladeIndiceCount, [0, COLOR_MIN + (colorStep * index), 0, 1]).flat()
    }));

    this.bunches = makeArr(BUNCH_COUNT, () => ({
      translate: [range(-GARDEN_SIZE, GARDEN_SIZE), 0, range(-GARDEN_SIZE, GARDEN_SIZE)],
      rotateY: range(0, 360),
      scale: range(0.4, 1),
      colorBuffer: randomColor(this.colors)
    }));

    // this.buncheGroupsByColor = this.bunches.reduce((obj, bunch) => setDict(obj, bunch.colorBufferIndex, bunch), {});
  }

  render(matrix, matrixLocation, colorLocation, positionLocation, normalLocation) {
    this.bunches.forEach((bunch) => {
      matrix.push();
      matrix.translate(bunch.translate);
      matrix.rotateY(bunch.rotateY);

      matrix.scale([bunch.scale, bunch.scale, bunch.scale]);
      bunch.colorBuffer.fillBuffer(colorLocation);

      this.bunch.render(matrix, matrixLocation, positionLocation, normalLocation);
      matrix.pop();
    });
  }
}
