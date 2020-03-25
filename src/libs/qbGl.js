/* eslint-disable max-lines */
/* eslint-disable no-multi-assign */
/* eslint-disable func-names */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
/* eslint-disable no-throw-literal */
/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable sort-vars */
/* eslint-disable no-undefined */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-params */
/* eslint-disable no-unused-vars */
/* eslint-disable id-length */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable no-shadow */
/* eslint-disable no-empty-function */

const qbGl = {};

const extend = qbGl.extend = function(objectToExtend, methodsObject) {
  for (const method in methodsObject) {
    if (methodsObject.hasOwnProperty(method)) {
      objectToExtend.prototype[method] = methodsObject[method];
    }
  }

  return objectToExtend;
};

const degToRad = qbGl.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

/* Matrix
     ---------
     This is a 4x4 matrix, which is a wrapper for mat4.
     Used to store and operate matrices. */

const Matrix = qbGl.Matrix = function() {
  this.current = mat4.create();
  this.stack = [];
};

extend(Matrix, {
  get() {
    return this.current;
  },
  push() {
    this.stack.push(mat4.clone(this.current));

    return this;
  },
  pop() {
    if (this.stack.length === 0) {
      throw 'Invalid popMatrix!';
    }
    this.current = this.stack.pop();

    return this;
  },
  identity() {
    mat4.identity(this.current);

    return this;
  },
  perspective(fovy, aspect, near, far) {
    mat4.perspective(this.current, fovy, aspect, near, far);

    return this;
  },
  rotate(degrees, rotateVertex) {
    mat4.rotate(this.current, this.current, degToRad(degrees), rotateVertex);

    return this;
  },
  translate(translateVertex) {
    mat4.translate(this.current, this.current, translateVertex);

    return this;
  },
  multiply(matrix) {
    mat4.multiply(this.current, this.current, matrix.get());

    return this;
  },
  toInvTraMat3() {
    const result = mat3.create();

    mat3.fromMat4(result, this.current);
    mat3.invert(result, result);
    mat3.transpose(result, result);

    return result;
  }
});

/* Program
     ----------
     TODO description. */

const Program = qbGl.Program = function(webGlContext) {
  this.context = webGlContext;
  this.program = webGlContext.createProgram();
  this.attribs = {};
  this.uniforms = {};
  this.attribsToSet = [];
  this.uniformsToSet = [];
};

extend(Program, {
  shaderTypes: {
    'x-shader/x-fragment': 'FRAGMENT_SHADER',
    'x-shader/x-vertex': 'VERTEX_SHADER'
  },
  setShader(shaderId) {
    const shaderScript = document.getElementById(shaderId);

    if (!shaderScript) {
      throw 'Shader script not found.';
    }

    let Shader,
        context = this.context,
        shaderType = context[this.shaderTypes[shaderScript.type]];

    if (!shaderType) {
      throw `Invalid shader type.${shaderScript.type}`;
    }
    Shader = context.createShader(shaderType);
    context.shaderSource(Shader, shaderScript.textContent);
    context.compileShader(Shader);
    if (!context.getShaderParameter(Shader, context.COMPILE_STATUS)) {
      throw `Shader compile error.${context.getShaderInfoLog(Shader)}`;
    }
    context.attachShader(this.program, Shader);

    this.cacheScriptAttributes(shaderScript, 'uniforms', this.uniformsToSet);
    this.cacheScriptAttributes(shaderScript, 'attribs', this.attribsToSet);
  },
  cacheScriptAttributes(script, scriptAttribute, arrayCache) {
    const value = script.getAttribute(`data-${scriptAttribute}`);

    if (value && value.length) {
      value.split(',').forEach((attribName) => {
        arrayCache.push(attribName);
      });
    }
  },

  /* maybe move this to Scene? */
  use() {
    let context = this.context,
        program = this.program;

    context.linkProgram(program);
    if (!context.getProgramParameter(program, this.context.LINK_STATUS)) {
      throw 'Shader program error.';
    }
    context.useProgram(program);
    this.attribsToSet.forEach(this.setAttrib.bind(this));
    this.uniformsToSet.forEach(this.setUniform.bind(this));

    return this;
  },
  setUniform(uniformName) {
    if (this.uniforms[uniformName]) {
      throw `Uniform already exsists: ${uniformName}`;
    }
    const uniform = this.context.getUniformLocation(this.program, uniformName);

    if (uniform === undefined) {
      throw `No location for uniform: ${uniformName}`;
    }
    this.uniforms[uniformName] = uniform;
  },
  getUniform(uniformName) {
    const uniform = this.uniforms[uniformName];

    if (uniform === undefined) {
      throw `Undefined uniform: ${uniformName}`;
    }

    return uniform;
  },
  setAttrib(attribName) {
    if (this.attribs[attribName]) {
      throw `Attrib already exsists: ${attribName}`;
    }
    const attrib = this.context.getAttribLocation(this.program, attribName);

    if (attrib === undefined) {
      throw `No location for attrib: ${attribName}`;
    }
    this.attribs[attribName] = attrib;
    this.context.enableVertexAttribArray(attrib);
  },
  getAttrib(attribName) {
    const attrib = this.attribs[attribName];

    if (attrib === undefined) {
      throw `Undefined attrib: ${attribName}`;
    }

    return attrib;
  }
});

/* Texture
     -------
     TODO maybe return webGl texture with extra properties, instead of extra object?
     */

