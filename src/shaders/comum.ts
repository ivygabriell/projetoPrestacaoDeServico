// Pedaços de GLSL compartilhados, escritos para este projeto.

// Ruído de valor 2D e 3D (barato, suficiente para bordas orgânicas e ondulações).
export const ruido = /* glsl */ `
float hash21(vec2 p) { return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453); }
float hash31(vec3 p) { return fract(sin(dot(p, vec3(17.13, 71.97, 113.31))) * 43758.5453); }
float ruido2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float ruido3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(hash31(i), hash31(i + vec3(1, 0, 0)), u.x), mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), u.x), u.y);
  float b = mix(mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), u.x), mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), u.x), u.y);
  return mix(a, b, u.z);
}
`;

export const vertUv = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
