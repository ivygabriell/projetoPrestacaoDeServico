import { describe, expect, it } from 'vitest';
import { criarFormas } from '@/componentes/hero/formas';

describe('criarFormas', () => {
  it('gera as três formas de vidro por código, a principal mais larga que alta', () => {
    const { principal, laje, pequena } = criarFormas();
    for (const g of [principal, laje, pequena]) expect(g.attributes.position.count).toBeGreaterThan(0);
    principal.computeBoundingBox();
    const caixa = principal.boundingBox!;
    expect(caixa.max.x - caixa.min.x).toBeGreaterThan(caixa.max.y - caixa.min.y);
  });
});
