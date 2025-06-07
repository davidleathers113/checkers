import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';

test.describe('Game Configuration', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page);
    await gamePage.goto();
  });

  test.describe('Board Size Configuration', () => {
    test('Start a 10x10 International Draughts game', async () => {
      // Open settings
      await gamePage.openSettings();
      
      // Select 10x10 board size
      await gamePage.selectBoardSize('10');
      
      // Should show confirmation dialog for board size change
      await gamePage.confirmConfigurationChange();
      
      // Verify 10x10 board is rendered
      await gamePage.expectBoardSize(10);
      
      // Verify piece count and setup are correct for 10x10
      // In 10x10 International Draughts, each player starts with 20 pieces
      const redPieces = await gamePage.page.locator('[data-testid^="game-piece-red-"]').count();
      const blackPieces = await gamePage.page.locator('[data-testid^="game-piece-black-"]').count();
      
      expect(redPieces).toBe(20);
      expect(blackPieces).toBe(20);
      
      // Verify initial positions for 10x10 board (spot check)
      await gamePage.expectPieceToBe({ row: 0, col: 1 }, 'red');
      await gamePage.expectPieceToBe({ row: 3, col: 8 }, 'red');
      await gamePage.expectPieceToBe({ row: 6, col: 1 }, 'black');
      await gamePage.expectPieceToBe({ row: 9, col: 8 }, 'black');
    });

    test('Board size change requires confirmation', async () => {
      // Start with default 8x8 game
      await gamePage.expectBoardSize(8);
      
      // Open settings
      await gamePage.openSettings();
      
      // Select 10x10 board size
      await gamePage.selectBoardSize('10');
      
      // Should show confirmation dialog
      await expect(gamePage.confirmDialog).toBeVisible();
      await expect(gamePage.confirmDialog).toContainText('start a new game');
      
      // Cancel the change
      await gamePage.cancelConfigurationChange();
      
      // Should still be 8x8
      await gamePage.expectBoardSize(8);
      
      // Try again and confirm
      await gamePage.openSettings();
      await gamePage.selectBoardSize('10');
      await gamePage.confirmConfigurationChange();
      
      // Now should be 10x10
      await gamePage.expectBoardSize(10);
    });

    test('Switch back to 8x8 from 10x10', async () => {
      // Start with 10x10
      await gamePage.openSettings();
      await gamePage.selectBoardSize('10');
      await gamePage.confirmConfigurationChange();
      await gamePage.expectBoardSize(10);
      
      // Switch back to 8x8
      await gamePage.openSettings();
      await gamePage.selectBoardSize('8');
      await gamePage.confirmConfigurationChange();
      
      // Verify 8x8 board and piece count
      await gamePage.expectBoardSize(8);
      
      const redPieces = await gamePage.page.locator('[data-testid^="game-piece-red-"]').count();
      const blackPieces = await gamePage.page.locator('[data-testid^="game-piece-black-"]').count();
      
      expect(redPieces).toBe(12);
      expect(blackPieces).toBe(12);
    });
  });

  test.describe('Move Hints Configuration', () => {
    test('Enable move hints shows valid moves', async () => {
      // Open settings and enable move hints
      await gamePage.openSettings();
      await gamePage.toggleMoveHints(); // Enable if not already enabled
      await gamePage.configDoneButton.click();
      
      // Click on a piece to select it
      await gamePage.clickSquare(2, 1);
      await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
      
      // Valid move squares should be highlighted
      await gamePage.expectSquareToShowValidMove({ row: 3, col: 0 });
      await gamePage.expectSquareToShowValidMove({ row: 3, col: 2 });
    });

    test('Disable move hints hides valid move indicators', async () => {
      // First enable move hints
      await gamePage.openSettings();
      await expect(gamePage.showMoveHintsCheckbox).toBeChecked(); // Should be enabled by default
      
      // Disable move hints
      await gamePage.toggleMoveHints();
      await expect(gamePage.showMoveHintsCheckbox).not.toBeChecked();
      await gamePage.configDoneButton.click();
      
      // Click on a piece to select it
      await gamePage.clickSquare(2, 1);
      await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
      
      // Valid move squares should NOT be highlighted
      const validMoveSquares = gamePage.page.locator('.game-square.valid-move');
      await expect(validMoveSquares).toHaveCount(0);
    });

    test('Move hints toggle persists across games', async () => {
      // Disable move hints
      await gamePage.openSettings();
      await gamePage.toggleMoveHints(); // Disable
      await expect(gamePage.showMoveHintsCheckbox).not.toBeChecked();
      await gamePage.configDoneButton.click();
      
      // Start a new game
      await gamePage.startNewGame();
      
      // Check that move hints are still disabled
      await gamePage.clickSquare(2, 1);
      const validMoveSquares = gamePage.page.locator('.game-square.valid-move');
      await expect(validMoveSquares).toHaveCount(0);
      
      // Verify in settings that it's still disabled
      await gamePage.openSettings();
      await expect(gamePage.showMoveHintsCheckbox).not.toBeChecked();
    });
  });

  test.describe('Configuration Reset', () => {
    test('Reset to defaults restores original settings', async () => {
      // Change multiple settings
      await gamePage.openSettings();
      
      // Change board size to 10x10
      await gamePage.selectBoardSize('10');
      await gamePage.confirmConfigurationChange();
      
      // Disable move hints
      await gamePage.openSettings();
      await gamePage.toggleMoveHints(); // Disable
      await gamePage.configDoneButton.click();
      
      // Verify changes took effect
      await gamePage.expectBoardSize(10);
      await gamePage.clickSquare(2, 1);
      const validMoveSquares = gamePage.page.locator('.game-square.valid-move');
      await expect(validMoveSquares).toHaveCount(0);
      
      // Reset to defaults
      await gamePage.openSettings();
      await gamePage.resetConfiguration();
      
      // Should show confirmation for board size change back to 8x8
      await gamePage.confirmConfigurationChange();
      
      // Verify defaults are restored
      await gamePage.expectBoardSize(8);
      
      // Check that move hints are enabled again
      await gamePage.clickSquare(2, 1);
      await gamePage.expectSquareToShowValidMove({ row: 3, col: 0 });
      
      // Verify in settings
      await gamePage.openSettings();
      await expect(gamePage.boardSize8Radio).toBeChecked();
      await expect(gamePage.showMoveHintsCheckbox).toBeChecked();
    });
  });

  test.describe('Theme Configuration', () => {
    test('Theme selection changes visual appearance', async () => {
      // Open settings
      await gamePage.openSettings();
      
      // Check that theme options are available
      const classicTheme = gamePage.page.locator('input[value="classic"]');
      const modernTheme = gamePage.page.locator('input[value="modern"]');
      const darkTheme = gamePage.page.locator('input[value="dark"]');
      
      await expect(classicTheme).toBeVisible();
      await expect(modernTheme).toBeVisible();
      await expect(darkTheme).toBeVisible();
      
      // Select dark theme
      await darkTheme.click();
      await gamePage.configDoneButton.click();
      
      // Verify theme class is applied to app container
      const appContainer = gamePage.page.locator('.app-container');
      await expect(appContainer).toHaveClass(/theme-dark/);
      
      // Select modern theme
      await gamePage.openSettings();
      await modernTheme.click();
      await gamePage.configDoneButton.click();
      
      // Verify theme changed
      await expect(appContainer).toHaveClass(/theme-modern/);
    });
  });

  test.describe('Animation Speed Configuration', () => {
    test('Animation speed options are available', async () => {
      await gamePage.openSettings();
      
      // Check that animation speed options exist
      const slowAnimation = gamePage.page.locator('input[value="slow"]');
      const normalAnimation = gamePage.page.locator('input[value="normal"]');
      const fastAnimation = gamePage.page.locator('input[value="fast"]');
      
      await expect(slowAnimation).toBeVisible();
      await expect(normalAnimation).toBeVisible();
      await expect(fastAnimation).toBeVisible();
      
      // Test that we can select different speeds
      await fastAnimation.click();
      await expect(fastAnimation).toBeChecked();
      
      await slowAnimation.click();
      await expect(slowAnimation).toBeChecked();
      
      await gamePage.configDoneButton.click();
    });
  });

  test.describe('Rule Set Configuration', () => {
    test('Standard Checkers is default rule set', async () => {
      await gamePage.openSettings();
      
      const standardRules = gamePage.page.locator('input[value="standard"]');
      await expect(standardRules).toBeChecked();
      
      // Verify 8x8 board is selected for standard rules
      await expect(gamePage.boardSize8Radio).toBeChecked();
    });

    test('International Draughts requires 10x10 board', async () => {
      await gamePage.openSettings();
      
      // Select International Draughts
      const internationalRules = gamePage.page.locator('input[value="international"]');
      await internationalRules.click();
      
      // Should automatically select 10x10 board and show confirmation
      await gamePage.confirmConfigurationChange();
      
      // Verify 10x10 board is now selected
      await gamePage.expectBoardSize(10);
      
      // Check settings show correct selections
      await gamePage.openSettings();
      await expect(internationalRules).toBeChecked();
      await expect(gamePage.boardSize10Radio).toBeChecked();
    });

    test('Crazy Checkers rule set can be selected', async () => {
      await gamePage.openSettings();
      
      const crazyRules = gamePage.page.locator('input[value="crazy"]');
      await expect(crazyRules).toBeVisible();
      
      await crazyRules.click();
      
      // Should show confirmation for rule change
      await gamePage.confirmConfigurationChange();
      
      // Verify rule set is selected
      await gamePage.openSettings();
      await expect(crazyRules).toBeChecked();
    });
  });

  test.describe('Configuration Persistence', () => {
    test('Settings persist after page reload', async () => {
      // Change settings
      await gamePage.openSettings();
      await gamePage.selectBoardSize('10');
      await gamePage.confirmConfigurationChange();
      
      await gamePage.openSettings();
      await gamePage.toggleMoveHints(); // Disable
      await gamePage.configDoneButton.click();
      
      // Reload the page
      await gamePage.page.reload();
      
      // Verify settings persisted
      await gamePage.expectBoardSize(10);
      
      await gamePage.openSettings();
      await expect(gamePage.boardSize10Radio).toBeChecked();
      await expect(gamePage.showMoveHintsCheckbox).not.toBeChecked();
    });
  });
});