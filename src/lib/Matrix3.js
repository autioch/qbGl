import { mat3 } from 'gl-matrix';

export default class Matrix {
  constructor(context, current = mat3.create()) {
    this.context = context;
    this.current = current;
    this.stack = [];
  }

  get() {
    return this.current;
  }

  push() {
    this.stack.push(mat3.clone(this.current));

    return this;
  }

  pop() {
    if (this.stack.length === 0) {
      throw Error('Matrix stack empty, can\'t pop!');
    }
    this.current = this.stack.pop();

    return this;
  }

  fillBuffer(uniformLocation) {
    this.context.uniformMatrix3fv(uniformLocation, false, this.current);

    return this;
  }

  /* Operations */

  identity() {
    mat3.identity(this.current);

    return this;
  }

  multiply(matrix3) {
    mat3.multiply(this.current, this.current, matrix3.get());

    return this;
  }

  rotate(radians) {
    mat3.rotate(this.current, this.current, radians);

    return this;
  }

  translate(vec2) {
    mat3.translate(this.current, this.current, vec2);

    return this;
  }

  scale(vec2) {
    mat3.scale(this.current, this.current, vec2);

    return this;
  }

  projection(width, height) {
    mat3.projection(this.current, width, height);

    return this;
  }
}
