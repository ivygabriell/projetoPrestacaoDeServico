import { expect, test } from '@playwright/test';

// O vidro em DOM acompanha a peça pequena de vidro, que se desloca até 0,05 unidade para cada lado com o mouse
// (≈58px entre as bordas a 1440px). A flutuação no tempo anda bem menos que isso em um segundo, então
// cada ida da esquerda para a direita precisa empurrar o vidro para a direita.
test('o vidro do hero reage ao mouse (o ponteiro chega às cenas 3D)', async ({ page }) => {
  // No CI o WebGL roda em software, a poucos quadros por segundo, e o deslocamento medido fica abaixo do limite;
  // o comportamento é conferido na máquina com GPU (npm run test:build local).
  test.skip(!!process.env.CI, 'WebGL sem GPU no CI');
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  await page.waitForTimeout(3500);
  const x = () => page.locator('.vidro-dom').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
  for (let i = 0; i < 3; i++) {
    await page.mouse.move(5, 450, { steps: 5 });
    await page.waitForTimeout(700);
    const esquerda = await x();
    await page.mouse.move(1435, 450, { steps: 5 });
    await page.waitForTimeout(700);
    const direita = await x();
    expect(direita - esquerda).toBeGreaterThan(25);
  }
});

test('no contato o cubo pode ser arrastado: cursor "grab" sobre a seção', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(2500);
  await expect(page.locator('.secao-contato')).toHaveCSS('cursor', 'grab');
});
