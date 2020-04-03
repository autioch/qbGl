import Matrix from './Matrix';
import Program from './Program';
import UI from './UI';
import { configBuilder } from './utils';

const buildConfig = configBuilder({
  width: 300,
  height: 225,
  title: '',
  template: '',

  skipDepthTest: false,
  Scene: null,
  vsh: {},
  fsh: {},
  ui: {}
});

export default class App {
  constructor(config) {
    this.config = buildConfig(config);

    this.start = this.start.bind(this);
    this.loop = this.loop.bind(this);
    this.stop = this.stop.bind(this);
    this.setMatrixUniforms = this.setMatrixUniforms.bind(this);

    this.ui = new UI(this.config.ui);

    this.ui.el.addEventListener('focus', this.start);
    this.ui.el.addEventListener('blur', this.stop);

    this.context = this.ui.canvas.getContext('webgl');
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);

    !this.config.skipDepthTest && this.context.enable(this.context.DEPTH_TEST);

    this.pMatrix = new Matrix();
    this.mMatrix = new Matrix();

    this.scene = new this.config.Scene();
    this.initPromise = Promise
      .resolve(this.scene.initialize({
        context: this.context,
        el: this.ui.el,
        canvas: this.ui.canvas
      }))
      .then(() => this.scene.ready({
        context: this.context
      }));

    this.program = new Program(this.context);
    this.program.setShaderFromConfig(this.config.vsh, this.context.VERTEX_SHADER);
    this.program.setShaderFromConfig(this.config.fsh, this.context.FRAGMENT_SHADER);
    this.program.use();
  }

  start() {
    this.initPromise.then(() => {
      this._focused = true;
      this._lastAnimate = 0;
      this._raf = requestAnimationFrame(this.loop);
    });
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
      setMatrixUniforms: this.setMatrixUniforms,
      canvas: this.ui.canvas
    });
  }

  stop() {
    this._focused = false;
    this._raf && window.cancelAnimationFrame(this._raf);
    this._raf = undefined;
  }

  setMatrixUniforms() {
    this.context.uniformMatrix4fv(this.program.locateUniform('uPMatrix'), false, this.pMatrix.get());
    this.context.uniformMatrix4fv(this.program.locateUniform('uMVMatrix'), false, this.mMatrix.get());
  }
}
