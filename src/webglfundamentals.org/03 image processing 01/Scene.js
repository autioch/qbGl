import Lib from '../../lib';
import './leaves.jpg';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.textureLoader = new Lib.Texture(context, {
      url: 'leaves.jpg'
    });

    this.textcoordBuffer = context.createBuffer();

    context.bindBuffer(context.ARRAY_BUFFER, this.textcoordBuffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ]), context.STATIC_DRAW);

    return this.textureLoader.loadPromise;
  }

  ready({ context }) {
    this.positionBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, this.positionBuffer);

    const x1 = 0;
    const x2 = 0 + this.textureLoader.image.width;
    const y1 = 0;
    const y2 = 0 + this.textureLoader.image.height;

    context.bufferData(context.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]), context.STATIC_DRAW);

    this.texture = context.createTexture();
    context.bindTexture(context.TEXTURE_2D, this.texture);

    // Set the parameters so we can render any size image.
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);

    // Upload the image into the texture.
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.textureLoader.image);
  }

  render({ context, program, canvas }) {
    const a_position = program.locateAttribute('a_position');
    const a_texCoord = program.locateAttribute('a_texCoord');
    const u_resolution = program.locateUniform('u_resolution');

    // Turn on the position attribute
    context.enableVertexAttribArray(a_position);

    // Bind the position buffer.
    context.bindBuffer(context.ARRAY_BUFFER, this.positionBuffer);

    context.vertexAttribPointer(a_position, 2, context.FLOAT, false, 0, 0);

    // Turn on the teccord attribute
    context.enableVertexAttribArray(a_texCoord);

    // Bind the position buffer.
    context.bindBuffer(context.ARRAY_BUFFER, this.textcoordBuffer);

    context.vertexAttribPointer(a_texCoord, 2, context.FLOAT, false, 0, 0);

    // set the resolution
    context.uniform2f(u_resolution, canvas.width, canvas.height);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
