import { expect, test } from '@playwright/test';
import { corNoPonto, perto, rolarAte } from './util/pixel';

test('o fundo começa claro e passa ao escuro ao sair do hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  expect(perto(await corNoPonto(page, 8, 120), '#F7F7F5')).toBe(true);
  await rolarAte(page, 1.6 * 900);
  expect(perto(await corNoPonto(page, 8, 450), '#121212')).toBe(true);
});

test('o fundo só volta ao claro no contato, depois que o círculo encolhe', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  const decisoes = await page.locator('.secao-decisoes').evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await rolarAte(page, decisoes + 200);
  expect(perto(await corNoPonto(page, 8, 450), '#121212')).toBe(true);
  const contato = await page.locator('.secao-contato').evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y + 0.85 * window.innerHeight), contato);
  await page.waitForTimeout(2500);
  expect(perto(await corNoPonto(page, 8, 450), '#F7F7F5')).toBe(true);
});
