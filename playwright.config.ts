import { defineConfig, devices } from '@playwright/test';

const PUERTO = 4321;
const URL_BASE = `http://127.0.0.1:${PUERTO}`;

// Usa el Chrome instalado (en el PC y en el ubuntu de GitHub Actions viene de serie), así no hay
// que descargar navegadores. Prueba el sitio ya compilado (npm run build), no el de desarrollo.
export default defineConfig({
  testDir: './pruebas',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'informes/playwright' }]]
    : [['list']],
  outputDir: 'informes/playwright-resultados',
  use: {
    baseURL: URL_BASE,
    channel: 'chrome',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'celular', use: { ...devices['Pixel 7'], channel: 'chrome' } },
    { name: 'pc', use: { viewport: { width: 1440, height: 900 }, channel: 'chrome' } },
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PUERTO}`,
    url: URL_BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
