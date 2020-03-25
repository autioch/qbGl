/* Texture
     -------
     TODO maybe return webGl texture with extra properties, instead of extra object?
     */

export default class Texture {
  constructor(webGlContext, options) {
    this.context = webGlContext;
    this.texture = this.context.createTexture();
    this.image = new Image();
    this.image.onerror = (options.onerror || this.onerror).bind(this);
    this.image.onload = (options.onload || this.onload).bind(this);

    // ask for CORS permission
    this.image.crossOrigin = '';
    options.url && this.set(options.url);
    this.magFilter = options.magFilter || webGlContext.NEAREST;
    this.minFilter = options.minFilter || webGlContext.NEAREST;
    this.mipmap = options.mipmap;
  }

  get() {
    return this.texture;
  }

  set(url) {
    this.loaded = false;
    this.image.src = url;
    this.url = url;
  }

  onload() {
    const { context } = this;

    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    context.bindTexture(context.TEXTURE_2D, this.texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, this.magFilter);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, this.minFilter);
    this.mipmap && context.generateMipmap(context.TEXTURE_2D);
    context.bindTexture(context.TEXTURE_2D, null);
    this.loaded = true;
  }

  onerror() {
    throw `Unable to load image for texture: ${this.url}`;
  }

  bind(magFilter, minFilter) {
    const { context } = this;

    context.bindTexture(context.TEXTURE_2D, this.texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, magFilter);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, minFilter);
  }
}
