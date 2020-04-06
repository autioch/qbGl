function parseContent(content) {
  if (Array.isArray(content)) {
    return new Float32Array(content);
  }

  return content;
}

export default class ArrayDataBuffer {
  constructor(context, options) {
    this.context = context;
    this.buffer = context.createBuffer();

    this.size = options.size;
    this.normalize = options.normalize || false;
    this.type = options.type || this.context.FLOAT;
    this.count = options.data ? options.data.length / this.size : 0;

    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    options.data && context.bufferData(context.ARRAY_BUFFER, parseContent(options.data), context.STATIC_DRAW);
  }

  fillBuffer(attributeLocation) {
    this.context.enableVertexAttribArray(attributeLocation);
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
    this.context.vertexAttribPointer(attributeLocation, this.size, this.type, this.normalize, 0, 0);
  }

  get() {
    return this.buffer;
  }
}
