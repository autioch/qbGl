const shaderTypes = {
  'x-shader/x-fragment': 'FRAGMENT_SHADER',
  'x-shader/x-vertex': 'VERTEX_SHADER'
};

function cacheScriptAttributes(scriptEl, scriptAttribute, arrayCache) {
  const value = scriptEl.getAttribute(`data-${scriptAttribute}`);

  if (value && value.length) {
    value.split(',').forEach((attribName) => {
      arrayCache.push(attribName);
    });
  }
}

export default class Program {
  constructor(webGlContext) {
    this.context = webGlContext;
    this.program = webGlContext.createProgram();
    this.attribs = {};
    this.uniforms = {};
    this.attribsToSet = [];
    this.uniformsToSet = [];
  }

  setShader(shaderId) {
    const shaderScript = document.getElementById(shaderId);

    if (!shaderScript) {
      throw Error('Shader script not found.');
    }

    const shaderType = this.context[shaderTypes[shaderScript.type]];

    if (!shaderType) {
      throw `Invalid shader type.${shaderScript.type}`;
    }
    const Shader = this.context.createShader(shaderType);

    this.context.shaderSource(Shader, shaderScript.textContent);
    this.context.compileShader(Shader);
    if (!this.context.getShaderParameter(Shader, this.context.COMPILE_STATUS)) {
      throw `Shader compile error.${this.context.getShaderInfoLog(Shader)}`;
    }
    this.context.attachShader(this.program, Shader);

    cacheScriptAttributes(shaderScript, 'uniforms', this.uniformsToSet);
    cacheScriptAttributes(shaderScript, 'attribs', this.attribsToSet);
  }

  /* maybe move this to Scene? */
  use() {
    this.context.linkProgram(this.program);
    if (!this.context.getProgramParameter(this.program, this.context.LINK_STATUS)) {
      throw 'Shader program error.';
    }
    this.context.useProgram(this.program);
    this.attribsToSet.forEach(this.setAttrib.bind(this));
    this.uniformsToSet.forEach(this.setUniform.bind(this));

    return this;
  }

  setUniform(uniformName) {
    if (this.uniforms[uniformName]) {
      throw `Uniform already exsists: ${uniformName}`;
    }
    const uniform = this.context.getUniformLocation(this.program, uniformName);

    if (uniform === undefined) {
      throw `No location for uniform: ${uniformName}`;
    }
    this.uniforms[uniformName] = uniform;
  }
  getUniform(uniformName) {
    const uniform = this.uniforms[uniformName];

    if (uniform === undefined) {
      throw `Undefined uniform: ${uniformName}`;
    }

    return uniform;
  }
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
  }
  getAttrib(attribName) {
    const attrib = this.attribs[attribName];

    if (attrib === undefined) {
      throw `Undefined attrib: ${attribName}`;
    }

    return attrib;
  }
}
