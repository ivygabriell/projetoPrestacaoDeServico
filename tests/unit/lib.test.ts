import { describe, expect, it } from 'vitest';
import { ehCelular } from '@/lib/ambiente';
import { razaoContraste } from '@/lib/contraste';
import { relogio } from '@/lib/relogio';
import { limita, suave } from '@/lib/suave';

describe('suave', () => {
  it('é a curva cúbica entre os limites, presa entre 0 e 1', () => {
    expect(suave(0, 1, 0.5)).toBe(0.5);
    expect(suave(0, 1, -1)).toBe(0);
    expect(suave(0, 1, 2)).toBe(1);
    expect(suave(0, 1, 0.25)).toBeCloseTo(0.15625);
  });
  it('limita prende o valor no intervalo', () => {
    expect(limita(5, 0, 1)).toBe(1);
    expect(limita(-5, 0, 1)).toBe(0);
  });
});

describe('relogio', () => {
  it('mostra REC, o dia em português e a hora com zeros', () => {
    expect(relogio(new Date(2026, 9, 20, 13, 7, 5))).toBe('REC ter13:07:05');
    expect(relogio(new Date(2026, 9, 24, 9, 0, 0))).toBe('REC sáb09:00:00');
  });
});

describe('razaoContraste', () => {
  it('calcula o contraste WCAG 2.x dos tokens da marca', () => {
    expect(razaoContraste('#F7F7F5', '#121212')).toBeCloseTo(17.46, 2);
    expect(razaoContraste('#002FA7', '#121212')).toBeCloseTo(1.75, 2);
    expect(razaoContraste('#5B7BFF', '#121212')).toBeCloseTo(5.1, 2);
  });
  it('é simétrico', () => {
    expect(razaoContraste('#121212', '#F7F7F5')).toBe(razaoContraste('#F7F7F5', '#121212'));
  });
});

describe('ehCelular', () => {
  it('corta em 900px, como a referência', () => {
    expect(ehCelular(899)).toBe(true);
    expect(ehCelular(900)).toBe(false);
  });
});
