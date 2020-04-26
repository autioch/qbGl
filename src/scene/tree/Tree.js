import Lib from 'lib';
import Branch from './Branch';
import { range } from '../utils';

const BRANCH_MAX_COUNT = 1000; // 4096
const BRANCH_SUB = 4;
const BRANCH_LEAF = 5;
const BRANCH_ROTATE = 60;
const BRANCH_RADIUS = 5;
const BRANCH_RADIUS_DIMINISH = 1;
const BRANCH_LENGTH = 150;
const BRANCH_LENGTH_DIMINISH = 4;
const BRANCH_COLOR = [0.6, 0.2, 0, 1];

const LEAF_COLOR = [0.0, 0.4, 0.0, 1];

// const FLOWER_COLOR = [1, 0.5, 1, 1];

function growBranch(parentBranch, id) {
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

function growTree(mainBranch) {
  let branchCount = 1;
  const branchQueue = [mainBranch];

  while (branchQueue.length && branchCount < (BRANCH_MAX_COUNT - BRANCH_SUB)) {
    branchQueue.push(...growBranch(branchQueue.shift(), branchCount));
    branchCount += BRANCH_SUB;
  }

  return mainBranch;
}

export default class Tree {
  constructor(context) {
    this.context = context;
    this.branch = new Branch(context);

    this.leaf = new Lib.ColorShape(context, {
      vertices: [
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
      ],
      colors: Lib.makeArr(24, LEAF_COLOR).flat(),
      mode: context.TRIANGLE_FAN
    });

    this.mainBranch = growTree({
      radius: BRANCH_RADIUS,
      length: BRANCH_LENGTH,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      lengthScale: 1,
      leafTransform: 0,
      leafRotations: [],
      id: 0
    });

    this.color = new Lib.ArrayDataBuffer(this.context, {
      size: 4,
      data: Lib.makeArr(this.branch.position.count, BRANCH_COLOR).flat()
    });
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    this.color.fillBuffer(colorLocation);
    this.renderBranch(this.mainBranch, matrix, colorLocation, matrixLocation, positionLocation);
  }

  renderBranch(branch, matrix, colorLocation, matrixLocation, positionLocation) {
    this.color.fillBuffer(colorLocation);

    matrix
      .push()
      .rotateY(branch.rotateY)
      .rotateX(branch.rotateX)
      .push()
      .scale([branch.scale, branch.lengthScale, branch.scale])
      .fillBuffer(matrixLocation)
      .pop();

    this.branch.render(positionLocation);

    if (branch.leafRotations.length) {
      matrix.push().translate([branch.radius, 0, 0]);
      branch.leafRotations.forEach((leafRotation) => {
        matrix.translate([0, branch.leafTransform, 0]).rotateY(leafRotation).fillBuffer(matrixLocation);
        this.leaf.render(colorLocation, positionLocation);
      });
      matrix.pop();
    }

    matrix.translate([0, branch.length, 0]);
    branch.subBranches.forEach((subBranch) => this.renderBranch(subBranch, matrix, colorLocation, matrixLocation, positionLocation));
    matrix.pop();
  }
}
