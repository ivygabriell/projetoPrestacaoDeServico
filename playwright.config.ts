import { defineConfig } from '@playwright/test';

// Fora do CI usa o Chrome instalado na máquina; no CI, o Chromium do Playwright.
const canal = process.env.CI ? undefined : 'chrome';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  workers: 1,
  use: { baseURL: 'http://localhost:3100', channel: canal, viewport: { width: 1440, height: 900 } },
  webServer: { command: 'npm run start -- -p 3100', url: 'http://localhost:3100', reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
