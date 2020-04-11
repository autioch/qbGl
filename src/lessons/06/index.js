import Scene from './Scene';
import fsh from './main.fsh';
import vsh from './main.vsh';
import template from './template.html';

export default {
  Scene,
  vsh,
  fsh,
  ui: {
    title: module.id,
    template,
    keybinds: {
      F: true,
      arrows: true,
      PageUp: true,
      PageDown: true
    }
  }
};
