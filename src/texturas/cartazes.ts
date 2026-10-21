import { paleta, type TipoCartaz } from '@/conteudo/identidade';
import { razaoContraste } from '@/lib/contraste';

// Cartazes dos capítulos, desenhados em canvas com a própria identidade (cores, fontes e medidas reais).
// São a "imagem do projeto" de cada cartão: a cena WebGL os revela a partir do ASCII.

type Familias = { sans: string; mono: string; serif: string };

const CLARO = '#F7F7F5';
const ESCURO = '#121212';
const AZUL = '#002FA7';

export const familiasDaPagina = (): Familias => {
  const css = getComputedStyle(document.documentElement);
  return {
    sans: css.getPropertyValue('--sans') || 'sans-serif',
    mono: css.getPropertyValue('--mono') || 'monospace',
    serif: css.getPropertyValue('--serif') || 'serif',
  };
};

export function desenharCartaz(tipo: TipoCartaz, l: number, a: number, f: Familias = familiasDaPagina()): HTMLCanvasElement {
  const tela = document.createElement('canvas');
  tela.width = l;
  tela.height = a;
  const ctx = tela.getContext('2d');
  if (!ctx) return tela;
  const u = l / 100; // 1% da largura
  const texto = (t: string, x: number, y: number, fonte: string, cor: string, alinhar: CanvasTextAlign = 'left') => {
    ctx.font = fonte;
    ctx.fillStyle = cor;
    ctx.textAlign = alinhar;
    ctx.fillText(t, x, y);
  };
  const mono = (px: number) => `400 ${px}px ${f.mono}`;

  switch (tipo) {
    case 'paleta': {
      const alturas = [0.3, 0.12, 0.12, 0.38, 0.08];
      let y = 0;
      paleta.forEach((c, i) => {
        const h = alturas[i] * a;
        ctx.fillStyle = c.hex;
        ctx.fillRect(0, y, l, h);
        const tinta = i >= 2 ? CLARO : ESCURO;
        texto(c.hex, 5 * u, y + 7 * u, mono(4.2 * u), tinta);
        texto(c.nome.toUpperCase(), 95 * u, y + 7 * u, mono(3.2 * u), tinta, 'right');
        y += h;
      });
      break;
    }
    case 'azul': {
      ctx.fillStyle = AZUL;
      ctx.fillRect(0, 0, l, a);
      texto('#002FA7', 5 * u, 0.52 * a, `800 ${17 * u}px ${f.sans}`, CLARO);
      texto('AZUL PROFUNDO', 5 * u, 0.52 * a + 9 * u, mono(4 * u), CLARO);
      ctx.fillStyle = CLARO;
      ctx.beginPath();
      ctx.arc(88 * u, 12 * u, 3 * u, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'sans': {
      ctx.fillStyle = CLARO;
      ctx.fillRect(0, 0, l, a);
      ctx.letterSpacing = `${-3 * u}px`;
      texto('Aa', 50 * u, 0.58 * a, `800 ${62 * u}px ${f.sans}`, ESCURO, 'center');
      ctx.letterSpacing = '0px';
      break;
    }
    case 'mono': {
      ctx.fillStyle = ESCURO;
      ctx.fillRect(0, 0, l, a);
      texto('● REC ter13:07:05', 5 * u, 0.3 * a, mono(5 * u), CLARO);
      ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', '0123456789', '(01) (02) (03)'].forEach((linha, i) => texto(linha, 5 * u, 0.45 * a + i * 9 * u, mono(6.4 * u), CLARO));
      break;
    }
    case 'serif': {
      ctx.fillStyle = CLARO;
      ctx.fillRect(0, 0, l, a);
      texto('Instrument', 50 * u, 0.45 * a, `italic 400 ${21 * u}px ${f.serif}`, ESCURO, 'center');
      texto('Serif', 50 * u, 0.45 * a + 20 * u, `italic 400 ${21 * u}px ${f.serif}`, ESCURO, 'center');
      break;
    }
    case 'movimento': {
      ctx.fillStyle = ESCURO;
      ctx.fillRect(0, 0, l, a);
      ctx.filter = `blur(${2.5 * u}px)`;
      ctx.fillStyle = CLARO;
      ctx.beginPath();
      ctx.roundRect(15 * u, 0.3 * a, 70 * u, 40 * u, 12 * u);
      ctx.fill();
      ctx.fillStyle = '#787878';
      ctx.beginPath();
      ctx.arc(70 * u, 0.62 * a, 14 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = 'none';
      for (let y = 0; y < a; y += 1.4 * u) {
        ctx.fillStyle = 'rgba(18, 18, 18, 0.35)';
        ctx.fillRect(0, y, l, 0.5 * u);
      }
      break;
    }
    case 'contraste': {
      ctx.fillStyle = CLARO;
      ctx.fillRect(0, 0, l, a / 2);
      ctx.fillStyle = ESCURO;
      ctx.fillRect(0, a / 2, l, a / 2);
      const r = (x: string, y: string) => `${razaoContraste(x, y).toFixed(2).replace('.', ',')}:1`;
      texto(r(ESCURO, CLARO), 5 * u, 0.34 * a, `800 ${15 * u}px ${f.sans}`, ESCURO);
      texto('PRETO SOBRE CLARO', 5 * u, 0.34 * a + 8 * u, mono(3.4 * u), ESCURO);
      texto(r('#5B7BFF', ESCURO), 5 * u, 0.72 * a, `800 ${15 * u}px ${f.sans}`, '#5B7BFF');
      texto('AZUL NO ESCURO · PROPOSTA', 5 * u, 0.72 * a + 8 * u, mono(3.4 * u), CLARO);
      break;
    }
  }
  return tela;
}
