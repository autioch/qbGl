import qbGl from '../libs/qbGl';
(function(qb) {
  const triangleDef = {
    vertices: [
      0.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0
    ],
    colors: [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ]
  };
  const squareDef = {
    vertices: [
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ],
    colors: []
  };

  for (let i = 0; i < 4; i++) {
    squareDef.colors = squareDef.colors.concat([0.5, 0.5, 1.0, 1.0]);
  }

  const scene = new qb.Scene('webgl02');
  const context = scene.get();

  const program = new qb.Program(context);

  program.setShader('shader-vs02');
  program.setShader('shader-fs02');
  scene.setProgram(program.use());

  const triangle = new qb.Shape(context);

  triangle.setBuffer('vertices', new Float32Array(triangleDef.vertices), context.ARRAY_BUFFER, 3, 3);
  triangle.setBuffer('colors', new Float32Array(triangleDef.colors), context.ARRAY_BUFFER, 3, 4);

  const square = new qb.Shape(context);

  square.setBuffer('vertices', new Float32Array(squareDef.vertices), context.ARRAY_BUFFER, 4, 3);
  square.setBuffer('colors', new Float32Array(squareDef.colors), context.ARRAY_BUFFER, 4, 4);

  scene.render = function(context, modelViewMatrix, program) {
    modelViewMatrix.translate([-1.5, 0.0, -6.0]);
    var vertices = triangle.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    triangle.getBuffer('colors', program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, vertices.count);

    modelViewMatrix.translate([3, 0, 0]);
    var vertices = square.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    square.getBuffer('colors', program.getAttrib('aVertexColor'));
    this.setMatrixUniforms();
    context.drawArrays(context.TRIANGLE_STRIP, 0, vertices.count);
  };

  scene.animate();
})(qbGl);
