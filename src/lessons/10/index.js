import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';

export default {
  Scene,
  vsh,
  fsh,
  ui: {
    title: module.id,
    keybinds: {
      Arrows: true,
      WSAD: true,
      PageUp: true,
      PageDown: true
    }
  }
};
