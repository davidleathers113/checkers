import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';

/**
 * Production / PWA verification. These run against the production preview build
 * (see playwright.config.ts), which is where the service worker registers and
 * the manifest/icon are actually served.
 */
test.describe('PWA', () => {
  test('serves a valid web app manifest with the required fields', async ({ page, request }) => {
    const game = new GamePage(page);
    await game.goto();

    const href = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(href).toBeTruthy();

    const manifestUrl = new URL(href!, page.url()).toString();
    const res = await request.get(manifestUrl);
    expect(res.ok()).toBeTruthy();

    const manifest = await res.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBe('standalone');
    expect(Array.isArray(manifest.icons)).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThan(0);

    // Every declared icon must actually resolve.
    for (const icon of manifest.icons) {
      const iconRes = await request.get(new URL(icon.src, manifestUrl).toString());
      expect(iconRes.ok()).toBeTruthy();
    }
  });

  test('declares the PWA install metadata', async ({ page }) => {
    const game = new GamePage(page);
    await game.goto();
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute(
      'content',
      'yes'
    );
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  });

  test('registers a service worker and plays offline after the first visit', async ({
    page,
    context,
  }) => {
    const game = new GamePage(page);
    await game.goto();

    // The worker installs and activates on first visit (it does not claim the
    // current page — see sw.js). Wait for it to be active.
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));

    // One online reload: this navigation IS controlled by the active worker, so
    // its cache-first fetch handler caches the hashed JS/CSS for offline use.
    await page.reload();
    await expect(game.board).toBeVisible();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, {
      timeout: 20_000,
    });

    // Now cut the network and reload: the shell + assets must come from cache.
    await context.setOffline(true);
    try {
      await page.reload();
      await expect(game.board).toBeVisible();
      await expect(page.locator('h1')).toContainText('Checkers');
    } finally {
      await context.setOffline(false);
    }
  });
});
