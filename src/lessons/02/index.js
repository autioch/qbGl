import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition', 'aVertexColor']
  },
  fsh: {
    source: fsh
  },
  ui: {
    title: 'Colors'
  }
};
