import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';
import template from './template.html';

export default {
  title: 'light',
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition', 'aTextureCoord']
  },
  fsh: {
    source: fsh,
    uniforms: ['uSampler']
  },
  Scene,
  template
};
