import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';
import template from './template.html';

export default {
  Scene,
  vsh: {
    source: vsh,
    uniforms: [
      'uMVMatrix', 'uPMatrix', 'uNMatrix', 'uAmbientColor', 'uLightingDirection', 'uDirectionalColor', 'uUseLighting'
    ],
    attributes: ['aVertexPosition', 'aVertexNormal', 'aTextureCoord']
  },
  fsh: {
    source: fsh,
    uniforms: ['uSampler', 'uAlpha']
  },
  ui: {
    title: module.id,
    template,
    keybinds: {
      F: true,
      arrows: true,
      PageUp: true,
      PageDown: true
    }
  }
};
