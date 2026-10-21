import { expect, test } from '@playwright/test';

test.use({ launchOptions: { args: ['--disable-3d-apis', '--disable-webgl'] } });

test('sem WebGL a página não quebra: o trecho escuro tem fundo escuro e os cartazes aparecem como imagens', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto('/');
  await page.waitForTimeout(2500);
  await expect(page.getByText('Application error')).toHaveCount(0);
  await expect(page.locator('main section')).toHaveCount(5);
  const manifesto = page.locator('.secao-manifesto');
  await manifesto.scrollIntoViewIfNeeded();
  await expect(manifesto).toHaveCSS('background-color', 'rgb(18, 18, 18)');
  await expect(page.locator('.manifesto-texto')).toBeVisible();
  const imagem = page.locator('.cartao-img img').first();
  await imagem.scrollIntoViewIfNeeded();
  await expect(imagem).toHaveCSS('opacity', '1');
  expect(erros).toEqual([]);
});
