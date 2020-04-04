import Lib from './lib';
import './styles';

function setupApp(config) {
  const app = new Lib.App(config.default);

  document.body.append(app.ui.el);
  app.initPromise.then(() => app.render());

  return app;
}

const apps = [
  ...require('./webglfundamentals.org')

  // ...require('./lessons'),
  // ...require('./tests')
]
  .slice(0, 16) // limit of webgl contexts
  .map(setupApp);

apps[0].ui.el.focus();
