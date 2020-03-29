const shaderTypes = {
  'x-shader/x-fragment': 'FRAGMENT_SHADER',
  'x-shader/x-vertex': 'VERTEX_SHADER'
};

function parseAttribute(attributeText = '') {
  if (!attributeText || !attributeText.length) {
    return [];
  }

  return attributeText.split(',');
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

export default class Program {
  constructor(context) {
    this.context = context;
    this.program = context.createProgram();
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

    this.context.attachShader(this.program, Shader);

    this.uniformsToSet.push(...parseAttribute(shaderScript.getAttribute(`data-uniforms`)));
    this.attribsToSet.push(...parseAttribute(shaderScript.getAttribute(`data-attribs`)));
  }

  setShaderFromConfig(config, type) {
    const { source, uniforms = [], attributes = [] } = config;

    const Shader = this.context.createShader(type);

    this.context.shaderSource(Shader, source);
    this.context.compileShader(Shader);
    this.context.attachShader(this.program, Shader);

    this.uniformsToSet.push(...uniforms);
    this.attribsToSet.push(...attributes);
  }

  use() {
    this.context.linkProgram(this.program);

    if (!this.context.getProgramParameter(this.program, this.context.LINK_STATUS)) {
      throw 'Shader program error.';
    }

    this.context.useProgram(this.program);

    this.attribsToSet.forEach((attributeName) => {
      if (this.attribs[attributeName]) {
        throw `Attrib already exsists: ${attributeName}`;
      }
      const attrib = this.context.getAttribLocation(this.program, attributeName);

      if (attrib === undefined) {
        throw `No location for attrib: ${attributeName}`;
      }
      this.attribs[attributeName] = attrib;
      this.context.enableVertexAttribArray(attrib);
    });

    this.uniformsToSet.forEach((uniformName) => {
      if (this.uniforms[uniformName]) {
        throw `Uniform already exsists: ${uniformName}`;
      }
      const uniform = this.context.getUniformLocation(this.program, uniformName);

      if (uniform === undefined) {
        throw `No location for uniform: ${uniformName}`;
      }
      this.uniforms[uniformName] = uniform;
    });

    return this;
  }

  getUniform(uniformName) {
    const uniform = this.uniforms[uniformName];

    if (uniform === undefined) {
      throw `Undefined uniform: ${uniformName}`;
    }

    return uniform;
  }

  getAttrib(attributeName) {
    const attribute = this.attribs[attributeName];

    if (attribute === undefined) {
      throw `Undefined attribute: ${attributeName}`;
    }

    return attribute;
  }
}
