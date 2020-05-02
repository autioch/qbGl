/* eslint-disable no-mixed-operators */
/* eslint-disable no-mixed-operators */
import { mat4 } from 'gl-matrix';

const normals = [
  // left column front
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // top rung front
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // middle rung front
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // left column back
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,

  // top rung back
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,

  // middle rung back
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,

  // top
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,

  // top rung right
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // under top rung
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // between top rung and middle
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // top of middle rung
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,

  // right of middle rung
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // bottom of middle rung.
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // right of bottom
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // bottom
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // left side
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0
];

const vertices = [
  // left column front
  0, 0, 0,
  0, 150, 0,
  30, 0, 0,
  0, 150, 0,
  30, 150, 0,
  30, 0, 0,

  // top rung front
  30, 0, 0,
  30, 30, 0,
  100, 0, 0,
  30, 30, 0,
  100, 30, 0,
  100, 0, 0,

  // middle rung front
  30, 60, 0,
  30, 90, 0,
  67, 60, 0,
  30, 90, 0,
  67, 90, 0,
  67, 60, 0,

  // left column back
  0, 0, 30,
  30, 0, 30,
  0, 150, 30,
  0, 150, 30,
  30, 0, 30,
  30, 150, 30,

  // top rung back
  30, 0, 30,
  100, 0, 30,
  30, 30, 30,
  30, 30, 30,
  100, 0, 30,
  100, 30, 30,

  // middle rung back
  30, 60, 30,
  67, 60, 30,
  30, 90, 30,
  30, 90, 30,
  67, 60, 30,
  67, 90, 30,

  // top
  0, 0, 0,
  100, 0, 0,
  100, 0, 30,
  0, 0, 0,
  100, 0, 30,
  0, 0, 30,

  // top rung right
  100, 0, 0,
  100, 30, 0,
  100, 30, 30,
  100, 0, 0,
  100, 30, 30,
  100, 0, 30,

  // under top rung
  30, 30, 0,
  30, 30, 30,
  100, 30, 30,
  30, 30, 0,
  100, 30, 30,
  100, 30, 0,

  // between top rung and middle
  30, 30, 0,
  30, 60, 30,
  30, 30, 30,
  30, 30, 0,
  30, 60, 0,
  30, 60, 30,

  // top of middle rung
  30, 60, 0,
  67, 60, 30,
  30, 60, 30,
  30, 60, 0,
  67, 60, 0,
  67, 60, 30,

  // right of middle rung
  67, 60, 0,
  67, 90, 30,
  67, 60, 30,
  67, 60, 0,
  67, 90, 0,
  67, 90, 30,

  // bottom of middle rung.
  30, 90, 0,
  30, 90, 30,
  67, 90, 30,
  30, 90, 0,
  67, 90, 30,
  67, 90, 0,

  // right of bottom
  30, 90, 0,
  30, 150, 30,
  30, 90, 30,
  30, 90, 0,
  30, 150, 0,
  30, 150, 30,

  // bottom
  0, 150, 0,
  0, 150, 30,
  30, 150, 30,
  0, 150, 0,
  30, 150, 30,
  30, 150, 0,

  // left side
  0, 0, 0,
  0, 0, 30,
  0, 150, 30,
  0, 0, 0,
  0, 150, 30,
  0, 150, 0
];

function transformPoint(m, v0, v1, v2) {
  const d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];

  return [
    Math.round((v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d),
    Math.round((v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d),
    Math.round((v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d)
  ];
}

// Center the F around the origin and Flip it around. We do this because
// we're in 3D now with and +Y is up where as before when we started with 2D
// we had +Y as down.

// We could do by changing all the values above but I'm lazy.
// We could also do it with a matrix at draw time but you should
// never do stuff at draw time if you can do it at init time.
let matrix = mat4.fromXRotation(mat4.create(), Math.PI);

matrix = mat4.translate(matrix, matrix, [-50, -75, -15]);

for (let ii = 0; ii < vertices.length; ii += 3) {
  const [x, y, z] = transformPoint(matrix, vertices[ii + 0], vertices[ii + 1], vertices[ii + 2], 1);

  vertices[ii + 0] = x;
  vertices[ii + 1] = y;
  vertices[ii + 2] = z;
}

export { normals, vertices };
