import { expect, test } from '@playwright/test';

const ORDEM = ['secao-hero', 'secao-manifesto', 'secao-capitulos', 'secao-decisoes', 'secao-contato'];

test('as seções seguem a ordem da referência', async ({ page }) => {
  await page.goto('/');
  const classes = await page.$$eval('main section', (s) => s.map((e) => [...e.classList].find((c) => c.startsWith('secao-'))));
  expect(classes).toEqual(ORDEM);
});

for (const largura of [1440, 390]) {
  test(`sem rolagem horizontal em ${largura}px`, async ({ page }) => {
    await page.setViewportSize({ width: largura, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(2500);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('redimensionar do desktop para o celular não cria rolagem horizontal', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(2500);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
