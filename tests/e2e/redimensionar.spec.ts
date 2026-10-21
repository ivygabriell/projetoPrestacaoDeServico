import { expect, test } from '@playwright/test';

// A página monta cada seção para a largura que encontra (galeria ou lista, lençol ou folha). Ao mudar a largura,
// ela recarrega e remonta, como a referência faz: nada fica com posições ou modo de outra largura.
test('redimensionar recarrega a página no modo certo para a nova largura', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator('.secao-capitulos')).toHaveClass(/modo-galeria/);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.secao-capitulos')).toHaveClass(/modo-lista/, { timeout: 5000 });
  await expect(page.locator('.secao-decisoes')).not.toHaveClass(/com-lencol/);
  await expect(page.locator('html')).not.toHaveClass(/js-smooth-scrollbar-enabled/);

  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(page.locator('.secao-capitulos')).toHaveClass(/modo-galeria/, { timeout: 5000 });
  const extraEsperado = await page.locator('.cartoes').evaluate((e) => e.scrollWidth - innerWidth + 60);
  await page.waitForTimeout(1500);
  const inicio = await page.locator('.secao-capitulos').evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate(([y, extra]) => scrollTo(0, y + 0.95 * Math.max(extra - 500, innerHeight)), [inicio, extraEsperado]);
  await page.waitForTimeout(2500);
  const ultimo = await page.locator('.cartao').last().evaluate((e) => e.getBoundingClientRect().right);
  expect(ultimo).toBeLessThanOrEqual(1100);
});
