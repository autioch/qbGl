import { configBuilder } from './utils';
import tag from 'lean-tag';
import './ui.scss';

const buildConfig = configBuilder({
  width: 300,
  height: 225,
  title: '',
  template: '',
  keybinds: {}
});

export default class UI {
  constructor(config) {
    this.config = buildConfig(config);

    const { title } = this.config;

    this.el = tag('section.app', {
      style: {
        width: `${this.config.width}px`
      },
      attrs: {
        tabindex: 0
      }
    });

    if (title && title.length) {
      this.el.append(tag('header.app-title', typeof title === 'string' ? title.split('/').slice(-3, -1).join(' - ') : title.toString()));
    }

    this.canvas = tag('canvas.app-canvas', {
      height: this.config.height, // - 4, // border
      width: this.config.width// - 4 // border
    });

    this.el.append(this.canvas);

    const keys = Object.keys(this.config.keybinds);

    if (keys.length) {
      this.el.append(tag('div.keybinds', `Controls: ${keys.join(', ')}`));
    }

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.config.template;

    while (wrapper.childNodes.length > 0) {
      this.el.appendChild(wrapper.childNodes[0]);
    }
  }
}
