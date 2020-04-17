import Lib from './lib';
import './styles';

function setupApp(config) {
  const app = new Lib.App(config.default);

  document.body.append(app.ui.el);
  app.didMount();
  app.initPromise.then(() => app.render());

  return app;
}

const apps = [
  // ...require('./lessons'),
  // ...require('./webglfundamentals.org'),
  ...require('./tests')
];

apps

  .slice(0, 16)

  // .slice(-16)
  .map(setupApp)[0]
  .ui.el.focus();
