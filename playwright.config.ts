import { defineConfig } from '@playwright/test';

const port = 3015;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './scripts',
  timeout: 180000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'off',
  },
  webServer: {
    command: `npx next dev -p ${port} --hostname 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    { name: 'mobile-360', use: { browserName: 'chromium', viewport: { width: 360, height: 640 } } },
    { name: 'desktop-1280', use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } } },
  ],
});
