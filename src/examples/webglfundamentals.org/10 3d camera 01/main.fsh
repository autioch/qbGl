precision mediump float;

varying vec4 v_color; // Passed in from the vertex shader.

void main() {
   gl_FragColor = v_color;
}
