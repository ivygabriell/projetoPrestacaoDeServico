import { expect, test } from '@playwright/test';

test('a página carrega fora dos buscadores, em português e com o canvas global', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  const resposta = await page.goto('/');
  expect(resposta?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex,\s*nofollow/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('#ScrollRig-canvas canvas')).toHaveCount(1);
  await page.waitForTimeout(3000);
  expect(erros).toEqual([]);
});
