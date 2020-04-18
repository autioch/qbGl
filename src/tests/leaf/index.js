import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh,
  fsh,
  ui: {
    title: module.id,
    width: window.innerWidth,
    height: window.innerHeight
  }
};
