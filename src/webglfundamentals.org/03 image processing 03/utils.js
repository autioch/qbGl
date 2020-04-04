const random = (range) => Math.floor(Math.random() * range);

function generateRect(width, height) {
  const x1 = random(width);
  const x2 = random(width - x1);

  const y1 = random(height);
  const y2 = random(height - y1);

  return [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ];
}

function generateColor() {
  return [
    Math.random(),
    Math.random(),
    Math.random()
  ];
}

function generateRects(amount, width, height) {
  return new Array(amount).fill(null).map(() => ({
    vertices: new Float32Array(generateRect(width, height)),
    color: generateColor()
  }));
}

const sum = (prev, curr) => prev + curr;

function computeKernelWeight(kernel) {
  const weight = kernel.reduce(sum, 0);

  return weight <= 0 ? 1 : weight;
}

export {
  generateRects,
  computeKernelWeight
};
