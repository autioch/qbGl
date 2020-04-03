import Lib from './lib';
import webglfundamentals from './webglfundamentals.org';
import tests from './tests';
import './styles';

function setupApp(config) {
  const app = new Lib.App(config.default);

  document.body.append(app.ui.el);
  app.initPromise.then(() => app.render());
  app.ui.el.focus();
}

[...webglfundamentals, ...tests].forEach(setupApp);
