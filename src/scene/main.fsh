precision mediump float;

varying vec3 v_lightWeighting;
varying vec4 v_color;

void main() {

  gl_FragColor = vec4(v_color.rgb * v_lightWeighting, v_color.a);
}
