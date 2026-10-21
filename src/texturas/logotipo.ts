// Logotipo provisório desenhado em canvas: a palavra em Inter Tight 800, preta, com o ponto final azul.
// O corpo é calculado para a largura pedida, sem transformar o contexto (o espaçamento entre letras
// do canvas é medido em pixels e não acompanharia uma escala).
export function desenharLogotipo(texto: string, largura: number, familia: string): HTMLCanvasElement {
  const tela = document.createElement('canvas');
  const ctx = tela.getContext('2d')!;
  const aplicar = (corpo: number) => {
    ctx.font = `800 ${corpo}px ${familia}`;
    ctx.letterSpacing = `${-0.055 * corpo}px`;
    ctx.textBaseline = 'alphabetic';
  };
  const medir = (corpo: number) => {
    aplicar(corpo);
    return ctx.measureText(`${texto}.`).width;
  };
  const corpo = 400 * (largura / medir(400));
  tela.width = Math.ceil(largura);
  tela.height = Math.ceil(corpo * 0.86);
  aplicar(corpo);
  const larguraTexto = ctx.measureText(texto).width;
  ctx.fillStyle = '#121212';
  ctx.fillText(texto, 0, corpo * 0.8);
  ctx.fillStyle = '#002FA7';
  ctx.fillText('.', larguraTexto, corpo * 0.8);
  return tela;
}
