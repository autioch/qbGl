import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    attributes: ['a_color', 'a_position'],
    uniforms: ['u_matrix']
  },
  fsh: {
    source: fsh
  },
  ui: {
    title: '3d perspective 01'
  }
};
