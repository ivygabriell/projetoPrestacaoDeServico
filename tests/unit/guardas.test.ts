import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const arquivos = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });

const fontes = [...arquivos('app'), ...arquivos('src')].filter((p) => /\.(tsx?|css|svg)$/.test(p));
const texto = (p: string) => readFileSync(p, 'utf8');

const CORES = ['#F7F7F5', '#DCDCD8', '#787878', '#121212', '#002FA7', '#5B7BFF', '#FFFFFF'];

describe('guardas', () => {
  it('não leva nada da referência para o projeto (só o crédito "RayRay Lab" no conteúdo)', () => {
    for (const p of fontes) {
      const t = p.endsWith(join('conteudo', 'identidade.ts')) ? texto(p).replaceAll('RayRay Lab', '') : texto(p);
      expect(t, p).not.toMatch(/rayray|rayraylab|seoul|awwwards/i);
    }
  });

  it('nunca usa o preto esverdeado vetado', () => {
    for (const p of fontes) expect(texto(p).toLowerCase(), p).not.toContain('#121813');
  });

  it('não tem e-mail nem telefone no código', () => {
    for (const p of fontes) {
      expect(texto(p), p).not.toMatch(/[\w.+-]+@[\w-]+\.(com|br|net|org|io)\b/i);
      expect(texto(p), p).not.toMatch(/\+\d{2}[\s)(.-]*\d{2}[\s)(.-]*\d{4,5}[\s.-]*\d{4}/);
    }
  });

  it('usa só as cores da paleta no CSS e nos SVG', () => {
    for (const p of fontes.filter((f) => /\.(css|svg)$/.test(f))) {
      const achadas = texto(p).match(/#[0-9a-f]{6}\b/gi) ?? [];
      for (const cor of achadas) expect(CORES, `${p}: ${cor}`).toContain(cor.toUpperCase());
    }
  });
});
