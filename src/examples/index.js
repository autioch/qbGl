import Lib from 'lib';
import './styles';
import tag from 'lean-tag';

function setupExamples(examples) {
  const container = tag('div.examples');

  document.body.append(container);

  const apps = examples.map((config) => {
    const app = new Lib.App(config.default);

    container.append(app.ui.el);
    app.didMount();
    app.initPromise.then(() => app.render());

    return app;
  });

  apps[0].ui.el.focus();
}

const allExamples = [
  ...require('./openGl'),
  ...require('./tests'),
  ...require('./webglfundamentals.org')
];

setupExamples(allExamples.slice(-16)); // There can be only 16 webGL contexts at once
