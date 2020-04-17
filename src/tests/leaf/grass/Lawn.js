import Bunch from './Bunch';

const BUNCH_COUNT = 1000;
const GRASS_RANGE = 400;

const range = (min, max) => Math.round(((Math.random() * (max - min)) + min) * 100) / 100;

export default class Lawn {
  constructor(context) {
    const radius = GRASS_RANGE - 0.2;

    this.bunch = new Bunch(context, [0, range(0.3, 0.4), 0, 1]);

    this.bunches = new Array(BUNCH_COUNT).fill(null).map(() => ({
      translate: [range(-radius, radius), 0, range(-radius, radius)],
      rotateY: range(0, 360),
      scale: range(0.5, 1)
    }));
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    this.bunches.forEach((bunch) => {
      matrix.push();
      matrix.translate(bunch.translate);
      matrix.rotateY(bunch.rotateY);

      matrix.scale([bunch.scale, bunch.scale, bunch.scale]);
      this.bunch.render(matrix, matrixLocation, colorLocation, positionLocation);
      matrix.pop();
    });
  }
}
