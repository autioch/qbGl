import Lib from '../../lib';
import './leaves.jpg';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.textCoord = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]
    });

    this.texture = new Lib.Texture2(context, {
      url: 'leaves.jpg',
      MAG_FILTER: context.NEAREST,
      MIN_FILTER: context.NEAREST,
      WRAP_S: context.CLAMP_TO_EDGE,
      WRAP_T: context.CLAMP_TO_EDGE
    });

    return this.texture.readyPromise;
  }

  ready({ context }) {
    const { x1, x2, y1, y2 } = this.texture;

    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]
    });
  }

  render({ context, program, canvas }) {
    this.position.fillBuffer(program.locateAttribute('a_position'));
    this.textCoord.fillBuffer(program.locateAttribute('a_texCoord'));
    context.uniform2f(program.locateUniform('u_resolution'), canvas.width, canvas.height);
    context.uniform2f(program.locateUniform('u_textureSize'), this.texture.image.width, this.texture.image.height);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }
}
