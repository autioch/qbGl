import { degToRad } from './utils';
import { mat3, mat4 } from 'gl-matrix';

export default class Matrix {
  constructor(context, current = mat4.create()) {
    this.context = context;
    this.current = current;
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

  multiply(matrix4) {
    mat4.multiply(this.current, this.current, matrix4.get());

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

  scale(vec3) {
    mat4.scale(this.current, this.current, vec3);

    return this;
  }

  toInvTraMat3() {
    const result = mat3.create();

    mat3.fromMat4(result, this.current);
    mat3.invert(result, result);
    mat3.transpose(result, result);

    return result;
  }

  perspective(fovy, aspect, near, far) {
    mat4.perspective(this.current, fovy, aspect, near, far);

    return this;
  }

  // todo make this static to construct
  orthographic(left, right, bottom, top, near, far) { // eslint-disable-line no-shadow
    this.current = mat4.ortho(this.current, left, right, bottom, top, near, far);

    return this;
  }

  // todo make this static to construct
  lookAt(camera, target, up) {
    this.current = mat4.lookAt(this.current, camera, target, up);

    return this;
  }

  rotateX(radians) {
    mat4.rotateX(this.current, this.current, radians);

    return this;
  }

  rotateY(radians) {
    mat4.rotateY(this.current, this.current, radians);

    return this;
  }

  rotateZ(radians) {
    mat4.rotateZ(this.current, this.current, radians);

    return this;
  }

  invert() {
    mat4.invert(this.current, this.current);

    return this;
  }

  getCamera() {
    return [
      this.current[12],
      this.current[13],
      this.current[14]
    ];
  }
}
