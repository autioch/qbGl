import Lib from 'lib';
import { GARDEN_SIZE } from '../consts';

export const EARTH_COLOR = [0.3, 0.2, 0, 1];
export const EARTH_NORMAL = [0, 1, 0];

export const BLADE_NORMAL = [0, 1, 0];
export const BLADE_ROTATIONS = [0, 45, 75, 60, 30, 90].map(Lib.degToRad);
export const BLADE_VERTICES = [
  10, 0, 0,
  -10, 0, 0,
  8, 10, 3.6,
  -6, 20, 10.8,
  4, 30, 21.6,
  -2, 40, 32.4,
  0, 50, 45
];

export const BUNCH_COUNT = 600;
export const BUNCH_COLOR_MIN = 0.3;
export const BUNCH_COLOR_RANGE = 10;

const BUNCH_COLOR_MAX = 0.7;

export const BUNCH_COLOR_STEP = (BUNCH_COLOR_MAX - BUNCH_COLOR_MIN) / BUNCH_COLOR_RANGE;

export const EARTH_VERTICES = [
  -GARDEN_SIZE, 0, -GARDEN_SIZE,
  GARDEN_SIZE, 0, -GARDEN_SIZE,
  -GARDEN_SIZE, 0, GARDEN_SIZE,
  GARDEN_SIZE, 0, GARDEN_SIZE
];
