import Lib from '../../lib';

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

function setFramebuffer(context, frameBuffer, u_location, width, height) {
  // make this the framebuffer we are rendering to.
  context.bindFramebuffer(context.FRAMEBUFFER, frameBuffer);

  // Tell the shader the resolution of the framebuffer.
  context.uniform2f(u_location, width, height);

  // Tell webgl the viewport setting needed for framebuffer.
  context.viewport(0, 0, width, height);
}

function drawWithKernel(context, kernelLocation, kernelWeightLocation, kernel) {
  // set the kernel
  context.uniform1fv(kernelLocation, kernel);
  context.uniform1f(kernelWeightLocation, computeKernelWeight(kernel));

  // Draw the rectangle.
  context.drawArrays(context.TRIANGLES, 0, 6);
}

function setupTextFrameBuffer(context, image) {
  const texture = new Lib.Texture2(context, {
    MAG_FILTER: context.NEAREST,
    MIN_FILTER: context.NEAREST,
    WRAP_S: context.CLAMP_TO_EDGE,
    WRAP_T: context.CLAMP_TO_EDGE
  });

  context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, image.width, image.height, 0, context.RGBA, context.UNSIGNED_BYTE, null);

  const frameBuffer = new Lib.FrameBuffer(context, {
    texture: texture.texture
  });

  return {
    texture,
    frameBuffer
  };
}

export {
  generateRects,
  computeKernelWeight,
  setFramebuffer,
  drawWithKernel,
  setupTextFrameBuffer
};
