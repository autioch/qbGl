function getCanvas(selector) {
  var canvas;
  if (selector) {
    canvas = document.querySelector(selector);
  } else {
    canvas = document.createElement('canvas');
  }
  if (!canvas) {
    throw 'Canvas not found or not created.';
  }
  return canvas;
}

function getContext(canvas) {
  var context;
  try {
    context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch (error) {
    throw 'Failed to get webgl context. Your browser may not support it.';
  }

  if (!context) {
    throw 'Failed to initialize WebGL. Your browser may not support it.';
  }
  return context;
}

function Scene(options) {
  var attr;
  var canvas = this.canvas = getCanvas(this.selector);
  var context = this.context = getContext(canvas);

  for (attr in this.attributes) {
    canvas.setAttribute(attr, this.attributes[attr]);
  }

  this.pMatrix = new Matrix();
  this.mMatrix = new Matrix();

  context.clearColor.apply(context, this.background);
  this.depthTest && context.enable(context.DEPTH_TEST);
  this.program = new this.Program(context);
  this.__animate = this.__animate.bind(this);
  this.__time = 0;
  this.initialize(context, options || {});
}

Scene.prototype = {
  depthTest: true,
  background: [0, 0, 0, 1],
  selector: false,
  Program: Program,
  attributes: {
    width: 300,
    height: 225,
  },
  initialize: function(context, options) {} /* jshint ignore:line */ ,
  resetCanvas: function() {
    var canvas = this.canvas;
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  },
  setMatrixUniforms: function() {
    this.context.uniformMatrix4fv(this.program.getUniform('uPMatrix'), false, this.pMatrix.get());
    this.context.uniformMatrix4fv(this.program.getUniform('uMVMatrix'), false, this.mMatrix.get());
  },
  __animate: function() {
    var context = this.context;
    var canvas = this.canvas;
    context.viewport(0, 0, canvas.width, canvas.height);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT); /* jshint ignore:line */
    this.pMatrix.perspective(45, canvas.width / canvas.height, 0.1, 100.0);
    this.mMatrix.identity();
    this.render(context, this.mMatrix, this.program);
    var timeNow = new Date().getTime();
    if (this.__time !== 0) {
      this.update(timeNow - this.__time);
    }
    this.__time = timeNow;
    this.start();
  },
  start: function() {
    this.__raf = requestAnimationFrame(this.__animate);
    return this;
  },
  stop: function() {
    if (this.__raf) {
      window.cancelAnimationFrame(this.__raf);
      this.__raf = undefined;
    }

    return this;
  },
  render: function(context, modelViewMatrix, program) { /* jshint ignore:line */ },
  update: function(timeSinceLastUpdate) { /* jshint ignore:line */ },
};
