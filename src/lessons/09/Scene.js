import Lib from '../../lib';
import Star from './Star';
import { vertices, textures } from './consts';
import './star.gif';

export default class extends Lib.Scene {
  initialize({ context, el }) {
    this.zoom = -15;
    this.tilt = 90;
    this.spin = 0;
    this.shapes = [];
    this.effectiveFPMS = 60 / 1000;

    this.bufferStash = new Lib.Shape(context);

    this.bufferStash.setBuffer('vertices', new Float32Array(vertices), context.ARRAY_BUFFER, 4, 3);
    this.bufferStash.setBuffer('textures', new Float32Array(textures), context.ARRAY_BUFFER, 4, 2);
    this.bufferStash.setTexture('star', new Lib.Texture(context, {
      url: 'star.gif',
      magFilter: context.LINEAR,
      minFilter: context.LINEAR
    }));

    const shapeCount = 50;

    for (let i = 0; i < shapeCount; i++) {
      this.shapes.push(new Star((i / shapeCount) * 5.0, i / shapeCount));
    }

    this.keyboard = Lib.keyboard({
      selector: el
    });
  }

  render({ context, program, mMatrix, setMatrixUniforms }) {
    context.blendFunc(context.SRC_ALPHA, context.ONE);
    context.enable(context.BLEND);

    mMatrix
      .translate([0.0, 0.0, this.zoom])
      .rotate(this.tilt, [1, 0, 0]);

    const twinkle = document.getElementById('twinkle').checked;

    this.shapes.forEach((shape) => {
      shape.render(context, mMatrix, program, this.tilt, this.spin, twinkle, setMatrixUniforms, this.bufferStash);
      this.spin += 0.1;
    });
  }

  update(timeSinceLastUpdate) {
    const change = timeSinceLastUpdate * this.effectiveFPMS;

    this.shapes.forEach((shape) => shape.update(change));
    this.handleKeys();
  }

  handleKeys() {
    if (this.keyboard[33]) { // Page Up
      this.zoom -= 0.1;
    }
    if (this.keyboard[34]) { // Page Down
      this.zoom += 0.1;
    }
    if (this.keyboard[38]) { // Up cursor key
      this.tilt += 2;
    }
    if (this.keyboard[40]) { // Down cursor key
      this.tilt -= 2;
    }
  }
}
