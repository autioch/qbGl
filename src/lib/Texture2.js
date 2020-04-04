import { loadImage } from './utils';

export default class Texture2 {
  constructor(context, options = {}) {
    this.context = context;
    this.texture = context.createTexture();
    this.isLoaded = false;

    context.bindTexture(context.TEXTURE_2D, this.texture);

    options.WRAP_S && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, options.WRAP_S);
    options.WRAP_T && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, options.WRAP_T);
    options.MIN_FILTER && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, options.MIN_FILTER);
    options.MAG_FILTER && context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, options.MAG_FILTER);

    options.url && this.loadImage(options.url);
  }

  loadImage(url) {
    this.isLoaded = false;
    this.readyPromise = loadImage(url).then((image) => this.ready(image));
  }

  ready(image) {
    const { context } = this;

    this.image = image;
    this.isLoaded = true;

    this.x1 = 0;
    this.x2 = image.width;

    this.y1 = 0;
    this.y2 = image.height;

    context.bindTexture(context.TEXTURE_2D, this.texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
  }
}
