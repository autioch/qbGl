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

    this.id = options.id;
    this.size = options.size;
    this.normalize = options.normalize || false;
    this.type = options.type || this.context.FLOAT;
    this.count = options.data ? options.data.length / this.size : 0;
    this.target = options.target || context.ARRAY_BUFFER; // in webgl1 it can be also context.ELEMENT_ARRAY_BUFFER

    context.bindBuffer(this.target, this.buffer);
    this.data = options.data; // for debug()
    options.data && context.bufferData(this.target, parseContent(options.data), context.STATIC_DRAW);
  }

  fillBuffer(attributeLocation) {
    this.context.enableVertexAttribArray(attributeLocation);
    this.context.bindBuffer(this.target, this.buffer);

    // bind buffer bound to gl.ARRAY_BUFFER to the attribute and specify the layout
    this.context.vertexAttribPointer(attributeLocation, this.size, this.type, this.normalize, 0, 0);
  }

  debug() {
    if (!this.data) {
      console.warn('Data not set for this buffer');
    }
    const arr = [];

    for (let i = 0; i < this.data.length; i = i + this.size) {
      arr.push(this.data.slice(i, i + this.size));
    }

    return arr;
  }

  get() {
    return this.buffer;
  }
}
