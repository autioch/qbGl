import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition', 'aTextureCoord']
  },
  fsh: {
    source: fsh,
    uniforms: ['uSampler']
  },
  ui: {
    title: module.id,
    keybinds: {
      Arrows: true,
      WSAD: true,
      PageUp: true,
      PageDown: true
    }
  }
};
