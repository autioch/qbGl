import { configBuilder, loadImage } from './utils';

const buildConfig = configBuilder({
  url: '',
  MAG_FILTER: null,
  MIN_FILTER: null,
  WRAP_S: null,
  WRAP_T: null
});

export default class Texture2 {
  constructor(context, options) {
    this.context = context;
    this.isLoaded = false;

    this.config = buildConfig(options);

    this.readyPromise = loadImage(options.url).then((image) => this.ready(image, options));
  }

  ready(image, options) {
    const { context } = this;

    this.texture = context.createTexture();
    this.image = image;
    this.isLoaded = true;

    this.x1 = 0;
    this.x2 = this.image.width;

    this.y1 = 0;
    this.y2 = this.image.height;

    context.bindTexture(context.TEXTURE_2D, this.texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);

    // https://www.khronos.org/webgl/public-mailing-list/public_webgl/1008/msg00017.php
    options.WRAP_S && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, options.WRAP_S);
    options.WRAP_T && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, options.WRAP_T);
    options.MIN_FILTER && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, options.MIN_FILTER);
    options.MAG_FILTER && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, options.MAG_FILTER);
  }
}
