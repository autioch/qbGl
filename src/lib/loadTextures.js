import Texture from './Texture';

const isLoaded = (texture) => texture.loaded;

export default function loadTextures(context, urls, onLoad) {
  const textures = [];

  function texturesLoaded() {
    if (textures.every(isLoaded)) {
      onLoad(textures);
    }
  }

  textures.push(...urls.map((url) => new Texture(context, {
    url,
    onload: texturesLoaded
  })));

  return textures;
}
