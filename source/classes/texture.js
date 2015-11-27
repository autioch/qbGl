/**
 * @param {object} options
 *    @param {integer} magFilter
 *    @param {integer} minFilter
 *    @param {integer} mipmap
 *    @param {function} onLoad
 *    @param {function} onError
 *    @param {string} src
 */
function Texture(context, options) {
  var image = new Image();
  var texture = context.createTexture();

  var magFilter = options.magFilter || context.LINEAR;
  var minFilter = options.minFilter || context.NEAREST_MIPMAP_LINEAR;
  var wrapS = options.wrapS || context.REPEAT;
  var wrapT = options.wrapT || context.REPEAT;
  var TEXTURE_2D = context.TEXTURE_2D;

  function bind(magFilter, minFilter) {
    context.bindTexture(TEXTURE_2D, texture);
    context.texImage2D(TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image); /* jshint ignore:line */
    context.texParameteri(TEXTURE_2D, context.TEXTURE_MAG_FILTER, magFilter);
    context.texParameteri(TEXTURE_2D, context.TEXTURE_MIN_FILTER, minFilter);
  }

  function bind2(samplerUniform) {
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, texture);
    context.uniform1i(samplerUniform, 0);
  }

  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  function onload() {
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    context.bindTexture(TEXTURE_2D, texture);
    context.texImage2D(TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
    context.texParameteri(TEXTURE_2D, context.TEXTURE_WRAP_S, wrapS);
    context.texParameteri(TEXTURE_2D, context.TEXTURE_WRAP_T, wrapT);
    context.texParameteri(TEXTURE_2D, context.TEXTURE_MAG_FILTER, magFilter);
    context.texParameteri(TEXTURE_2D, context.TEXTURE_MIN_FILTER, minFilter);
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      context.generateMipmap(TEXTURE_2D);
    }
    context.bindTexture(TEXTURE_2D, null);
    options.onload && options.onload(texture);
  }

  function onerror() {
    throw 'Unable to load image for texture: ' + options.src;
  }

  texture.bind = bind;
  texture.bind2 = bind2;

  image.onload = onload.bind(texture);
  image.onerror = options.onerror || onerror;
  image.src = options.src;

  return texture;
}
