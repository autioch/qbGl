import Texture from './Texture';

export const degToRad = (degrees) => degrees * Math.PI / 180;
export const radToDeg = (radians) => radians * 180 / Math.PI;
export const distance3d = (vec3a, vec3b) => Math.hypot(vec3a[0] - vec3b[0], vec3a[1] - vec3b[1], vec3a[2] - vec3b[2]);
export const vec3Add = (vec3a, vec3b) => [vec3a[0] + vec3b[0], vec3a[1] + vec3b[1], vec3a[2] + vec3b[2]];
export const vec3Substract = (vec3a, vec3b) => [vec3a[0] - vec3b[0], vec3a[1] - vec3b[1], vec3a[2] - vec3b[2]];
export const vec3Divide = (vec3a, vec3b) => [vec3a[0] / vec3b[0], vec3a[1] / vec3b[1], vec3a[2] / vec3b[2]];
export const range = (min, max) => Math.round(((Math.random() * (max - min)) + min) * 100) / 100;
export const makeArr = (count, itemBuilder) => {
  if (typeof itemBuilder === 'function') {
    return new Array(count).fill(null).map(itemBuilder);
  }

  return new Array(count).fill(itemBuilder);
};

export function mouse({ selector, onStart, onMove, onStop }) {
  function stopMouse() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', stopMouse);
    onStop && onStop();
  }

  function startMouse() {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', stopMouse);
    onStart && onStart();
  }

  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;

  el.addEventListener('focus', () => el.addEventListener('mousedown', startMouse));
  el.addEventListener('blur', () => el.removeEventListener('mousedown', startMouse));
}

export function keyboard({ selector, onKeydown }) {
  const currentKeys = {};

  function keydown(ev) {
    currentKeys[ev.keyCode] = true;
    onKeydown && onKeydown(ev);
    ev.preventDefault();
  }

  function keyup(ev) {
    currentKeys[ev.keyCode] = false;
    ev.preventDefault();
  }

  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;

  el.addEventListener('focus', () => {
    el.addEventListener('keydown', keydown);
    el.addEventListener('keyup', keyup);
  });

  el.addEventListener('blur', () => {
    el.removeEventListener('keydown', keydown);
    el.removeEventListener('keyup', keyup);
    Object.keys(currentKeys).forEach((key) => currentKeys[key] = false);
  });

  return currentKeys;
}

export function loadTextures(context, urls, onLoad) {
  const textures = [];
  const isLoaded = (texture) => texture.loaded;

  function texturesLoaded() {
    if (textures.every(isLoaded)) {
      onLoad(textures);
    }
  }

  function createTexture(url) {
    return new Texture(context, {
      url,
      onload: texturesLoaded
    });
  }

  textures.push(...urls.map(createTexture));

  return textures;
}

export function configBuilder(defaultConfig) {
  function checkKey(key) {
    if (!defaultConfig.hasOwnProperty(key)) {
      throw Error(`Unknown config key passed ${key}`);
    }
  }

  return function buildConfig(config, contextDefaults = {}) {
    Object.keys(config).forEach(checkKey);

    return Object.assign({}, defaultConfig, contextDefaults, config);
  };
}

export function loadImage(url) {
  const image = new Image();

  image.crossOrigin = ''; // ask for CORS permission

  return new Promise((resolve, reject) => {
    image.onerror = reject;
    image.onload = () => resolve(image);

    image.src = url;
  });
}
