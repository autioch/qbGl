import Lib from 'lib';

const BRANCH_RADIUS = 17;

// const BRANCH_RADIUS_DIMINISH = 3;
const BRANCH_LENGTH = 150;

function cylinder(height, radius, divisionCount) {
  const points = [
    [radius, 0, 0]
  ];

  for (let i = 1; i <= divisionCount; i++) {
    const previous = points[points.length - 1];
    const [oldX,, oldZ] = previous;
    const radians = Lib.degToRad((360 / divisionCount) * i);

    const newX = radius * Math.cos(radians);
    const newZ = radius * Math.sin(radians);

    points.push(
      [newX, 0, newZ],
      [oldX, height, oldZ],
      [newX, height, newZ],
      [newX, 0, newZ]
    );
  }

  return points.flat();
}

export default class Branch {
  constructor(context) {
    this.context = context;

    this.position = new Lib.ArrayDataBuffer(this.context, {
      size: 3,
      data: cylinder(BRANCH_LENGTH, BRANCH_RADIUS, 20)
    });
  }

  render(positionLocation) {
    this.position.fillBuffer(positionLocation);
    this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.position.count);
  }
}
