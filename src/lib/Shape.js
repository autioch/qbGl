export default class Shape {
  constructor(webGlContext) {
    this.context = webGlContext;
    this.buffers = {};
    this.textures = {};
  }

  setBuffer(bufferName, definitionArray, type, count, size) {
    if (this.buffers[bufferName]) {
      throw `Buffer already exsists: ${bufferName}`;
    }

    const buffer = this.context.createBuffer();

    this.context.bindBuffer(type, buffer);
    this.context.bufferData(type, definitionArray, this.context.STATIC_DRAW);
    buffer.size = size;
    buffer.count = count;
    buffer.type = type;
    this.buffers[bufferName] = buffer;
  }

  getBuffer(bufferName, programAttrib) {
    const buffer = this.buffers[bufferName];

    if (!buffer) {
      throw `No such buffer: ${bufferName}`;
    }
    this.context.bindBuffer(buffer.type, buffer);
    this.context.vertexAttribPointer(programAttrib, buffer.size, this.context.FLOAT, false, 0, 0);

    return buffer;
  }

  getBuff(bufferName) {
    const buffer = this.buffers[bufferName];

    if (!buffer) {
      throw `No such buffer: ${bufferName}`;
    }

    return buffer;
  }

  setTexture(textureName, texture) {
    if (this.textures[textureName]) {
      throw `Texture already exsists: ${textureName}`;
    }
    this.textures[textureName] = texture;
  }

  getTexture(textureName, samplerUniform) {
    const { context } = this;
    const texture = this.textures[textureName];

    if (!texture) {
      throw `Texture not defined: ${textureName}`;
    }
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, texture.get());
    context.uniform1i(samplerUniform, 0);
  }
}
