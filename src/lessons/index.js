import Lib from '../lib';
import one from './01';
import two from './02';

const lessons = [
  one,
  two
];

lessons.forEach((lesson) => {
  const app = new Lib.App(lesson);

  document.body.append(app.el);
  app.render();
  app.el.focus();
});
