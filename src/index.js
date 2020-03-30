import Lib from './lib';
import lessons from './lessons';
import './styles';

function setupLesson(lesson) {
  const app = new Lib.App(lesson);

  document.body.append(app.ui.el);
  app.render();
  app.ui.el.focus();
}

lessons.forEach(setupLesson);
