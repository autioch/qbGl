import Matrix from './Matrix';
import Program from './Program';

const CONFIG_DEFAULT = {
  width: 300,
  height: 225,
  skipDepthTest: false,
  Scene: null,
  vsh: {},
  fsh: {},
  title: '',
  template: ''
};

function checkConfig(config) {
  Object.keys(config).forEach((key) => {
    if (!CONFIG_DEFAULT.hasOwnProperty(key)) {
      throw Error(`Unknown config key ${key}`);
    }
  });
}

export default class App {
  constructor(config) {
    checkConfig(config);
    this.config = Object.assign({}, CONFIG_DEFAULT, config);

    this.start = this.start.bind(this);
    this.loop = this.loop.bind(this);
    this.stop = this.stop.bind(this);
    this.setMatrixUniforms = this.setMatrixUniforms.bind(this);

    this.el = document.createElement('section');
    this.el.classList.add('app');
    this.el.setAttribute('tabindex', 0);
    this.el.addEventListener('focus', this.start);
    this.el.addEventListener('blur', this.stop);

    const title = document.createElement('header');

    title.textContent = this.config.title;
    title.classList.add('app-title');
    this.el.append(title);

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('app-canvas');
    this.canvas.height = this.config.height;
    this.canvas.width = this.config.width;

    this.el.append(this.canvas);

    this.context = this.canvas.getContext('webgl');
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);

    !this.config.skipDepthTest && this.context.enable(this.context.DEPTH_TEST);

    this.pMatrix = new Matrix();
    this.mMatrix = new Matrix();

    this.scene = new this.config.Scene();

    this.scene.initialize({
      context: this.context,
      el: this.el
    });

    this.program = new Program(this.context);
    this.program.setShaderFromConfig(this.config.vsh, this.context.VERTEX_SHADER);
    this.program.setShaderFromConfig(this.config.fsh, this.context.FRAGMENT_SHADER);
    this.program.use();

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.config.template;

    while (wrapper.childNodes.length > 0) {
      this.el.appendChild(wrapper.childNodes[0]);
    }
  }

  start() {
    this._focused = true;
    this._lastAnimate = 0;
    this._raf = requestAnimationFrame(this.loop);
  }

  loop() {
    if (!this._focused) {
      return;
    }
    this.render();

    const timeNow = new Date().getTime();

    this._lastAnimate !== 0 && this.scene.update(timeNow - this._lastAnimate);
    this._lastAnimate = timeNow;

    this._raf = requestAnimationFrame(this.loop);
  }

  render() {
    this.context.viewport(0, 0, this.config.width, this.config.height);
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT); // eslint-disable-line no-bitwise

    this.pMatrix.perspective(45, this.config.width / this.config.height, 0.1, 100.0);
    this.mMatrix.identity();

    this.scene.render({
      context: this.context,
      program: this.program,
      mMatrix: this.mMatrix,
      pMatrix: this.pMatrix,
      setMatrixUniforms: this.setMatrixUniforms
    });
  }

  stop() {
    this._focused = false;
    this._raf && window.cancelAnimationFrame(this._raf);
    this._raf = undefined;
  }

  setMatrixUniforms() {
    this.context.uniformMatrix4fv(this.program.getUniform('uPMatrix'), false, this.pMatrix.get());
    this.context.uniformMatrix4fv(this.program.getUniform('uMVMatrix'), false, this.mMatrix.get());
  }
}
