const TRIANGLE_DEF = {
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

const SQUARE_DEF = {
  vertices: [
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
  ],
  colors: []
};

for (let i = 0; i < 4; i++) {
  SQUARE_DEF.colors = SQUARE_DEF.colors.concat([0.5, 0.5, 1.0, 1.0]);
}

export {
  TRIANGLE_DEF,
  SQUARE_DEF
};
