import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('com movimento reduzido não há abertura nem seção fixada, e o conteúdo todo fica visível', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);
  await expect(page.locator('.abertura')).toHaveCount(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  for (const seletor of ['.manifesto-texto', '.cartao-titulo >> nth=6', '.lista-decisoes li >> nth=10', '.frase-contato']) {
    const el = page.locator(seletor);
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible();
  }
  await expect(page.locator('html')).not.toHaveClass(/js-smooth-scrollbar-enabled/);
});
