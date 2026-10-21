import { expect, test, type Page } from '@playwright/test';
import { PNG } from 'pngjs';

// Diferença média por pixel entre duas capturas da mesma região.
const diferenca = (a: Buffer, b: Buffer) => {
  const x = PNG.sync.read(a).data;
  const y = PNG.sync.read(b).data;
  let soma = 0;
  for (let i = 0; i < x.length; i += 4) soma += Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]);
  return soma / (x.length / 4);
};
const regiao = (page: Page) => page.screenshot({ clip: { x: 200, y: 450, width: 1040, height: 300 } });

test('o vidro do hero reage ao mouse (o ponteiro chega às cenas 3D)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  await page.waitForTimeout(3500);
  await page.mouse.move(10, 450);
  await page.waitForTimeout(800);
  const parado1 = await regiao(page);
  await page.waitForTimeout(300);
  const parado2 = await regiao(page);
  await page.mouse.move(1430, 450, { steps: 10 });
  await page.waitForTimeout(800);
  const movido = await regiao(page);
  expect(diferenca(parado2, movido)).toBeGreaterThan(3 * Math.max(1, diferenca(parado1, parado2)));
});

test('no contato o cubo pode ser arrastado: cursor "grab" sobre a seção', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(2500);
  await expect(page.locator('.secao-contato')).toHaveCSS('cursor', 'grab');
});
