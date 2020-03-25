import qbGl from '../libs/qbGl';
(function(qb) {
  const pyramidDef = {
    vertices: [
      // Front face
      0.0, 1.0, 0.0,
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,

      // Right face
      0.0, 1.0, 0.0,
      1.0, -1.0, 1.0,
      1.0, -1.0, -1.0,

      // Back face
      0.0, 1.0, 0.0,
      1.0, -1.0, -1.0,
      -1.0, -1.0, -1.0,

      // Left face
      0.0, 1.0, 0.0,
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0
    ],
    colors: [
      // Front face
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,

      // Right face
      1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 1.0,

      // Back face
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,

      // Left face
      1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 1.0
    ]
  };
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
    colors: [
      [1.0, 0.0, 0.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [1.0, 0.5, 0.5, 1.0], // Bottom face
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
    ]
  };
  let unpackedColors = [];

  for (const i in cubeDef.colors) {
    const color = cubeDef.colors[i];

    for (let j = 0; j < 4; j++) {
      unpackedColors = unpackedColors.concat(color);
    }
  }
  cubeDef.colors = unpackedColors;

  const scene = new qb.Scene('webgl04');
  const context = scene.get();

  const program = new qb.Program(context);

  program.setShader('shader-vs02');
  program.setShader('shader-fs02');
  scene.setProgram(program.use());

  const pyramid = new qb.Shape(context);

  pyramid.setBuffer('vertices', new Float32Array(pyramidDef.vertices), context.ARRAY_BUFFER, 12, 3);
  pyramid.setBuffer('colors', new Float32Array(pyramidDef.colors), context.ARRAY_BUFFER, 12, 4);
  pyramid.rotate = 0;

  const cube = new qb.Shape(context);

  cube.setBuffer('vertices', new Float32Array(cubeDef.vertices), context.ARRAY_BUFFER, 24, 3);
  cube.setBuffer('colors', new Float32Array(cubeDef.colors), context.ARRAY_BUFFER, 24, 4);
  cube.setBuffer('indices', new Uint16Array(cubeDef.indices), context.ELEMENT_ARRAY_BUFFER, 36, 1);
  cube.rotate = 0;

  scene.render = function(context, modelViewMatrix, program) {
    modelViewMatrix
      .translate([-1.5, 0.0, -6.0])
      .push()
      .rotate(pyramid.rotate, [0, 1, 0]);
    var vertices = pyramid.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    pyramid.getBuffer('colors', program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, vertices.count);

    modelViewMatrix.pop();

    modelViewMatrix.translate([3, 0, 0])
      .push()
      .rotate(cube.rotate, [1, 1, 1]);
    var vertices = cube.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    cube.getBuffer('colors', program.getAttrib('aVertexColor'));

    const indices = cube.getBuff('indices');

    context.bindBuffer(indices.type, indices);
    this.setMatrixUniforms();
    context.drawElements(context.TRIANGLES, indices.count, context.UNSIGNED_SHORT, 0);

    modelViewMatrix.pop();
  };

  scene.update = function(elapsedTime) {
    pyramid.rotate += (90 * elapsedTime) / 1000.0;
    cube.rotate += (75 * elapsedTime) / 1000.0;
  };

  scene.animate();
})(qbGl);