const Texture = qbGl.Texture = function(webGlContext, options) {
  this.context = webGlContext;
  this.texture = this.context.createTexture();
  this.image = new Image();
  this.image.onerror = (options.onerror || this.onerror).bind(this);
  this.image.onload = (options.onload || this.onload).bind(this);
  this.image.crossOrigin = ''; // ask for CORS permission
  options.url && this.set(options.url);
  this.magFilter = options.magFilter || webGlContext.NEAREST;
  this.minFilter = options.minFilter || webGlContext.NEAREST;
  this.mipmap = options.mipmap;
};

extend(Texture, {
  get() {
    return this.texture;
  },
  set(url) {
    this.loaded = false;
    this.image.src = url;
    this.url = url;
  },
  onload() {
    const context = this.context;

    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    context.bindTexture(context.TEXTURE_2D, this.texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, this.magFilter);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, this.minFilter);
    this.mipmap && context.generateMipmap(context.TEXTURE_2D);
    context.bindTexture(context.TEXTURE_2D, null);
    this.loaded = true;
  },
  onerror() {
    throw `Unable to load image for texture: ${this.url}`;
  },
  bind(magFilter, minFilter) {
    const context = this.context;

    context.bindTexture(context.TEXTURE_2D, this.texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, magFilter);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, minFilter);
  }
});

/* Light
     -----
     */

const Light = qbGl.Light = function(webGlContext) {
  this.context = webGlContext;
};

extend(Light, {
  get3f(programAttrib, red, green, blue) {
    this.context.uniform3f(programAttrib, red, green, blue);
  },
  get3fv(programAttrib, red, green, blue) {
    const adjustedLD = vec3.create();

    vec3.normalize(adjustedLD, [red, green, blue]);
    vec3.scale(adjustedLD, adjustedLD, -1);
    this.context.uniform3fv(programAttrib, adjustedLD);
  }
});

/* Shape
     -----
     */

const Shape = qbGl.Shape = function(webGlContext) {
  this.context = webGlContext;
  this.buffers = {};
  this.textures = {};
};

extend(Shape, {
  setBuffer(bufferName, definitionArray, type, count, size) {
    if (this.buffers[bufferName]) {
      throw `Buffer already exsists: ${bufferName}`;
    }

    let context = this.context,
        buffer = context.createBuffer();

    context.bindBuffer(type, buffer);
    context.bufferData(type, definitionArray, context.STATIC_DRAW);
    buffer.size = size;
    buffer.count = count;
    buffer.type = type;
    this.buffers[bufferName] = buffer;
  },
  getBuffer(bufferName, programAttrib) {
    let context = this.context,
        buffer = this.buffers[bufferName];

    if (!buffer) {
      throw `No such buffer: ${bufferName}`;
    }
    context.bindBuffer(buffer.type, buffer);
    context.vertexAttribPointer(programAttrib, buffer.size, context.FLOAT, false, 0, 0);

    return buffer;
  },
  getBuff(bufferName) {
    let context = this.context,
        buffer = this.buffers[bufferName];

    if (!buffer) {
      throw `No such buffer: ${bufferName}`;
    }

    return buffer;
  },
  setTexture(textureName, texture) {
    if (this.textures[textureName]) {
      throw `Texture already exsists: ${textureName}`;
    }
    this.textures[textureName] = texture;
  },
  getTexture(textureName, samplerUniform) {
    let context = this.context,
        texture = this.textures[textureName];

    if (!texture) {
      throw `Texture not defined: ${textureName}`;
    }
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, texture.get());
    context.uniform1i(samplerUniform, 0);
  }
});

/* Scene
     -----
     */

const Scene = qbGl.Scene = function(selector, dontDepthTest) {
  let context,
      canvas = document.getElementById(selector);

  if (!canvas) {
    throw 'Canvas not found.';
  }

  try {
    context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch (e) {
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
};

extend(Scene, {
  get() {
    return this.context;
  },
  setProgram(program) {
    this.program = program;
  },
  setViewport(width, height) {
    this.width = width;
    this.height = height;
  },
  animate() {
    const context = this.context;

    context.viewport(0, 0, this.width, this.height);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
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
  },
  stop() {
    if (this._request) {
      window.cancelAnimationFrame(this._request);
      this._request = undefined;
    }
  },
  setMatrixUniforms() {
    this._setUniform('uPMatrix', this.pMatrix);
    this._setUniform('uMVMatrix', this.mMatrix);
  },
  _setUniform(uniform, matrix) {
    this.context.uniformMatrix4fv(this.program.getUniform(uniform), false, matrix.get());
  },
  render(context, modelViewMatrix, program) {
  }, // replace this with your own function
  update(timeSinceLastUpdate) {
  } // replace this with your own function
});

/* View */
const View = qbGl.View = function(selector) {
  this.el = document.querySelector(selector);
  this.currentKeys = {};
  this.el.onkeydown = function(event) {
    this.currentKeys[event.keyCode] = true;
  }.bind(this);
  this.el.onkeyup = function(event) {
    this.currentKeys[event.keyCode] = false;
  }.bind(this);

  this.el.onmousedown = function() {
    document.onmouseup = this.onmouseup.bind(this);
    document.onmousemove = this.onmousemove.bind(this);
  }.bind(this);
};

extend(View, {
  onmouseup() {
    document.onmousemove = null;
  },
  onmousemove() {
  }
});

export default qbGl;
