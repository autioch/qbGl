import Lib from '../lib';
import one from './01';
import two from './02';
import three from './03';
import four from './04';
import five from './05';
import six from './06';
import seven from './07';
import eight from './08';
import nine from './09';

const lessons = [
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine
];

lessons.forEach((lesson) => {
  const app = new Lib.App(lesson);

  document.body.append(app.el);
  app.render();
  app.el.focus();
});
