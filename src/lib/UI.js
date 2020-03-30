import { configBuilder } from './utils';

const buildConfig = configBuilder({
  width: 300,
  height: 225,
  title: '',
  template: ''
});

export default class UI {
  constructor(config) {
    this.config = buildConfig(config);

    this.el = document.createElement('section');
    this.el.classList.add('app');
    this.el.setAttribute('tabindex', 0);

    const title = document.createElement('header');

    title.textContent = this.config.title;
    title.classList.add('app-title');
    this.el.append(title);

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('app-canvas');
    this.canvas.height = this.config.height;
    this.canvas.width = this.config.width;

    this.el.append(this.canvas);

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.config.template;

    while (wrapper.childNodes.length > 0) {
      this.el.appendChild(wrapper.childNodes[0]);
    }
  }
}
