import { expect, test } from '@playwright/test';

test('a linha cresce e as frases se digitam enquanto a seção de decisões está fixada', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  const inicio = await page.locator('.secao-decisoes').evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y), inicio + 2);
  await page.waitForTimeout(1000);
  const frase = page.locator('.frase').first();
  const textoInicial = (await frase.textContent()) ?? '';
  await page.evaluate((y) => scrollTo(0, y + 0.7 * innerHeight), inicio);
  await page.waitForTimeout(2000);
  expect(await page.locator('.titulo-decisoes .linha').evaluate((e) => e.getBoundingClientRect().width)).toBeGreaterThan(50);
  expect(((await frase.textContent()) ?? '').length).toBeGreaterThan(textoInicial.length);
});
