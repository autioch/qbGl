const sum = (prev, curr) => prev + curr;

function computeKernelWeight(kernel) {
  const weight = kernel.reduce(sum, 0);

  return weight <= 0 ? 1 : weight;
}

export {
  computeKernelWeight
};
