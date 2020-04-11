export default class Program {
  constructor(context) {
    this.context = context;
    this.program = context.createProgram();
    this.attributes = {};
    this.uniforms = {};
  }

  setShaderFromConfig(config, type) {
    const shader = this.context.createShader(type);

    this.context.shaderSource(shader, typeof config === 'string' ? config : config.source);
    this.context.compileShader(shader);

    const message = this.context.getShaderInfoLog(shader);

    if (message.length) {
      console.log('shader info log', message);
    }

    this.context.attachShader(this.program, shader);
  }

  use() {
    this.context.linkProgram(this.program);
    this.context.validateProgram(this.program);

    if (!this.context.getProgramParameter(this.program, this.context.VALIDATE_STATUS)) {
      throw 'Program validation failed.';
    }
    const message = this.context.getProgramInfoLog(this.program);

    if (message.length) {
      console.log('shader info log', message);
    }
    if (!this.context.getProgramParameter(this.program, this.context.LINK_STATUS)) {
      throw 'Shader program error.';
    }

    this.context.useProgram(this.program);

    this.detectAttributesAndUniforms();
  }

  detectAttributesAndUniforms() {
    const attributeCount = this.context.getProgramParameter(this.program, this.context.ACTIVE_ATTRIBUTES);

    for (let index = 0; index < attributeCount; ++index) {
      const info = this.context.getActiveAttrib(this.program, index);

      // console.log('name:', info.name, 'type:', info.type, 'size:', info.size);
      const attribute = this.context.getAttribLocation(this.program, info.name);

      if (attribute === -1) {
        throw Error(`No location for attrib: ${info.name}`);
      }
      this.attributes[info.name] = attribute;
      this.context.enableVertexAttribArray(attribute); // todo is this needed?
    }

    const uniformCount = this.context.getProgramParameter(this.program, this.context.ACTIVE_UNIFORMS);

    for (let index = 0; index < uniformCount; ++index) {
      const info = this.context.getActiveUniform(this.program, index);

      // console.log('name:', info.name, 'type:', info.type, 'size:', info.size);
      const uniform = this.context.getUniformLocation(this.program, info.name);

      if (uniform === -1) {
        throw Error(`No location for uniform: ${info.name}`);
      }
      this.uniforms[info.name] = uniform;
    }
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
