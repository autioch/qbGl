attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 uMVMatrix;
uniform mat4 u_worldViewProjection;
uniform mat3 u_worldInverseTranspose;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;
uniform vec3 uAmbientColor;

varying vec4 v_color;
varying vec3 v_lightWeighting;

void main() {
  gl_Position = u_worldViewProjection * uMVMatrix * a_position;

  vec3 transformedNormal = u_worldInverseTranspose * a_normal;
  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.01);
  // float directionalLightWeighting = dot(transformedNormal, uLightingDirection);

  v_lightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;

  v_color = a_color;
}
