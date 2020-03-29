import Lib from './lib';
import lessons from './lessons';
import './styles';

lessons.forEach((lesson) => {
  const app = new Lib.App(lesson);

  document.body.append(app.el);
  app.render();
  app.el.focus();
});
