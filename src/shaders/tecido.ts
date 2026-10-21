// A folha ondula como tecido: a borda de baixo balança mais, a de cima fica presa.
export const tecidoVert = /* glsl */ `
uniform float uTempo;
varying vec2 vUv;
#define PI 3.14159265359
void main() {
  vUv = uv;
  vec3 p = position;
  float onda = sin(p.y * 1.2 * PI + uTempo * 3.0) * 18.0 + cos(p.x * 1.8 * PI + uTempo * 2.0) * 24.0;
  float solto = 1.0 - smoothstep(0.1, 0.98, uv.y);
  p.z += onda * solto;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const tecidoFrag = /* glsl */ `
uniform sampler2D uFolha;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(texture2D(uFolha, vUv).rgb, 1.0);
  #include <colorspace_fragment>
}
`;
