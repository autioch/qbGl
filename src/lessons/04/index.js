import Scene from './Scene';

import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  title: '3d objects',
  vsh: {
    source: vsh,
    uniforms: ['uMVMatrix', 'uPMatrix'],
    attributes: ['aVertexPosition', 'aVertexColor']
  },
  fsh: {
    source: fsh
  },
  Scene
};
