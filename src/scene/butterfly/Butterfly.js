import Lib from 'lib';
import { WING_COLORS, WING_VERTICES } from './consts';
import { GARDEN_SIZE } from '../grass/consts';
import Travel from './Travel';
import Flap from './Flap';

function generateColors(rMod, gMod, bMod) {
  return WING_COLORS.map(([r, g, b]) => [r * rMod, g * gMod, b * bMod, 1]).flat();
}

export default class Butterfly {
  constructor(context, colorMod = [1, 1, 1]) {
    this.context = context;
    this.travel = new Travel(
      [-GARDEN_SIZE, 0, -GARDEN_SIZE],
      [GARDEN_SIZE, GARDEN_SIZE, GARDEN_SIZE]
    );

    this.flap = new Flap();
    this.wing = new Lib.ColorShape(context, {
      vertices: WING_VERTICES,
      colors: generateColors(...colorMod),
      normals: Lib.makeArr(WING_VERTICES.length / 3, [0, 1, 0]).flat(),
      mode: context.TRIANGLE_FAN
    });
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    matrix.push().translate(this.travel.current).rotateY(this.travel.rotateY);

    matrix.push().rotateZ(this.flap.radians).fillBuffer(matrixLocation).pop();
    this.wing.render(colorLocation, positionLocation);

    matrix.push().rotateZ(Math.PI - this.flap.radians).fillBuffer(matrixLocation).pop();
    this.wing.render(colorLocation, positionLocation);

    matrix.pop();
  }

  update() {
    this.travel.update();
    this.flap.update();
  }
}
