function Matrix() {
  this.current = mat4.create();
  this.stack = [];
}

Matrix.prototype = {
  get: function() {
    return this.current;
  },
  push: function() {
    this.stack.push(mat4.clone(this.current));
    return this;
  },
  pop: function() {
    if (this.stack.length === 0) {
      throw 'Invalid popMatrix!';
    }
    this.current = this.stack.pop();
    return this;
  },
  identity: function() {
    mat4.identity(this.current);
    return this;
  },
  perspective: function(fovy, aspect, near, far) {
    mat4.perspective(this.current, fovy, aspect, near, far);
    return this;
  },
  rotate: function(degrees, rotateVertex) {
    mat4.rotate(this.current, this.current, degToRad(degrees), rotateVertex);
    return this;
  },
  translate: function(translateVertex) {
    mat4.translate(this.current, this.current, translateVertex);
    return this;
  },
  multiply: function(matrix) {
    mat4.multiply(this.current, this.current, matrix.get());
    return this;
  },
  toInvTraMat3: function() {
    var result = mat3.create();
    mat3.fromMat4(result, this.current);
    mat3.invert(result, result);
    mat3.transpose(result, result);
    return result;
  }
};
