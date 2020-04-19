import Lib from 'lib';
import Branch from './Branch';
import Leaf from './Leaf';
import { range } from '../utils';

const BRANCH_MAX_COUNT = 2000; // 4096
const BRANCH_SUB = 4;
const BRANCH_LEAF = 5;
const BRANCH_ROTATE = 70;
const BRANCH_RADIUS = 17;
const BRANCH_RADIUS_DIMINISH = 3;
const BRANCH_LENGTH = 150;
const BRANCH_LENGTH_DIMINISH = 4;
const BRANCH_COLOR = [0.6, 0.2, 0, 1];

function growBranch(parentBranch, id) {
  const radius = parentBranch.radius - BRANCH_RADIUS_DIMINISH;
  const scale = radius / BRANCH_RADIUS;
  const length = parentBranch.length - BRANCH_LENGTH_DIMINISH; // eslint-disable-line no-shadow
  const lengthScale = length / BRANCH_LENGTH;

  if (radius < 4) {
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
  const subBranches = new Array(BRANCH_SUB).fill(null).map((_, index) => ({ // eslint-disable-line no-unused-vars
    radius,
    length,
    rotateY: Lib.degToRad(range(0, 360)),
    rotateX: Lib.degToRad(range(0, BRANCH_ROTATE)),
    scale,
    lengthScale,
    leafTransform,
    leafRotations: new Array(leafCount).fill(null).map(() => Lib.degToRad(range(0, 360))),
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
    this.leaf = new Leaf(context);

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
      data: new Array(this.branch.position.count).fill(BRANCH_COLOR).flat()
    });
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    const isColorUniform = colorLocation instanceof WebGLUniformLocation;

    if (isColorUniform) {
      this.context.uniform4fv(colorLocation, BRANCH_COLOR);
    } else {
      this.color.fillBuffer(colorLocation);
    }

    this.renderBranch(this.mainBranch, matrix, colorLocation, matrixLocation, positionLocation);
  }

  renderBranch(branch, matrix, colorLocation, matrixLocation, positionLocation) {
    const isColorUniform = colorLocation instanceof WebGLUniformLocation;

    if (isColorUniform) {
      this.context.uniform4fv(colorLocation, BRANCH_COLOR);
    } else {
      this.color.fillBuffer(colorLocation);
    }

    matrix
      .push()
      .rotateY(branch.rotateY)
      .rotateX(branch.rotateX)
      .scale([branch.scale, branch.lengthScale, branch.scale])
      .fillBuffer(matrixLocation);
    this.branch.render(positionLocation);

    if (branch.leafRotations.length) {
      matrix.push().translate([branch.radius, 0, 0]);
      branch.leafRotations.forEach((leafRotation) => {
        matrix.translate([0, 0, branch.leafTransform]).rotateY(leafRotation).fillBuffer(matrixLocation);
        this.leaf.render(colorLocation, positionLocation);
      });
      matrix.pop();
    }

    matrix.translate([0, branch.length, 0]);
    branch.subBranches.forEach((subBranch) => this.renderBranch(subBranch, matrix, colorLocation, matrixLocation, positionLocation));
    matrix.pop();
  }
}
