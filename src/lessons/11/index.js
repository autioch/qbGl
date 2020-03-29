import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';
import template from './template.html';

export default {
  title: 'mouse on the moon',
  vsh: {
    source: vsh,
    uniforms: [
      'uMVMatrix', 'uPMatrix',
      'uNMatrix', 'uAmbientColor', 'uLightingDirection', 'uDirectionalColor', 'uUseLighting'
    ],
    attributes: ['aVertexPosition', 'aVertexNormal', 'aTextureCoord']
  },
  fsh: {
    source: fsh,
    uniforms: ['uSampler']
  },
  Scene,
  template
};
