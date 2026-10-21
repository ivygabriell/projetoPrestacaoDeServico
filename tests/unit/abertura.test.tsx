import { describe, expect, it } from 'vitest';
import { deveTocarAbertura } from '@/componentes/abertura/Abertura';

describe('deveTocarAbertura', () => {
  it('toca só no desktop, sem movimento reduzido e uma vez por sessão', () => {
    expect(deveTocarAbertura(1440, false, false)).toBe(true);
    expect(deveTocarAbertura(390, false, false)).toBe(false);
    expect(deveTocarAbertura(1440, true, false)).toBe(false);
    expect(deveTocarAbertura(1440, false, true)).toBe(false);
  });
});
