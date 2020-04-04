import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh: {
    source: vsh,
    attributes: ['a_position', 'a_texCoord'],
    uniforms: ['u_resolution']
  },
  fsh: {
    source: fsh,
    uniforms: ['u_image', 'u_textureSize']
  },
  ui: {
    title: 'image processing 02 - blur'
  }
};
