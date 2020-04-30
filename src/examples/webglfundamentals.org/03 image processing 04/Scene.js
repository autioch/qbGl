import Lib from 'lib';
import leavesUrl from '../leaves.jpg';
import { computeKernelWeight, setupTextFrameBuffer } from './utils';
import { kernels, effectsToApply } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.textCoord = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]
    });

    this.texture = new Lib.Texture2(context, {
      url: leavesUrl,
      MAG_FILTER: context.NEAREST,
      MIN_FILTER: context.NEAREST,
      WRAP_S: context.CLAMP_TO_EDGE,
      WRAP_T: context.CLAMP_TO_EDGE
    });

    return this.texture.readyPromise;
  }

  ready({ context }) {
    const { x1, x2, y1, y2 } = this.texture;

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]
    });

    this.textFrameBuffers = [
      setupTextFrameBuffer(context, this.texture.image),
      setupTextFrameBuffer(context, this.texture.image)
    ];
  }

  render({ context, attributes, uniforms, canvas }) {
    const flipYLocation = uniforms.u_flipY;

    this.position.fillBuffer(attributes.a_position);
    this.textCoord.fillBuffer(attributes.a_texCoord);
    context.uniform2f(uniforms.u_textureSize, this.texture.image.width, this.texture.image.height);

    context.uniform1f(flipYLocation, 1); // don't y flip images while drawing to the textures

    context.bindTexture(context.TEXTURE_2D, this.texture.texture);

    effectsToApply.forEach((effect, index) => {
      const textFrameBuffer = this.textFrameBuffers[index % 2];

      this.renderTexture(context, uniforms, canvas, textFrameBuffer.frameBuffer.frameBuffer, effect);
      context.bindTexture(context.TEXTURE_2D, textFrameBuffer.texture.texture);
    });
    context.uniform1f(flipYLocation, -1);

    this.renderTexture(context, uniforms, canvas, null, 'normal');
  }

  renderTexture(context, uniforms, canvas, frameBuffer, kernelName) { // eslint-disable-line class-methods-use-this
    context.bindFramebuffer(context.FRAMEBUFFER, frameBuffer);
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.viewport(0, 0, canvas.width, canvas.height);
    context.uniform1fv(uniforms['u_kernel[0]'], kernels[kernelName]);
    context.uniform1f(uniforms.u_kernelWeight, computeKernelWeight(kernels[kernelName]));
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
