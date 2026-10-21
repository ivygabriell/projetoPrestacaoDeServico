import { familiasDaPagina } from './cartazes';

// Folha branca com a lista numerada das decisões, tracejada em cima e embaixo. Vira a textura do lençol.
export function desenharFolha(itens: readonly string[], largura: number): HTMLCanvasElement {
  const tela = document.createElement('canvas');
  const f = familiasDaPagina();
  const corpo = largura * 0.0617; // 3,7vw numa folha de 60vw
  const entrelinha = corpo * 1.19;
  const margem = largura * 0.07;
  tela.width = Math.round(largura);
  tela.height = Math.round(margem * 2 + corpo * 1.4 + itens.length * entrelinha + corpo * 0.6);
  const ctx = tela.getContext('2d');
  if (!ctx) return tela;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, tela.width, tela.height);

  const tracejado = (y: number) => {
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = Math.max(2, largura * 0.0015);
    ctx.setLineDash([largura * 0.006, largura * 0.006]);
    ctx.beginPath();
    ctx.moveTo(margem, y);
    ctx.lineTo(tela.width - margem, y);
    ctx.stroke();
  };
  tracejado(margem * 0.8);
  tracejado(tela.height - margem * 0.8);

  ctx.fillStyle = '#121212';
  ctx.textBaseline = 'alphabetic';
  itens.forEach((item, i) => {
    const y = margem + corpo * 1.4 + i * entrelinha;
    ctx.font = `500 ${corpo}px ${f.sans}`;
    ctx.letterSpacing = `${-0.02 * corpo}px`;
    ctx.fillText(item.toUpperCase(), margem, y);
    const fim = ctx.measureText(item.toUpperCase()).width;
    ctx.font = `400 ${corpo * 0.25}px ${f.sans}`;
    ctx.letterSpacing = '0px';
    ctx.fillText(`(${i + 1})`, margem + fim + corpo * 0.15, y - corpo * 0.62);
  });
  return tela;
}
