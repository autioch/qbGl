import Lib from 'lib';
import { WING_COLORS, WING_VERTICES } from './consts';
import { GARDEN_SIZE } from '../grass/consts';
import Travel from './Travel';

function generateColors(rMod, gMod, bMod) {
  return WING_COLORS
    .map(([r, g, b]) => [r * rMod, g * gMod, b * bMod, 1])
    .flat();
}

export default class Butterfly {
  constructor(context, colorMod = [1, 1, 1]) {
    this.context = context;
    this.travel = new Travel(
      [-GARDEN_SIZE, 0, -GARDEN_SIZE],
      [GARDEN_SIZE, GARDEN_SIZE, GARDEN_SIZE]
    );

    this.rotateY = 0;
    this.wingsRotateY = 0;
    this.wingStep = -0.1;

    this.wing = new Lib.ColorShape(context, {
      vertices: WING_VERTICES,
      colors: generateColors(...colorMod),
      mode: context.TRIANGLE_FAN
    });
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    matrix.push().translate(this.travel.current).rotateX(this.rotateY - 90);

    matrix
      .push()
      .rotateY(this.wingsRotateY)
      .fillBuffer(matrixLocation)
      .pop();
    this.wing.render(colorLocation, positionLocation);

    matrix
      .push()
      .rotateY(180 - this.wingsRotateY)
      .fillBuffer(matrixLocation)
      .pop();
    this.wing.render(colorLocation, positionLocation);

    matrix.pop();
  }

  update() {
    if (this.travel.update()) {
      this.rotateY = Math.atan2(this.travel.step[1], this.travel.step[0]) * 180 / Math.PI;
    }
    this.wingsRotateY += this.wingStep;
    if (this.wingsRotateY > 60) {
      this.wingStep *= -1;
    } else if (this.wingsRotateY < -30) {
      this.wingStep *= -1;
    }
  }
}
