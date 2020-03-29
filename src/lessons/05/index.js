import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  title: 'texture',
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition', 'aTextureCoord']
  },
  fsh: {
    source: fsh,
    uniforms: ['uSampler']
  },
  Scene
};
