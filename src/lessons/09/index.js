import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';
import template from './template.html';

export default {
  Scene,
  skipDepthTest: true,
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition', 'aTextureCoord']
  },
  fsh: {
    source: fsh,
    uniforms: ['uSampler', 'uColor']
  },
  ui: {
    title: module.id,
    template,
    keybinds: {
      Arrows: true,
      PageUp: true,
      PageDown: true
    }
  }
};
