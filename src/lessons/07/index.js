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
    uniforms: ['uSampler']
  },
  ui: {
    title: 'light',
    template
  }
};
