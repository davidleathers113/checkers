import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';

/**
 * Robustness checks: motion preferences, theme switching, and a clean console.
 */
test.describe('Robustness', () => {
  test('honours prefers-reduced-motion by collapsing transitions', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const game = new GamePage(page);
    await game.goto();

    // The emulation is active...
    const matches = await page.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    expect(matches).toBe(true);

    // ...and the CSS responds: a square that normally has a 0.25s colour
    // transition collapses to effectively zero under the reduced-motion guard.
    const square = page.locator('[data-testid="game-square-0-1"]');
    const transitionSeconds = await square.evaluate(el =>
      parseFloat(getComputedStyle(el).transitionDuration)
    );
    expect(transitionSeconds).toBeLessThan(0.01);
  });

  test('respects reduced motion without breaking gameplay (a move still completes)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const game = new GamePage(page);
    await game.goto();

    // Red moves first: (5,0) -> (4,1) is legal. The move must still apply with
    // animations disabled.
    await game.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
    await game.expectPieceToBe({ row: 4, col: 1 }, 'red');
    await game.expectCurrentPlayer('Black');
  });

  test('switching through every theme never logs a console error', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    const game = new GamePage(page);
    await game.goto();

    for (const theme of ['classic', 'modern', 'dark']) {
      await game.openSettings();
      await page.locator(`input[value="${theme}"]`).click();
      await game.configDoneButton.click();
      // The board stays rendered across the theme change.
      await expect(game.board).toBeVisible();
    }

    expect(errors).toEqual([]);
  });
});
