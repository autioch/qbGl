function drawStar(setMatrixUniforms, context, attributes, uniforms, bufferStash) {
  bufferStash.getTexture('star', uniforms.uSampler);
  bufferStash.getBuffer('textures', attributes.aTextureCoord);
  const vertices = bufferStash.getBuffer('vertices', attributes.aVertexPosition);

  setMatrixUniforms();
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

  update({ pulse }) {
    this.angle += this.rotationSpeed * pulse;

    this.dist -= 0.01 * pulse;
    if (this.dist < 0.0) {
      this.dist += 5.0;
      this.randomizeColors();
    }
  }

  render(context, mMatrix, attributes, uniforms, tilt, spin, twinkle, setMatrixUniforms, bufferStash) {
    mMatrix
      .push()
      .rotate(this.angle, [0.0, 1.0, 0.0])
      .translate([this.dist, 0.0, 0.0])
      .rotate(-this.angle, [0.0, 1.0, 0.0])
      .rotate(-tilt, [1.0, 0.0, 0.0]);

    if (twinkle) {
      context.uniform3f(uniforms.uColor, this.twinkleR, this.twinkleG, this.twinkleB);
      drawStar(setMatrixUniforms, context, attributes, uniforms, bufferStash);
    }

    mMatrix.rotate(spin, [0.0, 0.0, 1.0]);

    context.uniform3f(uniforms.uColor, this.r, this.g, this.b);
    drawStar(setMatrixUniforms, context, attributes, uniforms, bufferStash);

    mMatrix.pop();
  }
}
