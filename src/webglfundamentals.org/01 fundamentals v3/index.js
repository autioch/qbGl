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
    source: fsh,
    uniforms: ['u_color']
  },
  ui: {
    title: 'fundamentals v3'
  }
};