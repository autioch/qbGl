/* global vec3 */
function Light(webGlContext) {
  this.context = webGlContext;
}

Light.prototype = {
  get3f: function(programAttrib, red, green, blue) {
    this.context.uniform3f(programAttrib, red, green, blue);
  },
  get3fv: function(programAttrib, red, green, blue) {
    var adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, [red, green, blue]);
    vec3.scale(adjustedLD, adjustedLD, -1);
    this.context.uniform3fv(programAttrib, adjustedLD);
  }
};
