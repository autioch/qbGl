import Lib from 'lib';
import growTree from './growTree';
import {
  BRANCH_COLOR,
  BRANCH_LENGTH,
  BRANCH_RADIUS,

  CYLINDER_VERTICES,

  LEAF_COLOR,
  LEAF_VERTICES
} from './consts';

export default class Tree {
  constructor(context) {
    this.context = context;

    this.branch = new Lib.ColorShape(context, {
      vertices: CYLINDER_VERTICES,
      normals: Lib.makeArr(CYLINDER_VERTICES.length / 3, [0, 1, 0]).flat(),
      colors: Lib.makeArr(CYLINDER_VERTICES.length / 3, BRANCH_COLOR).flat(),
      mode: context.TRIANGLE_STRIP
    });

    this.leaf = new Lib.ColorShape(context, {
      vertices: LEAF_VERTICES,
      normals: Lib.makeArr(LEAF_VERTICES.length / 3, [0, 1, 0]).flat(),
      colors: Lib.makeArr(LEAF_VERTICES.length / 3, LEAF_COLOR).flat(),
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
  }

  render(matrix, matrixLocation, colorLocation, positionLocation) {
    this.renderBranch(this.mainBranch, matrix, colorLocation, matrixLocation, positionLocation);
  }

  renderBranch(branch, matrix, colorLocation, matrixLocation, positionLocation) {
    this.branch.color.fillBuffer(colorLocation);

    matrix
      .push()
      .rotateY(branch.rotateY)
      .rotateX(branch.rotateX)
      .push()
      .scale([branch.scale, branch.lengthScale, branch.scale])
      .fillBuffer(matrixLocation)
      .pop();

    this.branch.render(undefined, positionLocation);

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
