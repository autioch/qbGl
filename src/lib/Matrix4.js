/* 4x4 matrix, which is a wrapper for mat4.
 * Used to store and operate matrices. */

import { degToRad } from './utils';
import { mat3, mat4 } from 'gl-matrix';

export default class Matrix {
  constructor(context) {
    this.context = context;
    this.current = mat4.create();
    this.stack = [];
  }

  get() {
    return this.current;
  }

  push() {
    this.stack.push(mat4.clone(this.current));

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
    this.context.uniformMatrix4fv(uniformLocation, false, this.current);

    return this;
  }

  /* Operations */

  identity() {
    mat4.identity(this.current);

    return this;
  }

  perspective(fovy, aspect, near, far) {
    mat4.perspective(this.current, fovy, aspect, near, far);

    return this;
  }

  rotate(degrees, rotateVertex) {
    mat4.rotate(this.current, this.current, degToRad(degrees), rotateVertex);

    return this;
  }

  translate(translateVertex) {
    mat4.translate(this.current, this.current, translateVertex);

    return this;
  }

  multiply(matrix) {
    mat4.multiply(this.current, this.current, matrix.get());

    return this;
  }

  toInvTraMat3() {
    const result = mat3.create();

    mat3.fromMat4(result, this.current);
    mat3.invert(result, result);
    mat3.transpose(result, result);

    return result;
  }
}
