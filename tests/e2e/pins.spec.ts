import { expect, test } from '@playwright/test';

// Rolando com a roda, a seção de contato chega ao topo aos poucos e não salta para trás depois do pin.
test('o contato chega ao topo sem teletransportar e não volta para baixo depois do pin', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.abertura')).toHaveCount(0, { timeout: 8000 });
  const decisoes = await page.locator('.secao-decisoes').evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y), decisoes);
  await page.waitForTimeout(1500);
  await page.mouse.move(720, 450);
  const topos: number[] = [];
  for (let i = 0; i < 70; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(120);
    topos.push(await page.locator('.secao-contato').evaluate((e) => Math.round(e.getBoundingClientRect().top)));
  }
  const chegada = topos.findIndex((t) => t <= 0);
  expect(chegada, `topos: ${topos.join(' ')}`).toBeGreaterThan(0);
  expect(topos[chegada - 1], `topos: ${topos.join(' ')}`).toBeLessThan(400);
  for (let i = chegada + 1; i < topos.length; i++) expect(topos[i] - topos[i - 1], `topos: ${topos.join(' ')}`).toBeLessThan(60);
});
