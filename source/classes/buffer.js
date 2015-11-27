/**
 * @param {object} options
 *    @param {array} data
 *    @param {integer} bufferType
 *    @param {integer} dataType
 *    @param {integer} dataSize
 */
function Buffer(context, options) {

  var buffer = context.createBuffer();
  var bufferType = options.bufferType || context.ARRAY_BUFFER;
  var dataSize = options.dataSize || 3;
  var dataType = options.dataType || context.FLOAT;
  var data = options.data;

  function bind(programAttribute) {
    context.bindBuffer(bufferType, buffer);
    context.vertexAttribPointer(programAttribute, dataSize, dataType, false, 0, 0);
    context.enableVertexAttribArray(programAttribute);
  }

  context.bindBuffer(bufferType, buffer);
  context.bufferData(bufferType, data, context.STATIC_DRAW);

  buffer.count = data.length / dataSize;
  buffer.bind = bind;

  return buffer;
}
