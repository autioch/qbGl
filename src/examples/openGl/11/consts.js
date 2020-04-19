const latitudeBands = 30;
const longitudeBands = 30;
const radius = 2;

const vertexPositionData = [];
const normalData = [];
const textureCoordData = [];

for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
  const theta = latNumber * Math.PI / latitudeBands;
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
    const phi = longNumber * 2 * Math.PI / longitudeBands;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    const x = cosPhi * sinTheta;
    const y = cosTheta;
    const z = sinPhi * sinTheta;
    const u = 1 - (longNumber / longitudeBands);
    const v = 1 - (latNumber / latitudeBands);

    normalData.push(x);
    normalData.push(y);
    normalData.push(z);
    textureCoordData.push(u);
    textureCoordData.push(v);
    vertexPositionData.push(radius * x);
    vertexPositionData.push(radius * y);
    vertexPositionData.push(radius * z);
  }
}

const indexData = [];

for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
  for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
    const first = (latNumber * (longitudeBands + 1)) + longNumber;
    const second = first + longitudeBands + 1;

    indexData.push(first);
    indexData.push(second);
    indexData.push(first + 1);

    indexData.push(second);
    indexData.push(second + 1);
    indexData.push(first + 1);
  }
}

export {
  indexData,
  normalData,
  textureCoordData,
  vertexPositionData
};
