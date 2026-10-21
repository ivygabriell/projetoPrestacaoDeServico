import { logotipo } from '@/conteudo/identidade';

// O "filme" da abertura, desenhado à mão em canvas (300×158): faixas de ruído em tons de cinza
// e o logotipo cortado em linhas que deslizam, como uma fita sendo sintonizada.
export function desenharFilme(ctx: CanvasRenderingContext2D, t: number) {
  const { width: l, height: a } = ctx.canvas;
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, l, a);

  for (let y = 0; y < a; y += 3) {
    const v = 40 + 60 * (0.5 + 0.5 * Math.sin(y * 0.21 + t * 3.1)) * (0.6 + 0.4 * Math.sin(t * 1.7 + y * 0.03));
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, l, 2);
  }

  ctx.font = `800 ${Math.round(a * 0.3)}px ${getComputedStyle(document.body).getPropertyValue('--sans') || 'sans-serif'}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const faixa = 6;
  for (let y = 0; y < a; y += faixa) {
    const desvio = Math.sin(y * 0.7 + t * 9) * 14 * Math.max(0, Math.sin(t * 1.3));
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, l, faixa);
    ctx.clip();
    ctx.fillStyle = '#F7F7F5';
    ctx.fillText(logotipo, l / 2 + desvio, a / 2);
    ctx.restore();
  }
}
