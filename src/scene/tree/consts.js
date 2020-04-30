import cylinder from './cylinder';

export const BRANCH_COLOR = [0.6, 0.2, 0, 1];
export const BRANCH_LEAF = 5;
export const BRANCH_LENGTH = 150;
export const BRANCH_LENGTH_DIMINISH = 4;
export const BRANCH_MAX_COUNT = 1000; // 4096
export const BRANCH_RADIUS = 5;
export const BRANCH_RADIUS_DIMINISH = 1;
export const BRANCH_ROTATE = 60;
export const BRANCH_SUB = 4;

const CYLINDER_BRANCH_LENGTH = 150;
const CYLINDER_BRANCH_RADIUS = 17;

export const CYLINDER_VERTICES = cylinder(CYLINDER_BRANCH_LENGTH, CYLINDER_BRANCH_RADIUS, 20);

export const LEAF_COLOR = [0.0, 0.4, 0.0, 1];
export const LEAF_VERTICES = [
  0, 0, 0,
  5, 0, 4,
  6, 0, 4,
  8, 0, 4,
  10, 0, 5,
  12, 0, 6,
  14, 0, 12,
  16, 2, 18,
  16, 4, 20,
  14, 6, 24,
  10, 8, 30,
  6, 10, 36,
  0, 12, 40,

  -6, 10, 36,
  -10, 8, 30,
  -14, 6, 24,
  -16, 4, 20,
  -16, 2, 18,
  -14, 0, 12,
  -12, 0, 6,
  -8, 0, 4,
  -6, 0, 4,
  -5, 0, 4,
  0, 0, 0
];
