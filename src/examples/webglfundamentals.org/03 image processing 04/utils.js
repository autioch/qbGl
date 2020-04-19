import Lib from 'lib';

const sum = (prev, curr) => prev + curr;

function computeKernelWeight(kernel) {
  const weight = kernel.reduce(sum, 0);

  return weight <= 0 ? 1 : weight;
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
  computeKernelWeight,
  setupTextFrameBuffer
};
