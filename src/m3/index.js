/* eslint-disable no-mixed-operators */
import multiply from './multiply';
import rotation from './rotation';
import scaling from './scaling';
import translation from './translation';
import projection from './projection';
import identity from './identity';

function translate(m, tx, ty) {
  return multiply(m, translation(tx, ty));
}

function rotate(m, angleInRadians) {
  return multiply(m, rotation(angleInRadians));
}

function scale(m, sx, sy) {
  return multiply(m, scaling(sx, sy));
}

function project(m, width, height) {
  return multiply(m, projection(width, height));
}

function distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
}

function dot(x1, y1, x2, y2) {
  return x1 * x2 + y1 * y2;
}

function normalize(x, y) {
  const l = distance(0, 0, x, y);

  if (l > 0.00001) {
    return [x / l, y / l];
  }

  return [0, 0];
}

// i = incident
// n = normal
function reflect(ix, iy, nx, ny) {
  // I - 2.0 * dot(N, I) * N.
  const d = dot(nx, ny, ix, iy);

  return [
    ix - 2 * d * nx,
    iy - 2 * d * ny
  ];
}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

function transformPoint(m, v) {
  const d = v[0] * m[0 * 3 + 2] + v[1] * m[1 * 3 + 2] + m[2 * 3 + 2];

  return [
    (v[0] * m[0 * 3 + 0] + v[1] * m[1 * 3 + 0] + m[2 * 3 + 0]) / d,
    (v[0] * m[0 * 3 + 1] + v[1] * m[1 * 3 + 1] + m[2 * 3 + 1]) / d
  ];
}

function inverse(m) {
  const t00 = m[1 * 3 + 1] * m[2 * 3 + 2] - m[1 * 3 + 2] * m[2 * 3 + 1];
  const t10 = m[0 * 3 + 1] * m[2 * 3 + 2] - m[0 * 3 + 2] * m[2 * 3 + 1];
  const t20 = m[0 * 3 + 1] * m[1 * 3 + 2] - m[0 * 3 + 2] * m[1 * 3 + 1];
  const d = 1.0 / (m[0 * 3 + 0] * t00 - m[1 * 3 + 0] * t10 + m[2 * 3 + 0] * t20);

  return [
    d * t00, -d * t10, d * t20,
    -d * (m[1 * 3 + 0] * m[2 * 3 + 2] - m[1 * 3 + 2] * m[2 * 3 + 0]),
    d * (m[0 * 3 + 0] * m[2 * 3 + 2] - m[0 * 3 + 2] * m[2 * 3 + 0]),
    -d * (m[0 * 3 + 0] * m[1 * 3 + 2] - m[0 * 3 + 2] * m[1 * 3 + 0]),
    d * (m[1 * 3 + 0] * m[2 * 3 + 1] - m[1 * 3 + 1] * m[2 * 3 + 0]),
    -d * (m[0 * 3 + 0] * m[2 * 3 + 1] - m[0 * 3 + 1] * m[2 * 3 + 0]),
    d * (m[0 * 3 + 0] * m[1 * 3 + 1] - m[0 * 3 + 1] * m[1 * 3 + 0])
  ];
}

export default {
  multiply,
  rotation,
  scaling,
  translation,
  identity,
  projection,
  translate,
  rotate,
  scale,
  project,
  degToRad,
  distance,
  dot,
  inverse,
  normalize,
  radToDeg,
  reflect,
  transformPoint
};

export {
  multiply,
  rotation,
  scaling,
  translation,
  identity,
  projection,
  translate,
  rotate,
  scale,
  project,
  degToRad,
  distance,
  dot,
  inverse,
  normalize,
  radToDeg,
  reflect,
  transformPoint
};
