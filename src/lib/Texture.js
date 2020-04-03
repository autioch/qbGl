import { configBuilder } from './utils';

const noop = () => {}; // eslint-disable-line no-empty-function

const buildConfig = configBuilder({
  onload: noop,
  mipmap: false,
  url: '',
  magFilter: null,
  minFilter: null
});

export default class Texture {
  constructor(context, options) {
    this.context = context;
    this.texture = this.context.createTexture();
    this.loaded = false;

    this.config = buildConfig(options, {
      magFilter: context.NEAREST,
      minFilter: context.NEAREST
    });

    this.image = new Image();
    this.image.onerror = this.onerror.bind(this);
    this.image.onload = this.onload.bind(this);
    this.image.crossOrigin = ''; // ask for CORS permission

    this.loadPromise = new Promise((resolve, reject) => {
      this.loadResolve = resolve;
      this.loadReject = reject;
    });

    this.image.src = this.config.url;
  }

  get() {
    return this.texture;
  }

  onload() {
    const { context } = this;

    // context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    this.bind(this.config.magFilter, this.config.minFilter);

    this.config.mipmap && context.generateMipmap(context.TEXTURE_2D);
    context.bindTexture(context.TEXTURE_2D, null);
    this.loaded = true;
    this.config.onload();
    this.loadResolve();
  }

  onerror() {
    this.loadReject();
    throw `Unable to load image for texture: ${this.config.url}`;
  }

  bind(magFilter, minFilter) {
    const { context } = this;

    context.bindTexture(context.TEXTURE_2D, this.texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, magFilter);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, minFilter);
  }
}
