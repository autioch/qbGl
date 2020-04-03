export default class ArrayDataBuffer {
  constructor(context, options) {
    this.context = context;
    this.buffer = context.createBuffer();

    this.size = options.size;
    this.type = options.type || this.context.FLOAT;

    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    options.data && context.bufferData(context.ARRAY_BUFFER, new Float32Array(options.data), context.STATIC_DRAW);
  }

  fillBuffer(attributeLocation) {
    this.context.enableVertexAttribArray(attributeLocation);
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
    this.context.vertexAttribPointer(attributeLocation, this.size, this.type, false, 0, 0);
  }

  get() {
    return this.buffer;
  }
}
