export default class Oscillate {
  constructor(config = {}) {
    const { value = 0, min = 0, max = 1, step = 0.0001 } = config;

    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
  }

  update({ pulse }) {
    this.value += this.step * pulse;

    if (this.value < this.min) {
      this.value = this.min;
      this.step *= -1;
    } else if (this.value > this.max) {
      this.value = this.max;
      this.step *= -1;
    }
  }
}
