import Lib from 'lib';

export default function cylinder(height, radius, divisionCount) {
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
