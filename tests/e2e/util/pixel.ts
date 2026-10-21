import type { Page } from '@playwright/test';
import { PNG } from 'pngjs';

// Cor do pixel da tela (DOM + canvas compostos), lida de uma captura de 1×1.
export async function corNoPonto(page: Page, x: number, y: number): Promise<[number, number, number]> {
  const png = PNG.sync.read(await page.screenshot({ clip: { x, y, width: 1, height: 1 } }));
  return [png.data[0], png.data[1], png.data[2]];
}

export const perto = (a: [number, number, number], hex: string, tolerancia = 6) => {
  const b = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return a.every((v, i) => Math.abs(v - b[i]) <= tolerancia);
};

export async function rolarAte(page: Page, y: number) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1800);
}
