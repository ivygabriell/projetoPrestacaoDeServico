import { ruido } from './comum';

// Cartaz que nasce em ASCII: cada célula de 15px vira um glifo 5×5 escolhido pelo brilho (mais ruído),
// sobre o fundo escuro; uma varredura de baixo para cima troca o ASCII pela imagem.
// Glifos desenhados para este projeto, em ordem de densidade: . : + = o x % e um xadrez (bits de 5×5, linha a linha).
export const asciiFrag = /* glsl */ `
layout(location = 0) out highp vec4 saida;
#define gl_FragColor saida
uniform sampler2D uImagem;
uniform float uProgresso;
uniform float uHover;
uniform float uTempo;
uniform float uPixelRatio;
uniform vec3 uFundo;
varying vec2 vUv;
${ruido}

// Exige GLSL3 (operações com inteiros): 25 bits não cabem exatos num float.
float glifo(int n, vec2 p) {
  // p em [0,5) dentro da célula; fora disso é espaço entre caracteres
  if (p.x < 0.0 || p.y < 0.0 || p.x >= 5.0 || p.y >= 5.0) return 0.0;
  int i = int(floor(p.x)) + 5 * int(floor(p.y));
  return float((n >> i) & 1);
}

void main() {
  float zoom = 1.0 / (1.0 + uHover * 0.1);
  vec2 uv = (vUv - 0.5) * zoom + 0.5;
  vec3 imagem = texture2D(uImagem, uv).rgb;

  vec2 pix = gl_FragCoord.xy / uPixelRatio;
  vec2 celula = floor(pix / 15.0);
  vec2 dentro = fract(pix / 15.0) * 6.0 - 0.5;
  vec3 media = texture2D(uImagem, uv).rgb;
  float brilho = dot(media, vec3(0.3, 0.59, 0.11)) + (ruido3(vec3(celula * 0.35, uTempo * 0.5)) - 0.5) * 0.5;

  int n = 4;                             // .
  if (brilho > 0.2) n = 131200;        // :
  if (brilho > 0.3) n = 145536;        // +
  if (brilho > 0.4) n = 459200;        // =
  if (brilho > 0.5) n = 469440;        // o
  if (brilho > 0.6) n = 18157905;      // x
  if (brilho > 0.7) n = 20288345;      // %
  if (brilho > 0.8) n = 22369621;          // xadrez
  vec3 ascii = uFundo + media * glifo(n, dentro);

  float linha = vUv.y + (hash21(celula) - 0.5) * 0.08;
  float revela = smoothstep(linha - 0.05, linha + 0.05, uProgresso * 1.25 - 0.1);
  vec3 cor = mix(ascii, imagem, revela);
  cor = mix(cor, cor * 0.7, uHover);
  gl_FragColor = vec4(cor, 1.0);
  #include <colorspace_fragment>
}
`;
