export default class Flap {
  constructor() {
    this.radians = 0;
    this.min = -Math.PI / 6;
    this.max = Math.PI / 3;
    this.step = Math.PI / 30;
  }

  update() {
    this.radians += this.step;

    if (this.radians < this.min || this.degrees > this.max) {
      this.step *= -1;
    }
  }
}
