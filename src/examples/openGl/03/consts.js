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

export { triangleDef, squareDef };
