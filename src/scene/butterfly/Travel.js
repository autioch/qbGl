import { Vec3 } from 'lib';

export default class Travel {
  constructor(min, max) {
    this.start = new Vec3(0, 0, 0);
    this.current = new Vec3(0, 0, 0);
    this.end = new Vec3(0, 0, 0);
    this.step = new Vec3(0, 0, 0);

    this.getRandomPoint = Vec3.randomizer(min, max);
    this.setNewDirection();
  }

  update() {
    let newDirection = false;

    if (this.current.distance(this.end) < 1) {
      newDirection = true;
      this.setNewDirection();
    }

    this.current.add(this.step);

    return newDirection;
  }

  setNewDirection() {
    this.start.set(this.end);
    this.current.set(this.end);
    this.end.set(this.getRandomPoint());

    this.step
      .set(this.end)
      .substract(this.start)
      .divideNum(this.end.distance(this.start));
  }
}
