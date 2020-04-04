import Lib from '../../lib';
import { positions } from './consts';

export default class extends Lib.Scene {
  initialize({ context }) {
    this.position = new Lib.ArrayDataBuffer(context, {
      size: 2,
      data: positions
    });
  }

  render({ context, program }) {
    this.position.fillBuffer(program.locateAttribute('a_position'));

    context.drawArrays(context.TRIANGLES, 0, this.position.count);
  }
}
