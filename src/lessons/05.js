import Lib from '../lib';

const cubeDef = {
  vertices: [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
  ],
  translate: [0.0, 0.0, -5.0],
  itemSize: 3,
  numItems: 24,
  type: 'Cube',
  draw: 'TRIANGLES',
  drawType: 'UNSIGNED_SHORT',
  rotateSpeed: 150,
  rotateVertex: [1, 1, 1],
  rotateDirection: 1,
  colors: [
    [1.0, 0.0, 0.0, 1.0], // Front face
    [1.0, 1.0, 0.0, 1.0], // Back face
    [0.0, 1.0, 0.0, 1.0], // Top face
    [0.5, 1.0, 1.0, 1.0], // Bottom face
    [1.0, 0.0, 1.0, 1.0], // Right face
    [0.0, 0.0, 1.0, 1.0] // Left face
  ],
  indices: [
    0, 1, 2, 0, 2, 3, // Front face
    4, 5, 6, 4, 6, 7, // Back face
    8, 9, 10, 8, 10, 11, // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23 // Left face
  ],
  textures: [
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
  ]
};

const scene = new Lib.Scene('webgl05');

const context = scene.get();

const program = new Lib.Program(context);

program.setShader('shader-vs05');
program.setShader('shader-fs05');

scene.setProgram(program.use());

const texture = new Lib.Texture(context, {
  url: 'podloga.jpg'
});
const cube = new Lib.Shape(context);

cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), context.ARRAY_BUFFER, 24, 3);
cube.setBuffer('textures', new Float32Array(cubeDef.textures), context.ARRAY_BUFFER, 24, 2);
cube.setBuffer('indices', new Uint16Array(cubeDef.indices), context.ELEMENT_ARRAY_BUFFER, 36, 1);
cube.setTexture('podloga', texture);
cube.rotate = 0;

scene.render = function render(context, modelViewMatrix, program) {
  modelViewMatrix
    .translate(cubeDef.translate)
    .push()
    .rotate(cube.rotate, cubeDef.rotateVertex);

  cube.getBuffer('vertices', program.getAttrib('aVertexPosition'));
  cube.getBuffer('textures', program.getAttrib('aTextureCoord'));
  cube.getTexture('podloga', program.getUniform('uSampler'));
  const indices = cube.getBuff('indices');

  this.setMatrixUniforms();
  context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);

  modelViewMatrix.pop();
};

scene.update = function(timeSinceLastUpdate) {
  cube.rotate += ((cubeDef.rotateSpeed * timeSinceLastUpdate) / 1000.0) * cubeDef.rotateDirection;
};

scene.animate();
