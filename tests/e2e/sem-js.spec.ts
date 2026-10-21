import { expect, test } from '@playwright/test';

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('a abertura não cobre a página', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.abertura')).toBeHidden();
    await expect(page.locator('.manifesto-texto')).toBeAttached();
  });
});

test('durante a abertura o cabeçalho escondido não recebe foco', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toBeVisible();
  await expect(page.locator('.cabecalho')).toHaveAttribute('inert', '');
  await expect(page.locator('.abertura')).toBeHidden({ timeout: 8000 });
  await expect(page.locator('.cabecalho')).not.toHaveAttribute('inert', '');
});

test('ao recarregar na mesma sessão a abertura não pisca antes da hidratação', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toBeHidden({ timeout: 8000 });
  await page.reload({ waitUntil: 'commit' });
  await page.waitForSelector('.abertura', { state: 'attached', timeout: 2000 }).catch(() => null);
  const visivel = await page.evaluate(() => {
    const a = document.querySelector('.abertura');
    return !!a && getComputedStyle(a).display !== 'none';
  });
  expect(visivel).toBe(false);
});
