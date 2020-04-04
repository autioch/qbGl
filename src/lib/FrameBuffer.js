const STATUS_KEYS = [
  'FRAMEBUFFER_COMPLETE',
  'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
  'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
  'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
  'FRAMEBUFFER_UNSUPPORTED'
];

let nextId = 0;

export default class FrameBuffer {
  constructor(context, options = {}) {
    this.id = `frameBuffer${nextId++}`;
    this.context = context;
    this.frameBuffer = context.createFramebuffer();

    options.texture && this.attachTexture(options.texture);
  }

  attachTexture(texture) {
    this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.frameBuffer);
    this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, texture, 0);
  }

  getStatus() {
    const fbStatus = this.context.checkFramebufferStatus(this.context.FRAMEBUFFER);

    const statusMessage = STATUS_KEYS.find((key) => fbStatus === this.context[key]);

    return statusMessage || 'Unknown frameBuffer status: fbStatus';
  }
}
