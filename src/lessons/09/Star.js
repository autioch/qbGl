function drawStar(uniforms, context, program, bufferStash) {
  bufferStash.getTexture('star', program.locateUniform('uSampler'));
  bufferStash.getBuffer('textures', program.locateAttribute('aTextureCoord'));
  const vertices = bufferStash.getBuffer('vertices', program.locateAttribute('aVertexPosition'));

  uniforms();
  context.drawArrays(context.TRIANGLE_STRIP, 0, vertices.count);
}

export default class Star {
  constructor(startingDistance, rotationSpeed) {
    this.angle = 0;
    this.dist = startingDistance;
    this.rotationSpeed = rotationSpeed;

    // Set the colors to a starting value.
    this.randomizeColors();
  }

  randomizeColors() {
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();
    this.twinkleR = Math.random();
    this.twinkleG = Math.random();
    this.twinkleB = Math.random();
  }

  update(change) {
    this.angle += this.rotationSpeed * change;

    this.dist -= 0.01 * change;
    if (this.dist < 0.0) {
      this.dist += 5.0;
      this.randomizeColors();
    }
  }

  render(context, mMatrix, program, tilt, spin, twinkle, uniforms, bufferStash) {
    mMatrix
      .push()
      .rotate(this.angle, [0.0, 1.0, 0.0])
      .translate([this.dist, 0.0, 0.0])
      .rotate(-this.angle, [0.0, 1.0, 0.0])
      .rotate(-tilt, [1.0, 0.0, 0.0]);

    if (twinkle) {
      context.uniform3f(program.locateUniform('uColor'), this.twinkleR, this.twinkleG, this.twinkleB);
      drawStar(uniforms, context, program, bufferStash);
    }

    mMatrix.rotate(spin, [0.0, 0.0, 1.0]);

    context.uniform3f(program.locateUniform('uColor'), this.r, this.g, this.b);
    drawStar(uniforms, context, program, bufferStash);

    mMatrix.pop();
  }
}
