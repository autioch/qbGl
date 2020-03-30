import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition']
  },
  fsh: {
    source: fsh
  },
  ui: {
    title: 'Basic shapes'
  }
};
