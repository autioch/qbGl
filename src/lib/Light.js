import { vec3 } from 'gl-matrix';

export default class Light {
  constructor(context) {
    this.context = context;
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
