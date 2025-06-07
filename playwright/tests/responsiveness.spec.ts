import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';
import { VIEWPORT_SIZES } from '../support/testData';

test.describe('Responsiveness Tests', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page);
  });

  test.describe('Desktop Layout', () => {
    test('Default desktop layout displays correctly', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.desktop);
      await gamePage.goto();
      
      // Verify all main elements are visible and properly positioned
      await expect(gamePage.gameContainer).toBeVisible();
      await expect(gamePage.board).toBeVisible();
      await expect(gamePage.gameStatus).toBeVisible();
      await expect(gamePage.gameControls).toBeVisible();
      await expect(gamePage.settingsButton).toBeVisible();
      
      // Verify the board is properly sized
      const boardBox = await gamePage.board.boundingBox();
      expect(boardBox).toBeTruthy();
      expect(boardBox!.width).toBeGreaterThan(400);
      expect(boardBox!.height).toBeGreaterThan(400);
      
      // Verify game controls are horizontally arranged
      const controlsBox = await gamePage.gameControls.boundingBox();
      expect(controlsBox).toBeTruthy();
      expect(controlsBox!.width).toBeGreaterThan(controlsBox!.height);
    });

    test('Settings panel fits properly on desktop', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.desktop);
      await gamePage.goto();
      await gamePage.openSettings();
      
      // Verify settings panel is visible and well-positioned
      await expect(gamePage.configContainer).toBeVisible();
      
      const configBox = await gamePage.configContainer.boundingBox();
      const pageBox = await page.locator('body').boundingBox();
      
      expect(configBox).toBeTruthy();
      expect(pageBox).toBeTruthy();
      
      // Settings panel should not overflow the viewport
      expect(configBox!.x).toBeGreaterThanOrEqual(0);
      expect(configBox!.y).toBeGreaterThanOrEqual(0);
      expect(configBox!.x + configBox!.width).toBeLessThanOrEqual(pageBox!.width);
      expect(configBox!.y + configBox!.height).toBeLessThanOrEqual(pageBox!.height);
    });
  });

  test.describe('Tablet Layout', () => {
    test('Tablet layout adapts correctly', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.tablet);
      await gamePage.goto();
      
      // Verify all elements are still visible
      await expect(gamePage.gameContainer).toBeVisible();
      await expect(gamePage.board).toBeVisible();
      await expect(gamePage.gameStatus).toBeVisible();
      await expect(gamePage.gameControls).toBeVisible();
      
      // Board should scale appropriately
      const boardBox = await gamePage.board.boundingBox();
      expect(boardBox).toBeTruthy();
      expect(boardBox!.width).toBeGreaterThan(300);
      expect(boardBox!.width).toBeLessThan(600);
      
      // Elements should not overlap
      const statusBox = await gamePage.gameStatus.boundingBox();
      const controlsBox = await gamePage.gameControls.boundingBox();
      
      expect(statusBox).toBeTruthy();
      expect(controlsBox).toBeTruthy();
      
      // Status should be above controls (no vertical overlap)
      expect(statusBox!.y + statusBox!.height).toBeLessThanOrEqual(controlsBox!.y + 10);
    });

    test('Touch interactions work on tablet', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.tablet);
      await gamePage.goto();
      
      // Test piece selection with touch
      await gamePage.clickSquare(2, 1);
      await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
      
      // Test piece movement
      await gamePage.clickSquare(3, 0);
      await gamePage.waitForAnimations();
      
      // Verify the move worked
      await gamePage.expectPieceToBe({ row: 3, col: 0 }, 'red');
      await gamePage.expectSquareToBeEmpty({ row: 2, col: 1 });
    });

    test('Settings panel adapts to tablet viewport', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.tablet);
      await gamePage.goto();
      await gamePage.openSettings();
      
      // Settings should still be accessible and usable
      await expect(gamePage.configContainer).toBeVisible();
      
      // All configuration options should be visible
      await expect(gamePage.boardSize8Radio).toBeVisible();
      await expect(gamePage.boardSize10Radio).toBeVisible();
      await expect(gamePage.showMoveHintsCheckbox).toBeVisible();
      
      // Test interaction
      await gamePage.selectBoardSize('10');
      await gamePage.confirmConfigurationChange();
      await gamePage.expectBoardSize(10);
    });
  });

  test.describe('Mobile Layout', () => {
    test('Mobile layout displays all essential elements', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile);
      await gamePage.goto();
      
      // All essential elements should be visible
      await expect(gamePage.gameContainer).toBeVisible();
      await expect(gamePage.board).toBeVisible();
      await expect(gamePage.gameStatus).toBeVisible();
      await expect(gamePage.gameControls).toBeVisible();
      
      // Board should be appropriately sized for mobile
      const boardBox = await gamePage.board.boundingBox();
      expect(boardBox).toBeTruthy();
      expect(boardBox!.width).toBeGreaterThan(200);
      expect(boardBox!.width).toBeLessThan(400);
      
      // Check that elements stack vertically and don't overflow
      const viewport = page.viewportSize()!;
      expect(boardBox!.x + boardBox!.width).toBeLessThanOrEqual(viewport.width);
    });

    test('Mobile drag and drop interactions work', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile);
      await gamePage.goto();
      
      // Test piece selection on mobile
      await gamePage.clickSquare(2, 1);
      await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
      
      // Test piece movement (may use click-to-move instead of drag)
      await gamePage.clickSquare(3, 0);
      await gamePage.waitForAnimations();
      
      // Verify the move worked
      await gamePage.expectPieceToBe({ row: 3, col: 0 }, 'red');
      await gamePage.expectCurrentPlayer('Black');
    });

    test('Settings panel is accessible on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile);
      await gamePage.goto();
      
      // Settings button should be easily tappable
      const settingsBox = await gamePage.settingsButton.boundingBox();
      expect(settingsBox).toBeTruthy();
      expect(settingsBox!.width).toBeGreaterThanOrEqual(44); // Minimum touch target size
      expect(settingsBox!.height).toBeGreaterThanOrEqual(44);
      
      // Open settings
      await gamePage.openSettings();
      await expect(gamePage.configContainer).toBeVisible();
      
      // Settings panel should fill most of the mobile screen
      const configBox = await gamePage.configContainer.boundingBox();
      const viewport = page.viewportSize()!;
      
      expect(configBox).toBeTruthy();
      expect(configBox!.width).toBeGreaterThan(viewport.width * 0.8); // At least 80% of screen width
    });

    test('Mobile controls are appropriately sized', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile);
      await gamePage.goto();
      
      // Check that all buttons meet minimum touch target sizes
      const buttons = [
        gamePage.newGameButton,
        gamePage.undoButton,
        gamePage.redoButton,
        gamePage.settingsButton
      ];
      
      for (const button of buttons) {
        const buttonBox = await button.boundingBox();
        expect(buttonBox).toBeTruthy();
        expect(buttonBox!.width).toBeGreaterThanOrEqual(44); // iOS HIG minimum
        expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('Game squares are tappable on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile);
      await gamePage.goto();
      
      // Check that game squares are large enough for touch interaction
      const square = gamePage.getSquare(2, 1);
      const squareBox = await square.boundingBox();
      
      expect(squareBox).toBeTruthy();
      expect(squareBox!.width).toBeGreaterThanOrEqual(30); // Reasonable minimum for game pieces
      expect(squareBox!.height).toBeGreaterThanOrEqual(30);
      
      // Test actual interaction
      await square.click();
      await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
    });
  });

  test.describe('Orientation Changes', () => {
    test('Landscape orientation on mobile', async ({ page }) => {
      // Set mobile landscape viewport
      await page.setViewportSize({ width: 667, height: 375 });
      await gamePage.goto();
      
      // Verify layout adapts to landscape
      await expect(gamePage.board).toBeVisible();
      await expect(gamePage.gameStatus).toBeVisible();
      await expect(gamePage.gameControls).toBeVisible();
      
      // Board should still be usable
      const boardBox = await gamePage.board.boundingBox();
      expect(boardBox).toBeTruthy();
      expect(boardBox!.height).toBeLessThanOrEqual(375); // Fit within viewport height
      
      // Test interaction still works
      await gamePage.clickSquare(2, 1);
      await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
    });
  });

  test.describe('Visual Consistency Across Viewports', () => {
    test('Theme consistency across different screen sizes', async ({ page }) => {
      const viewports = [VIEWPORT_SIZES.desktop, VIEWPORT_SIZES.tablet, VIEWPORT_SIZES.mobile];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await gamePage.goto();
        
        // Open settings and change theme
        await gamePage.openSettings();
        const darkTheme = page.locator('input[value="dark"]');
        await darkTheme.click();
        await gamePage.configDoneButton.click();
        
        // Verify theme is applied consistently
        const appContainer = page.locator('.app-container');
        await expect(appContainer).toHaveClass(/theme-dark/);
        
        // Take a screenshot for visual verification
        await page.screenshot({ 
          path: `test-results/theme-dark-${viewport.width}x${viewport.height}.png`,
          fullPage: true 
        });
      }
    });

    test('Game functionality works consistently across viewports', async ({ page }) => {
      const viewports = [
        { name: 'desktop', ...VIEWPORT_SIZES.desktop },
        { name: 'tablet', ...VIEWPORT_SIZES.tablet },
        { name: 'mobile', ...VIEWPORT_SIZES.mobile }
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await gamePage.goto();
        
        // Test basic game functionality
        await gamePage.clickSquare(2, 1);
        await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
        
        await gamePage.clickSquare(3, 0);
        await gamePage.waitForAnimations();
        
        await gamePage.expectPieceToBe({ row: 3, col: 0 }, 'red');
        await gamePage.expectCurrentPlayer('Black');
        
        // Test undo
        await gamePage.undoMove();
        await gamePage.waitForAnimations();
        
        await gamePage.expectPieceToBe({ row: 2, col: 1 }, 'red');
        await gamePage.expectCurrentPlayer('Red');
      }
    });
  });
});