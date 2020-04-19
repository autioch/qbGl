import Scene from './Scene';
import Lib from 'lib';
import fsh from './main.fsh';
import vsh from './main.vsh';

const config = {
  Scene,
  vsh,
  fsh,
  ui: {
    width: window.innerWidth,
    height: window.innerHeight
  }
};

const app = new Lib.App(config);

document.body.append(app.ui.el);

app.didMount();

app.initPromise.then(() => app.render());
