import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  title: 'Basic shapes',
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition']
  },
  fsh: {
    source: fsh
  },
  Scene
};
