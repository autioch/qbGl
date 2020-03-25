import Lib from '../lib';

const scene = new Lib.Scene('webgl11');

scene.effectiveFPMS = 60 / 1000;
const context = scene.get();
const program = new Lib.Program(context);

program.setShader('shader-vs11');
program.setShader('shader-fs11');
scene.setProgram(program.use());

const textureMoon = new Lib.Texture(context, {
  url: 'moon.gif',
  magFilter: context.LINEAR,
  minFilter: context.LINEAR_MIPMAP_NEAREST,
  mipmap: true
});

const view = new Lib.View('#container11');

let lastMouseX = null;
let lastMouseY = null;
const light = new Lib.Light(context);

const moonRotationMatrix = new Lib.Matrix();

moonRotationMatrix.identity();

view.onmousemove = function(event) {
  const newX = event.clientX;
  const newY = event.clientY;
  const newRotationMatrix = new Lib.Matrix();

  newRotationMatrix
    .identity()
    .rotate((newX - lastMouseX) / 10, [0, 1, 0])
    .rotate((newY - lastMouseY) / 10, [1, 0, 0]);

  moonRotationMatrix.multiply(newRotationMatrix);
  lastMouseX = newX;
  lastMouseY = newY;
};

const latitudeBands = 30;
const longitudeBands = 30;
const radius = 2;

const vertexPositionData = [];
const normalData = [];
const textureCoordData = [];

for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
  const theta = latNumber * Math.PI / latitudeBands;
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
    const phi = longNumber * 2 * Math.PI / longitudeBands;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    const x = cosPhi * sinTheta;
    const y = cosTheta;
    const z = sinPhi * sinTheta;
    const u = 1 - (longNumber / longitudeBands);
    const v = 1 - (latNumber / latitudeBands);

    normalData.push(x);
    normalData.push(y);
    normalData.push(z);
    textureCoordData.push(u);
    textureCoordData.push(v);
    vertexPositionData.push(radius * x);
    vertexPositionData.push(radius * y);
    vertexPositionData.push(radius * z);
  }
}

const indexData = [];

for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
  for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
    const first = (latNumber * (longitudeBands + 1)) + longNumber;
    const second = first + longitudeBands + 1;

    indexData.push(first);
    indexData.push(second);
    indexData.push(first + 1);

    indexData.push(second);
    indexData.push(second + 1);
    indexData.push(first + 1);
  }
}

const bufferStash = new Lib.Shape(context);

bufferStash.setBuffer('normals', new Float32Array(normalData), context.ARRAY_BUFFER, normalData.length / 3, 3);
bufferStash.setBuffer('textures', new Float32Array(textureCoordData), context.ARRAY_BUFFER, textureCoordData.length / 2, 2);
bufferStash.setBuffer('positions', new Float32Array(vertexPositionData), context.ARRAY_BUFFER, vertexPositionData.length / 3, 3);
bufferStash.setBuffer('indices', new Uint16Array(indexData), context.ELEMENT_ARRAY_BUFFER, indexData.length, 1);
bufferStash.setTexture('moon', textureMoon);

scene.render = function render(context, modelViewMatrix, program) {
  const lighting = document.getElementById('lighting').checked;

  context.uniform1i(program.getUniform('uUseLighting'), false);

  //        context.uniform1i(program.getUniform("uUseLighting"), lighting);
  //        if (lighting) {
  //            light.get3f(program.getUniform("uAmbientColor"), getVal("ambientR"), getVal("ambientG"), getVal("ambientB"));
  //            light.get3fv(program.getUniform("uLightingDirection"), getVal("lightDirectionX"), getVal("lightDirectionY"), getVal("lightDirectionZ"));
  //            light.get3f(program.getUniform("uDirectionalColor"), getVal("directionalR"), getVal("directionalG"), getVal("directionalB"));
  //        }
  modelViewMatrix
    .translate([0, 0, -6])
    .multiply(moonRotationMatrix);

  bufferStash.getTexture('moon', program.getUniform('uSampler'));
  bufferStash.getBuffer('positions', program.getAttrib('aVertexPosition'));
  bufferStash.getBuffer('textures', program.getAttrib('aTextureCoord'));
  bufferStash.getBuffer('normals', program.getAttrib('aVertexNormal'));

  const indices = bufferStash.getBuff('indices');

  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indices);
  this.setMatrixUniforms();
  context.uniformMatrix3fv(program.getUniform('uNMatrix'), false, modelViewMatrix.toInvTraMat3());

  context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);
};

function getVal(id) {
  return parseFloat(document.getElementById(id).value);
}

scene.animate();
