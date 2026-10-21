import { ruido } from './comum';

// Varredura de baixo para cima com borda orgânica: o escuro sobe pela tela quando uProgresso vai de 1 a 0.
export const passagemFrag = /* glsl */ `
uniform float uTempo;
uniform float uProgresso;
uniform vec3 uCor;
varying vec2 vUv;
${ruido}

void main() {
  float borda = (ruido3(vec3(vUv.x * 6.0, vUv.y * 3.0, uTempo)) - 0.5) * 0.4;
  float alfa = smoothstep(0.0, 1.0, (1.0 - vUv.y) + borda + (1.0 - 3.0 * uProgresso));
  gl_FragColor = vec4(uCor, alfa);
  #include <colorspace_fragment>
}
`;
