attribute vec3 a_position;
uniform vec4 u_color;

varying vec4 v_color;

void main() {
  gl_Position = vec4(a_position, 2.0);
  v_color = u_color;
}
