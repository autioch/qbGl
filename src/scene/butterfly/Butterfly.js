import { distance3d } from 'lib';
import Wing from './Wing2';
import { range } from '../utils';

export default class Butterfly {
  constructor(context, colorMod = [1, 1, 1]) {
    this.context = context;

    this.pos = [0, 0, 0];
    this.rotateY = 0;
    this.wingsRotateY = 0;

    this.start = [-1, -1, -1];
    this.end = [0, 0, 0];
    this.mov = [0.1, 0.1, 0.1];
    this.wings_d = -0.1;
    this.d = 1.0;

    this.setNewDirection();
    this.wing = new Wing(context, colorMod);
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    matrix.push().translate(this.pos).rotateX(this.rotateY - 90);

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
    if (distance3d(this.pos, this.end) < 1) {
      this.setNewDirection();
    }
    this.pos[0] += this.mov[0];
    this.pos[1] += this.mov[1];
    this.pos[2] += this.mov[2];
    this.wingsRotateY += this.wings_d;
    if (this.wingsRotateY > 60) {
      this.wings_d *= -1;
    } else if (this.wingsRotateY < -30) {
      this.wings_d *= -1;
    }
  }

  setNewDirection() {
    const tmp = [range(0, 80), range(0, 80), range(0, 40)];

    if (Math.random() < 0.25) {
      tmp[0] *= -1;
    }

    this.start = this.end;
    this.end = tmp;

    this.mov[0] = this.end[0] - this.start[0];
    this.mov[1] = this.end[1] - this.start[1];
    this.mov[2] = this.end[2] - this.start[2];

    this.rotateY = Math.atan2(this.mov[1], this.mov[0]) * 180 / Math.PI;

    const l = Math.hypot(...this.mov);

    this.mov[0] = this.mov[0] / l;
    this.mov[1] = this.mov[1] / l;
    this.mov[2] = this.mov[2] / l;
  }
}
