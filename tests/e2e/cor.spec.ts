import { expect, test } from '@playwright/test';
import { corNoPonto, perto, rolarAte } from './util/pixel';

test('o fundo começa claro e passa ao escuro ao sair do hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  expect(perto(await corNoPonto(page, 8, 120), '#F7F7F5')).toBe(true);
  await rolarAte(page, 1.6 * 900);
  expect(perto(await corNoPonto(page, 8, 450), '#121212')).toBe(true);
});
