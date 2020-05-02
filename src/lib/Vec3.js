import { range } from './utils';

export default class Vec3 extends Array {
  constructor(...args) {
    if (args.length !== 3 && args.length !== 0) {
      throw Error('Vec3 should accept 0 or 3 arguments');
    }

    const components = args.length ? args : [0, 0, 0];

    super(...components);
  }

  static randomizer(min, max) {
    const [minX, minY, minZ] = min;
    const [maxX, maxY, maxZ] = max;

    return () => new this(
      range(minX, maxX),
      range(minY, maxY),
      range(minZ, maxZ)
    );
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  set x(x) {
    this[0] = x;
  }

  set y(y) {
    this[0] = y;
  }

  set z(z) {
    this[0] = z;
  }

  setComponents(x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;

    return this;
  }

  set(vec3) {
    this[0] = vec3[0]; // eslint-disable-line prefer-destructuring
    this[1] = vec3[1]; // eslint-disable-line prefer-destructuring
    this[2] = vec3[2]; // eslint-disable-line prefer-destructuring

    return this;
  }

  reset() {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;

    return this;
  }

  clone() {
    return new this.constructor(...this);
  }

  add(vec3) {
    this[0] += vec3[0];
    this[1] += vec3[1];
    this[2] += vec3[2];

    return this;
  }

  substract(vec3) {
    this[0] -= vec3[0];
    this[1] -= vec3[1];
    this[2] -= vec3[2];

    return this;
  }

  divide(vec3) {
    this[0] /= vec3[0];
    this[1] /= vec3[1];
    this[2] /= vec3[2];

    return this;
  }

  divideNum(num) {
    this[0] /= num;
    this[1] /= num;
    this[2] /= num;

    return this;
  }

  distance(vec3) {
    return Math.hypot(this[0] - vec3[0], this[1] - vec3[1], this[2] - vec3[2]);
  }

  normalize() {
    const len = Math.hypot(...this);

    return this.divideNum(len);
  }
}
