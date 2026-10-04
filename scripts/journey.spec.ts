import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const ID = 'a1b2c3d4e5f67890';
const PASS = 'bloomday';

function shotDir(project: string) {
  const dir = `qa-shots/${project}`;
  mkdirSync(dir, { recursive: true });
  return dir;
}

test.describe('Bloomday recipient journey', () => {
  test('plays through every scene', async ({ page }, info) => {
    const dir = shotDir(info.project.name);
    const snap = async (name: string) => {
      await page.screenshot({ path: `${dir}/${name}.png`, fullPage: false });
    };

    page.on('console', msg => {
      const t = msg.text();
      if (t.includes('Star 0')) console.log(`[console] ${t}`);
    });

    await page.goto(`/b/${ID}`);
    await expect(page.getByText('YOUR SURPRISE AWAITS')).toBeVisible();
    await snap('unlock');

    await page.getByLabel('PASSWORD').fill('wrong');
    await page.getByTestId('unlock').click();
    await expect(page.getByText('Incorrect password')).toBeVisible();
    await snap('unlock-error');

    await page.getByLabel('PASSWORD').fill(PASS);
    await page.getByTestId('unlock').click();
    await expect(page.getByText('YOUR SPECIAL DAY')).toBeVisible({ timeout: 12000 });
    await page.waitForTimeout(800);
    await snap('cake-lit');

    for (let i = 0; i < 4; i++) {
      await page.getByTestId(`candle-${i}`).click();
      await page.waitForTimeout(400);
    }
    await snap('cake-smoke');
    await page.waitForTimeout(1800);
    await snap('cake-celebration');

    await expect(page.getByTestId('calendar')).toBeVisible({ timeout: 12000 });
    await snap('date');
    await page.getByTestId('continue').click();

    await expect(page.getByText('FOR YOU')).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(1200);
    await snap('name-mid');
    await expect(page.getByTestId('continue')).toBeVisible({ timeout: 8000 });
    await page.getByTestId('continue').click();

    for (let n = 0; n < 4; n++) {
      await expect(page.getByText(`0${n + 1}/04`)).toBeVisible({ timeout: 8000 });
      await snap(`message-${n + 1}`);
      await page.getByTestId('continue').click();
    }

    await expect(page.getByText('Pop a balloon')).toBeVisible({ timeout: 8000 });
    await snap('balloons-idle');
    await page.getByLabel('Pop balloon 1').click();
    await page.waitForTimeout(500);
    await snap('balloon-popped-wish');
    await page.getByText('Tap to close').click();
    await page.getByTestId('continue').click();

    await expect(page.getByText('Tap the envelope to open')).toBeVisible({ timeout: 8000 });
    await snap('envelope-closed');
    await page.getByTestId('envelope-open').click();
    await page.waitForTimeout(700);
    await snap('envelope-opening');
    await page.waitForTimeout(2200);
    await page.locator('text=With love,').or(page.getByTestId('continue')).first().waitFor({ timeout: 25000 }).catch(async () => {
      await page.locator('.recipientcard').click({ position: { x: 180, y: 220 } });
    });
    await page.locator('.recipientcard').click({ position: { x: 180, y: 240 } });
    await expect(page.getByTestId('continue')).toBeVisible({ timeout: 25000 });
    await snap('letter-reading');
    await page.getByTestId('continue').click();

    await expect(page.getByText('OUR MEMORIES')).toBeVisible({ timeout: 8000 });
    await snap('gallery');
    await page.getByTestId('continue').click();

    await expect(page.getByText('Tap to skip')).toBeVisible({ timeout: 8000 });
    await snap('final-stars-scattered');
    await page.waitForTimeout(5500);
    await snap('final-heart-formed');
    await page.waitForTimeout(4500);
    await snap('final-text');
    await expect(page.getByTestId('replay')).toBeVisible({ timeout: 8000 });
  });
});
