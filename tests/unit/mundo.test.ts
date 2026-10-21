import { describe, expect, it } from 'vitest';
import { criarMundo } from '@/componentes/contato/mundo';

describe('criarMundo', () => {
  it('cria 100 caixas no desktop e 50 no celular', () => {
    expect(criarMundo(100).caixas).toHaveLength(100);
    expect(criarMundo(50).caixas).toHaveLength(50);
  });

  it('usa gravidade 10, atrito 0,1 e restituição 0,9', () => {
    const { mundo } = criarMundo(10);
    expect(mundo.gravity.y).toBe(-10);
    expect(mundo.defaultContactMaterial.friction).toBe(0.1);
    expect(mundo.defaultContactMaterial.restitution).toBe(0.9);
  });

  it('mantém as caixas dentro do cubo depois de cair', () => {
    const { mundo, caixas } = criarMundo(100);
    // step(1/60) avança exatamente um quadro; fixedStep mede o relógio real e quase não andaria num laço.
    for (let i = 0; i < 300; i++) mundo.step(1 / 60);
    for (const c of caixas) {
      expect(Math.abs(c.position.x)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(c.position.z)).toBeLessThanOrEqual(0.5);
      expect(c.position.y).toBeGreaterThanOrEqual(-0.6);
      expect(c.position.y).toBeLessThanOrEqual(0.4);
    }
  });
});
