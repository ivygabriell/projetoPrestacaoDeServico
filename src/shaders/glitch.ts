// Logotipo que chega "fora de sintonia": cada linha horizontal sai do lugar e borra na horizontal,
// e as duas coisas caem a zero conforme uProgresso vai de 0 a 1.
export const glitchFrag = /* glsl */ `
uniform sampler2D uLogo;
uniform float uProgresso;
varying vec2 vUv;

float sorteio(float linha) { return fract(sin(linha * 91.7) * 47453.3); }

void main() {
  float falta = 1.0 - uProgresso;
  float linha = floor(vUv.y * 90.0);
  vec2 uv = vUv;
  uv.x += (sorteio(linha) - 0.5) * 0.12 * falta; // até 6% para cada lado
  vec4 cor = vec4(0.0);
  for (int i = -3; i <= 3; i++) cor += texture2D(uLogo, uv + vec2(float(i) * 0.008 * falta, 0.0));
  cor /= 7.0;
  gl_FragColor = vec4(cor.rgb, cor.a * uProgresso);
  #include <colorspace_fragment>
}
`;
