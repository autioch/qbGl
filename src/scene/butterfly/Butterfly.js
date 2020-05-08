import Lib from 'lib';
import { WING_COLORS, WING_VERTICES } from './consts';
import { GARDEN_SIZE } from '../consts';
import Travel from './Travel';
import Oscillate from '../Oscillate';

function generateColors(rMod, gMod, bMod) {
  return WING_COLORS.map(([r, g, b]) => [r * rMod, g * gMod, b * bMod, 1]).flat();
}

export default class Butterfly {
  constructor(context, colorMod = [1, 1, 1]) {
    this.context = context;
    this.travel = new Travel(
      [-GARDEN_SIZE, 0, -GARDEN_SIZE],
      [GARDEN_SIZE, GARDEN_SIZE / 2, GARDEN_SIZE]
    );

    this.flap = new Oscillate({
      min: -Math.PI / 4,
      max: Math.PI / 2,
      step: Math.PI / 400
    });
    this.wing = new Lib.ColorShape(context, {
      vertices: WING_VERTICES,
      colors: generateColors(...colorMod),
      normals: Lib.makeArr(WING_VERTICES.length / 3, [1, 0, 0]).flat(),
      mode: context.TRIANGLE_FAN
    });
  }

  render(matrix, matrixLocation, colorLocation, positionLocation, normalLocation) {
    matrix.push().translate(this.travel.current).rotateY(this.travel.rotateY);

    matrix.push().rotateZ(this.flap.value).fillBuffer(matrixLocation).pop();
    this.wing.render(colorLocation, positionLocation, normalLocation);

    matrix.push().rotateZ(Math.PI - this.flap.value).fillBuffer(matrixLocation).pop();
    this.wing.render(colorLocation, positionLocation, normalLocation);

    matrix.pop();
  }

  update({ pulse }) {
    this.travel.update();
    this.flap.update({
      pulse
    });
  }
}
