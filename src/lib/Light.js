/* global vec3 */
import './gl-matrix-min.js';

export default class Light {
  constructor(webGlContext) {
    this.context = webGlContext;
  }

  get3f(programAttrib, red, green, blue) {
    this.context.uniform3f(programAttrib, red, green, blue);
  }

  get3fv(programAttrib, red, green, blue) {
    const adjustedLD = vec3.create();

    vec3.normalize(adjustedLD, [red, green, blue]);
    vec3.scale(adjustedLD, adjustedLD, -1);
    this.context.uniform3fv(programAttrib, adjustedLD);
  }
}
