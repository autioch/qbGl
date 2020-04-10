export default class Program {
  constructor(context) {
    this.context = context;
    this.program = context.createProgram();
    this.attributes = {};
    this.uniforms = {};
    this.attributesToSet = [];
    this.uniformsToSet = [];
  }

  setShaderFromConfig(config, type) {
    const { source, uniforms = [], attributes = [] } = config;

    const shader = this.context.createShader(type);

    this.context.shaderSource(shader, source);
    this.context.compileShader(shader);
    this.context.attachShader(this.program, shader);

    this.uniformsToSet.push(...uniforms);
    this.attributesToSet.push(...attributes);
  }

  use() {
    this.context.linkProgram(this.program);

    if (!this.context.getProgramParameter(this.program, this.context.LINK_STATUS)) {
      throw 'Shader program error.';
    }

    this.context.useProgram(this.program);

    this.attributesToSet.forEach((attributeName) => {
      if (this.attributes[attributeName]) {
        throw `Attrib already exsists: ${attributeName}`;
      }
      const attrib = this.context.getAttribLocation(this.program, attributeName);

      if (attrib === undefined) {
        throw `No location for attrib: ${attributeName}`;
      }
      this.attributes[attributeName] = attrib;
      this.context.enableVertexAttribArray(attrib); // todo is this needed?
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

  locateUniform(uniformName) {
    const uniform = this.uniforms[uniformName];

    if (uniform === undefined) {
      throw `Undefined uniform: ${uniformName}`;
    }

    return uniform;
  }

  locateAttribute(attributeName) {
    const attribute = this.attributes[attributeName];

    if (attribute === undefined) {
      throw `Undefined attribute: ${attributeName}`;
    }

    return attribute;
  }
}
