import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));

describe('CI', () => {
  it('roda instalação, testes, tipos e o teste do build com o Chromium do Playwright', () => {
    const passos = ['npm ci', 'npm test', 'npm run check', 'npx playwright install --with-deps chromium', 'npm run test:build'];
    let ultimo = -1;
    for (const passo of passos) {
      const i = ci.indexOf(`run: ${passo}`);
      expect(i, passo).toBeGreaterThan(ultimo);
      ultimo = i;
    }
  });
});

describe('Vercel', () => {
  it('publica como Next.js, sem as reescritas antigas e fora dos buscadores', () => {
    expect(vercel.framework).toBe('nextjs');
    expect(vercel.rewrites).toBeUndefined();
    expect(vercel.buildCommand).toBeUndefined();
    const cabecalhos = vercel.headers.flatMap((h: { headers: { key: string; value: string }[] }) => h.headers);
    expect(cabecalhos).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
  });
});
