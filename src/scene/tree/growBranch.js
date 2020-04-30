import Lib from 'lib';
import { range } from '../utils';
import { BRANCH_LEAF, BRANCH_LENGTH_DIMINISH, BRANCH_LENGTH, BRANCH_RADIUS_DIMINISH, BRANCH_RADIUS, BRANCH_ROTATE, BRANCH_SUB } from './consts';

export default function growBranch(parentBranch, id) {
  const radius = parentBranch.radius - BRANCH_RADIUS_DIMINISH;
  const scale = radius / BRANCH_RADIUS;
  const length = parentBranch.length - BRANCH_LENGTH_DIMINISH; // eslint-disable-line no-shadow
  const lengthScale = length / BRANCH_LENGTH;

  if (radius < 1) {
    parentBranch.subBranches = [];

    return [];
  }

  let leafCount = Math.min(Math.round(BRANCH_RADIUS / radius), BRANCH_LEAF);
  let leafTransform = length / leafCount;

  if (leafCount < 2) {
    leafTransform = 0;
    leafCount = 0;
  }

  if (leafCount === 1) {
    leafTransform = length / 2;
  }
  const subBranches = Lib.makeArr(BRANCH_SUB, (_, index) => ({ // eslint-disable-line no-unused-vars
    radius,
    length,
    rotateY: Lib.degToRad(range(0, 360)),
    rotateX: Lib.degToRad(range(index === 0 ? 0 : 20, index === 0 ? 10 : BRANCH_ROTATE)),
    scale,
    lengthScale,
    leafTransform,
    leafRotations: Lib.makeArr(leafCount, () => Lib.degToRad(range(0, 360))),
    subBranches: [],
    id: id + index
  }));

  parentBranch.subBranches = subBranches;

  return subBranches;
}
