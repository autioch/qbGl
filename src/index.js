import Lib from './lib';
import configs from './webglfundamentals.org';
import './styles';

function setupApp(config) {
  const app = new Lib.App(config.default);

  document.body.append(app.ui.el);
  app.render();
  app.ui.el.focus();
}

configs.forEach(setupApp);
