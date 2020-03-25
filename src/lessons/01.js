import qbGl from '../libs/qbGl';

(function(qb) {
  const triangleDef = {
    vertices: [
      0.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0
    ]
  };
  const squareDef = {
    vertices: [
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ]
  };

  const scene = new qb.Scene('webgl01');
  const context = scene.get();

  const program = new qb.Program(context);

  program.setShader('shader-vs01');
  program.setShader('shader-fs01');
  scene.setProgram(program.use());

  const triangle = new qb.Shape(context);

  triangle.setBuffer('vertices', new Float32Array(triangleDef.vertices), context.ARRAY_BUFFER, 3, 3);

  const square = new qb.Shape(context);

  square.setBuffer('vertices', new Float32Array(squareDef.vertices), context.ARRAY_BUFFER, 4, 3);

  scene.render = function(context, modelViewMatrix, program) {
    modelViewMatrix.translate([-1.5, 0.0, -6.0]);
    var vertices = triangle.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    this.setMatrixUniforms();
    context.drawArrays(context.TRIANGLES, 0, vertices.count);

    modelViewMatrix.translate([3, 0, 0]);
    var vertices = square.getBuffer('vertices', program.getAttrib('aVertexPosition'));

    this.setMatrixUniforms();
    context.drawArrays(context.TRIANGLE_STRIP, 0, vertices.count);
  };

  scene.animate();
})(qbGl);
