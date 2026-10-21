import { devices, expect, test } from '@playwright/test';

test.use({ ...devices['iPhone 13'], defaultBrowserType: 'chromium' });

test('no celular não há abertura, os capítulos viram lista e as decisões, folha estática', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);
  await expect(page.locator('.abertura')).toBeHidden();
  const topos = await page.$$eval('.cartao', (cs) => cs.map((c) => c.getBoundingClientRect().top));
  expect(topos).toHaveLength(7);
  for (let i = 1; i < topos.length; i++) expect(topos[i]).toBeGreaterThan(topos[i - 1]);
  await page.locator('.lista-decisoes').scrollIntoViewIfNeeded();
  await expect(page.locator('.lista-decisoes')).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/js-smooth-scrollbar-enabled/);
});
