import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';

test.describe('Smoke Tests', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page);
    await gamePage.goto();
  });

  test('Load the application', async () => {
    // Verify page title
    await expect(gamePage.page).toHaveTitle(/Checkers/);
    
    // Verify main elements are visible
    await expect(gamePage.gameContainer).toBeVisible();
    await expect(gamePage.settingsButton).toBeVisible();
    await expect(gamePage.newGameButton).toBeVisible();
    
    // Verify the page loads with a game in progress (default behavior)
    await expect(gamePage.board).toBeVisible();
    await expect(gamePage.gameStatus).toBeVisible();
    await expect(gamePage.gameControls).toBeVisible();
  });

  test('Start a default game', async () => {
    // Click new game button to ensure we have a fresh game
    await gamePage.startNewGame();
    
    // Verify the game board is displayed with standard 8x8 setup
    await gamePage.expectGameToBeStarted();
    await gamePage.expectBoardSize(8);
    
    // Verify initial game state
    await gamePage.expectCurrentPlayer('Red');
    await expect(gamePage.moveCount).toContainText('Move 1');
    
    // Verify no error messages
    await gamePage.expectNoErrorMessage();
    
    // Verify initial piece positions (spot check a few pieces)
    await gamePage.expectPieceToBe({ row: 0, col: 1 }, 'black');
    await gamePage.expectPieceToBe({ row: 2, col: 3 }, 'black');
    await gamePage.expectPieceToBe({ row: 5, col: 0 }, 'red');
    await gamePage.expectPieceToBe({ row: 7, col: 2 }, 'red');
    
    // Verify some squares are empty
    await gamePage.expectSquareToBeEmpty({ row: 3, col: 0 });
    await gamePage.expectSquareToBeEmpty({ row: 4, col: 1 });
  });

  test('Settings button opens configuration panel', async () => {
    // Initially config should not be visible
    await expect(gamePage.configContainer).not.toBeVisible();
    
    // Click settings button
    await gamePage.openSettings();
    
    // Verify configuration panel is visible with all expected elements
    await expect(gamePage.configContainer).toBeVisible();
    await expect(gamePage.boardSize8Radio).toBeVisible();
    await expect(gamePage.boardSize10Radio).toBeVisible();
    await expect(gamePage.showMoveHintsCheckbox).toBeVisible();
    await expect(gamePage.resetConfigButton).toBeVisible();
    await expect(gamePage.configDoneButton).toBeVisible();
    await expect(gamePage.configCloseButton).toBeVisible();
  });

  test('Configuration panel can be closed', async () => {
    // Open settings
    await gamePage.openSettings();
    await expect(gamePage.configContainer).toBeVisible();
    
    // Close settings using close button
    await gamePage.closeSettings();
    await expect(gamePage.configContainer).not.toBeVisible();
    
    // Open again and close using done button
    await gamePage.openSettings();
    await expect(gamePage.configContainer).toBeVisible();
    
    await gamePage.configDoneButton.click();
    await expect(gamePage.configContainer).not.toBeVisible();
  });

  test('Game controls are functional', async () => {
    // Start a fresh game
    await gamePage.startNewGame();
    
    // Initially undo/redo should be disabled
    await gamePage.expectUndoButtonDisabled();
    await gamePage.expectRedoButtonDisabled();
    
    // New game button should always be enabled
    await expect(gamePage.newGameButton).toBeEnabled();
    
    // Verify game controls container is visible
    await expect(gamePage.gameControls).toBeVisible();
  });

  test('Application loads without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await gamePage.goto();
    
    // Wait a moment for any async operations to complete
    await page.waitForTimeout(1000);
    
    // Verify no console errors occurred during page load
    expect(consoleErrors).toHaveLength(0);
  });

  test('Page responds to basic interaction', async () => {
    // Try clicking on a red piece (should select it)
    await gamePage.clickSquare(5, 0);
    
    // The piece should be selected (visual feedback)
    await gamePage.expectSquareToBeSelected({ row: 5, col: 0 });
    
    // Try clicking on an empty square (should deselect or move)
    await gamePage.clickSquare(4, 1);
    
    // Wait for any animations
    await gamePage.waitForAnimations();
    
    // Verify the game is still functional
    await expect(gamePage.gameStatus).toBeVisible();
    await expect(gamePage.board).toBeVisible();
  });
});