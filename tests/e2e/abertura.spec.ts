import { expect, test } from '@playwright/test';

test('a abertura mostra os três trechos, some em até 6 s e não volta na mesma sessão', async ({ page }) => {
  await page.goto('/');
  const abertura = page.locator('.abertura');
  await expect(abertura).toBeVisible();
  await expect(page.locator('.abertura .trecho')).toHaveCount(3);
  // Amostra a opacidade dos trechos a cada 100 ms até a abertura sair (no máximo 6 s).
  const maximo = await page.evaluate(async () => {
    const max = [0, 0, 0];
    const t0 = performance.now();
    while (document.querySelector('.abertura') && performance.now() - t0 < 6000) {
      document.querySelectorAll('.abertura .trecho').forEach((e, i) => (max[i] = Math.max(max[i], +getComputedStyle(e).opacity)));
      await new Promise((r) => setTimeout(r, 100));
    }
    return { max, saiu: !document.querySelector('.abertura') };
  });
  expect(maximo.max).toEqual([1, 1, 1]);
  expect(maximo.saiu).toBe(true);
  await page.reload();
  await expect(page.locator('.abertura')).toHaveCount(0);
});

test('depois de recarregar no meio da página, a rolagem não fica travada', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toBeHidden({ timeout: 6000 });
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(1500);
  await page.reload();
  await page.waitForTimeout(1000);
  const antes = await page.evaluate(() => scrollY);
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(antes);
});
