import m4 from '../../m4';

const positions = [
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

// Center the F around the origin and Flip it around. We do this because
// we're in 3D now with and +Y is up where as before when we started with 2D
// we had +Y as down.

// We could do by changing all the values above but I'm lazy.
// We could also do it with a matrix at draw time but you should
// never do stuff at draw time if you can do it at init time.
let matrix = m4.xRotation(Math.PI);

matrix = m4.translate(matrix, -50, -75, -15);

for (let ii = 0; ii < positions.length; ii += 3) {
  const vector = m4.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);

  positions[ii + 0] = vector[0]; // eslint-disable-line prefer-destructuring
  positions[ii + 1] = vector[1]; // eslint-disable-line prefer-destructuring
  positions[ii + 2] = vector[2]; // eslint-disable-line prefer-destructuring
}

const colors = [
  // left column front
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,

  // top rung front
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,

  // middle rung front
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,
  200, 70, 120,

  // left column back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

  // top rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

  // middle rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

  // top
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,

  // top rung right
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,

  // under top rung
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,

  // between top rung and middle
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,

  // top of middle rung
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,

  // right of middle rung
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,

  // bottom of middle rung.
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,

  // right of bottom
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,

  // bottom
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,

  // left side
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220
];

export {
  positions,
  colors
};
