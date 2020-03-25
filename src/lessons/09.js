import Lib from '../lib';

const scene = new Lib.Scene('webgl09', true);

scene.effectiveFPMS = 60 / 1000;
const context = scene.get();
const program = new Lib.Program(context);

program.setShader('shader-vs05');
program.setShader('shader-fs09');
scene.setProgram(program.use());

const vertices = [
  -1.0, -1.0, 0.0,
  1.0, -1.0, 0.0,
  -1.0, 1.0, 0.0,
  1.0, 1.0, 0.0
];

const textures = [
  0.0, 0.0,
  1.0, 0.0,
  0.0, 1.0,
  1.0, 1.0
];

const bufferStash = new Lib.Shape(context);

bufferStash.setBuffer('vertices', new Float32Array(vertices), context.ARRAY_BUFFER, 4, 3);
bufferStash.setBuffer('textures', new Float32Array(textures), context.ARRAY_BUFFER, 4, 2);
bufferStash.setTexture('star', new Lib.Texture(context, {
  url: 'star.gif',
  magFilter: context.LINEAR,
  minFilter: context.LINEAR
}));

let zoom = -15;
let tilt = 90;
let spin = 0;
const shapes = [];
const shapeCount = 50;

function drawStar(uniforms) {
  bufferStash.getTexture('star', program.getUniform('uSampler'));
  bufferStash.getBuffer('textures', program.getAttrib('aTextureCoord'));
  const vertices = bufferStash.getBuffer('vertices', program.getAttrib('aVertexPosition'));

  uniforms();
  context.drawArrays(context.TRIANGLE_STRIP, 0, vertices.count);
}

class Star {
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

  render(context, modelViewMatrix, program, tilt, spin, twinkle, uniforms) {
    modelViewMatrix
      .push()
      .rotate(this.angle, [0.0, 1.0, 0.0])
      .translate([this.dist, 0.0, 0.0])
      .rotate(-this.angle, [0.0, 1.0, 0.0])
      .rotate(-tilt, [1.0, 0.0, 0.0]);

    if (twinkle) {
      context.uniform3f(program.getUniform('uColor'), this.twinkleR, this.twinkleG, this.twinkleB);
      drawStar(uniforms);
    }

    modelViewMatrix.rotate(spin, [0.0, 0.0, 1.0]);

    context.uniform3f(program.getUniform('uColor'), this.r, this.g, this.b);
    drawStar(uniforms);

    modelViewMatrix.pop();
  }
}

for (let i = 0; i < shapeCount; i++) {
  shapes.push(new Star((i / shapeCount) * 5.0, i / shapeCount));
}

scene.render = function render(context, modelViewMatrix, program) {
  context.blendFunc(context.SRC_ALPHA, context.ONE);
  context.enable(context.BLEND);

  modelViewMatrix
    .translate([0.0, 0.0, zoom])
    .rotate(tilt, [1, 0, 0]);

  const twinkle = document.getElementById('twinkle').checked;

  shapes.forEach((shape) => {
    shape.render(context, modelViewMatrix, program, tilt, spin, twinkle, this.setMatrixUniforms.bind(this));
    spin += 0.1;
  });
};

scene.update = function update(timeSinceLastUpdate) {
  const change = timeSinceLastUpdate * this.effectiveFPMS;

  shapes.forEach((shape) => {
    shape.update(change);
  });
  view.handleKeyboard();
};

var view = new Lib.View('#container09');

view.handleKeyboard = function() {
  const keys = this.currentKeys;

  if (keys[33]) {
    // Page Up
    zoom -= 0.1;
  }
  if (keys[34]) {
    // Page Down
    zoom += 0.1;
  }
  if (keys[38]) {
    // Up cursor key
    tilt += 2;
  }
  if (keys[40]) {
    // Down cursor key
    tilt -= 2;
  }
};

scene.animate();
