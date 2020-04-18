import Program from './Program';
import UI from './UI';
import { configBuilder } from './utils';

const buildConfig = configBuilder({
  skipDepthTest: false,
  Scene: null,
  vsh: '',
  fsh: '',
  ui: {}
});

export default class App {
  constructor(config) {
    this.config = buildConfig(config);

    this.start = this.start.bind(this);
    this.loop = this.loop.bind(this);
    this.stop = this.stop.bind(this);

    this.ui = new UI(this.config.ui);

    this.ui.el.addEventListener('focus', this.start);
    this.ui.el.addEventListener('blur', this.stop);

    this.context = this.ui.canvas.getContext('webgl');
    this.context.clearColor(0.0, 0.0, 0.0, 1.0); // calling .clear will make black canvas

    !this.config.skipDepthTest && this.context.enable(this.context.DEPTH_TEST);

    this.program = new Program(this.context);
    this.program.setShaderFromConfig(this.config.vsh, this.context.VERTEX_SHADER);
    this.program.setShaderFromConfig(this.config.fsh, this.context.FRAGMENT_SHADER);
    this.program.use();

    this.sceneContext = {
      context: this.context,
      el: this.ui.el,
      canvas: this.ui.canvas,
      attributes: this.program.attributes,
      uniforms: this.program.uniforms
    };
  }

  didMount() {
    this.scene = new this.config.Scene();
    this.initPromise = Promise
      .resolve(this.scene.initialize(this.sceneContext))
      .then(() => this.scene.ready(this.sceneContext));
  }

  start() {
    this.initPromise.then(() => {
      this._focused = true;
      this._lastAnimate = 0;
      this.render();
      this._raf = requestAnimationFrame(this.loop);
    });
  }

  loop() {
    if (!this._focused) {
      return;
    }

    const timeNow = new Date().getTime();
    const isChanged = this._lastAnimate !== 0 && this.scene.update({
      pulse: timeNow - this._lastAnimate,
      canvas: this.canvas
    });

    isChanged !== false && this.render();
    this._lastAnimate = timeNow;
    this._raf = requestAnimationFrame(this.loop);
  }

  render() {
    this.context.viewport(0, 0, this.ui.canvas.width, this.ui.canvas.height);
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT); // eslint-disable-line no-bitwise
    this.scene.render(this.sceneContext);
  }

  stop() {
    this._focused = false;
    this._raf && window.cancelAnimationFrame(this._raf);
    this._raf = undefined;
  }
}
