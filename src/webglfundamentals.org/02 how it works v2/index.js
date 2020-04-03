import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    attributes: ['a_position', 'a_color'],
    uniforms: ['u_matrix']
  },
  fsh: {
    source: fsh
  },
  ui: {
    title: 'how it works v2'
  }
};