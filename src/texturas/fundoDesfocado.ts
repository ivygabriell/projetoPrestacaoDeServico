// Fundo da face lateral do cubo: manchas em tons de cinza bem desfocadas, com um toque do azul da marca.
export function desenharFundoDesfocado(largura: number, altura: number): string {
  const tela = document.createElement('canvas');
  tela.width = largura;
  tela.height = altura;
  const ctx = tela.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, largura, altura);
  ctx.filter = `blur(${Math.round(largura * 0.06)}px)`;
  const manchas: [number, number, number, string][] = [
    [0.3, 0.45, 0.32, '#DCDCD8'],
    [0.62, 0.38, 0.22, '#787878'],
    [0.72, 0.7, 0.18, '#F7F7F5'],
    [0.45, 0.8, 0.14, '#002FA7'],
  ];
  for (const [x, y, r, cor] of manchas) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.ellipse(x * largura, y * altura, r * largura, r * altura * 1.4, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  return tela.toDataURL('image/jpeg', 0.85);
}
