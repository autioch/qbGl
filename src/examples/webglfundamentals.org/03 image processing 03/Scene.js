import Lib from 'lib';
import '../leaves.jpg';
import { computeKernelWeight } from './utils';
import { kernels } from './consts';

export default class extends Lib.Scene {
  initialize({ context, el }) {
    this.textCoord = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]
    });

    this.texture = new Lib.Texture2(context, {
      url: 'leaves.jpg',
      MAG_FILTER: context.NEAREST,
      MIN_FILTER: context.NEAREST,
      WRAP_S: context.CLAMP_TO_EDGE,
      WRAP_T: context.CLAMP_TO_EDGE
    });

    this.setupSelector(el);

    return this.texture.readyPromise;
  }

  setupSelector(el) {
    this.kernelSelector = document.createElement('select');

    el.append(this.kernelSelector);

    const options = Object.keys(kernels).map((key) => {
      const option = document.createElement('option');

      option.value = key;
      option.textContent = key;

      return option;
    });

    options.forEach((option) => this.kernelSelector.append(option));

    this.kernelSelector.addEventListener('change', () => {
      this.syncKernel();
      el.focus();
    });
    this.syncKernel();
  }

  syncKernel() {
    this.kernel = kernels[this.kernelSelector.value];
    this.kernelWeight = computeKernelWeight(this.kernel);
  }

  ready({ context }) {
    const { x1, x2, y1, y2 } = this.texture;

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]
    });
  }

  render({ context, attributes, uniforms, canvas }) {
    this.position.fillBuffer(attributes.a_position);
    this.textCoord.fillBuffer(attributes.a_texCoord);
    context.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    context.uniform2f(uniforms.u_textureSize, this.texture.image.width, this.texture.image.height);
    context.uniform1fv(uniforms['u_kernel[0]'], this.kernel);
    context.uniform1f(uniforms.u_kernelWeight, this.kernelWeight);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
