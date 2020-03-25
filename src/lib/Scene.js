import Matrix from './Matrix';

export default class Scene {
  constructor(selector, dontDepthTest) {
    let context;
    const canvas = document.getElementById(selector);

    if (!canvas) {
      throw 'Canvas not found.';
    }

    try {
      context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (err) {
      throw `Failed to initialize WebGL. Your browser may not support it. ${err.message}`;
    }

    if (!context) {
      throw 'Failed to initialize WebGL. Your browser may not support it.';
    }
    this.context = context;
    this.setViewport(canvas.width, canvas.height);
    context.clearColor(0.0, 0.0, 0.0, 1.0);
    !dontDepthTest && context.enable(context.DEPTH_TEST);
    this.animate = this.animate.bind(this);
    this._lastAnimate = 0;
    this.pMatrix = new Matrix();
    this.mMatrix = new Matrix();
  }

  get() {
    return this.context;
  }

  setProgram(program) {
    this.program = program;
  }

  setViewport(width, height) {
    this.width = width;
    this.height = height;
  }
  animate() {
    const { context } = this;

    context.viewport(0, 0, this.width, this.height);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT); // eslint-disable-line no-bitwise
    this.pMatrix.perspective(45, this.width / this.height, 0.1, 100.0);
    this.mMatrix.identity();

    /* custom function */
    this.render(context, this.mMatrix, this.program);
    const timeNow = new Date().getTime();

    if (this._lastAnimate !== 0) {
      /* custom function */
      this.update(timeNow - this._lastAnimate);
    }
    this._lastAnimate = timeNow;
    this._request = requestAnimationFrame(this.animate);
  }

  stop() {
    if (this._request) {
      window.cancelAnimationFrame(this._request);
      this._request = undefined;
    }
  }

  setMatrixUniforms() {
    this._setUniform('uPMatrix', this.pMatrix);
    this._setUniform('uMVMatrix', this.mMatrix);
  }

  _setUniform(uniform, matrix) {
    this.context.uniformMatrix4fv(this.program.getUniform(uniform), false, matrix.get());
  }

  // replace this with your own function
  render(context, mvMatrix, program) {} // eslint-disable-line no-unused-vars, class-methods-use-this, no-empty-function

  // replace this with your own function
  update(timeSinceLastUpdate) {} // eslint-disable-line no-unused-vars, class-methods-use-this, no-empty-function
}
