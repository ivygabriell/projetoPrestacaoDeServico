import { ruido } from './comum';

// Vidro fosco: amostra a cena desenhada sem o vidro (uFundo) na posição da tela, desviada pela normal,
// com linhas que ondulam no tempo, borrão direcional (que o mouse empurra) e brilho nas bordas.
export const refracaoVert = /* glsl */ `
varying vec3 vNormal;
varying vec3 vVisao;
void main() {
  vec4 mundo = modelMatrix * vec4(position, 1.0);
  vVisao = normalize(mundo.xyz - cameraPosition);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * mundo;
}
`;

export const refracaoFrag = /* glsl */ `
uniform sampler2D uFundo;
uniform vec2 uResolucao;
uniform vec3 uClaro;
uniform float uTempo;
uniform vec2 uBorrao;
uniform float uOpacidade;
uniform float uForca;
varying vec3 vNormal;
varying vec3 vVisao;
${ruido}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolucao;
  uv += vNormal.xy * 0.04 * uForca;
  uv.x += sin(uv.y * 70.0 + uTempo * 0.8) * 0.006 * (ruido2(vec2(uv.y * 40.0, uTempo * 0.6)) - 0.3);

  float onda = ruido2(uv * vec2(5.0, 10.0) + uTempo * 0.3) - 0.5;
  vec2 direcao = vec2(7.0 + uBorrao.x + onda * 14.0, uBorrao.y) / uResolucao;
  vec4 soma = vec4(0.0);
  for (int i = -4; i <= 4; i++) soma += texture2D(uFundo, uv + direcao * float(i));
  soma /= 9.0;
  vec3 base = soma.rgb + uClaro * (1.0 - soma.a); // o fundo transparente do alvo é o claro da página

  float fresnel = pow(1.0 - abs(dot(vVisao, vNormal)), 3.0);
  vec3 luz = normalize(vec3(0.0, 1.0, 1.2));
  float brilho = pow(max(dot(reflect(-luz, vNormal), -vVisao), 0.0), 24.0);

  vec3 vidro = mix(base, vec3(1.0), 0.18) - fresnel * 0.22 + brilho * 0.35;
  gl_FragColor = vec4(vidro, uOpacidade * (0.9 + fresnel * 0.1));
}
`;
