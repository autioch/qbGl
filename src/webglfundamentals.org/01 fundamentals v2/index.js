import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    attributes: ['a_position'],
    uniforms: ['u_resolution']
  },
  fsh: {
    source: fsh
  },
  ui: {
    title: 'fundamentals v2'
  }
};
