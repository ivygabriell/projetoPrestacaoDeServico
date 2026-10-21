import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const PASTA = 'redes-sociais';
const MODELOS = ['carrossel-manifesto', 'carrossel-educativo', 'posts', 'stories', 'perfil'];
const CORES = ['#F7F7F5', '#DCDCD8', '#787878', '#121212', '#002FA7', '#5B7BFF', '#FFFFFF'];
const FAMILIAS = ['Inter Tight', 'Azeret Mono', 'Instrument Serif'];
const FORMATOS = ['retrato', 'quadrado', 'story', 'linkedin'];

const arquivos = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (n === 'exportados') return [];
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });

const texto = (p: string) => readFileSync(p, 'utf8');
const existe = existsSync(PASTA);
const fontes = existe ? arquivos(PASTA).filter((p) => /\.(html|css|js|mjs|md)$/.test(p)) : [];
const estilos = fontes.filter((p) => /\.(html|css|js)$/.test(p));
const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
const modelo = (nome: string) => new DOMParser().parseFromString(texto(join(PASTA, 'modelos', `${nome}.html`)), 'text/html');

describe('identidade das redes sociais', () => {
  it('tem o guia, o manual, a base, os modelos e o script de exportação', () => {
    for (const p of ['README.md', 'manual.html', 'modelos/base.css', 'modelos/pecas.js', 'scripts/exportar.mjs', ...MODELOS.map((m) => `modelos/${m}.html`)])
      expect(existsSync(join(PASTA, p)), p).toBe(true);
  });

  it('usa só as cores da paleta', () => {
    expect(estilos.length).toBeGreaterThan(0);
    for (const p of estilos) {
      const t = texto(p);
      for (const cor of t.match(/#[0-9a-f]{6}\b/gi) ?? []) expect(CORES, `${p}: ${cor}`).toContain(cor.toUpperCase());
      expect(t, `${p}: hexadecimal curto`).not.toMatch(/#[0-9a-f]{3}\b(?![0-9a-f])/i);
      for (const [, r, g, b] of t.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/g)) expect(CORES, `${p}: rgb(${r}, ${g}, ${b})`).toContain(hex(+r, +g, +b));
      expect(t, p).not.toMatch(/hsla?\(/);
    }
  });

  it('nunca usa o preto esverdeado vetado', () => {
    for (const p of fontes) expect(texto(p).toLowerCase(), p).not.toContain('#121813');
  });

  it('usa só as três famílias da marca', () => {
    for (const p of estilos) {
      for (const [, valor] of texto(p).matchAll(/font-family:\s*([^;"}]+)/g))
        for (const f of valor.split(',').map((s) => s.trim().replace(/['"]/g, '')))
          if (!f.startsWith('var(') && !['system-ui', 'sans-serif', 'serif', 'monospace'].includes(f)) expect(FAMILIAS, `${p}: ${f}`).toContain(f);
      for (const [, fam] of texto(p).matchAll(/family=([A-Za-z+]+)/g)) expect(FAMILIAS, `${p}: ${fam}`).toContain(fam.replaceAll('+', ' '));
    }
  });

  it('declara formato conhecido e nome único em cada peça', () => {
    for (const m of MODELOS) {
      const pecas = [...modelo(m).querySelectorAll('.peca')];
      expect(pecas.length, m).toBeGreaterThan(0);
      for (const p of pecas) expect(FORMATOS, `${m}: ${p.getAttribute('data-nome')}`).toContain(p.getAttribute('data-formato'));
      const nomes = pecas.map((p) => p.getAttribute('data-nome'));
      expect(nomes.every(Boolean), m).toBe(true);
      expect(new Set(nomes).size, m).toBe(nomes.length);
    }
  });

  it('monta carrosséis de 2 a 10 lâminas em retrato', () => {
    for (const m of MODELOS.filter((n) => n.startsWith('carrossel'))) {
      const pecas = [...modelo(m).querySelectorAll('.peca')];
      expect(pecas.length, m).toBeGreaterThanOrEqual(2);
      expect(pecas.length, m).toBeLessThanOrEqual(10);
      for (const p of pecas) expect(p.getAttribute('data-formato'), m).toBe('retrato');
    }
  });

  it('não leva nada da referência nem dados pessoais', () => {
    for (const p of fontes) {
      expect(texto(p), p).not.toMatch(/rayray|seoul|awwwards/i);
      expect(texto(p), p).not.toMatch(/[\w.+-]+@[\w-]+\.(com|br|net|org|io)\b/i);
      expect(texto(p), p).not.toMatch(/\+\d{2}[\s)(.-]*\d{2}[\s)(.-]*\d{4,5}[\s.-]*\d{4}/);
    }
  });

  it('o guia registra a paleta e as fontes', () => {
    const guia = texto(join(PASTA, 'README.md'));
    for (const c of CORES.filter((c) => c !== '#FFFFFF')) expect(guia).toContain(c);
    for (const f of FAMILIAS) expect(guia).toContain(f);
  });
});
