import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const desenvolvimento = readFileSync('docs/DESENVOLVIMENTO.md', 'utf8');
const claude = readFileSync('CLAUDE.md', 'utf8');
const memoria = readFileSync('docs/memoria-do-projeto.md', 'utf8');

describe('documentação do projeto', () => {
  it('lista os comandos que o CI e a pessoa usam', () => {
    for (const c of ['npm test', 'npm run check', 'npm run test:build', 'npm run dev']) expect(desenvolvimento).toContain(c);
  });

  it('não descreve mais a publicação antiga por reescritas', () => {
    expect(desenvolvimento).not.toContain('rewrites');
    expect(desenvolvimento).not.toContain('identidade-da-marca.html');
  });

  it('aponta a auditoria do RayRay como referência única', () => {
    expect(claude).toContain('docs/referencias/rayraylab.md');
    expect(memoria).toContain('docs/referencias/rayraylab.md');
    expect(memoria).not.toMatch(/somente RayRay Lab e path digital/);
  });

  it('não guarda detalhes da implementação antiga que já não valem', () => {
    expect(memoria).not.toContain('âncoras em 1,4 s');
    expect(memoria).not.toContain('Lenis 1.3.26');
    expect(memoria).not.toContain('identidade-da-marca.html');
  });
});
