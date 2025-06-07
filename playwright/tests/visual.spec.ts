import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';

test.describe('Visual Regression Tests', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page);
    await gamePage.goto();
  });

  test.describe('Initial State Screenshots', () => {
    test('Initial configuration screen', async () => {
      // Take a screenshot of the initial page load
      await expect(gamePage.page).toHaveScreenshot('initial-game-state.png');
    });

    test('Settings panel appearance', async () => {
      await gamePage.openSettings();
      
      // Wait for settings panel to be fully rendered
      await expect(gamePage.configContainer).toBeVisible();
      
      // Take screenshot of settings panel
      await expect(gamePage.configContainer).toHaveScreenshot('settings-panel.png');
    });

    test('Standard 8x8 game board', async () => {
      // Ensure we have a fresh 8x8 game
      await gamePage.startNewGame();
      
      // Take screenshot of the complete game interface
      await expect(gamePage.page).toHaveScreenshot('standard-8x8-board.png');
      
      // Take screenshot of just the board
      await expect(gamePage.board).toHaveScreenshot('board-8x8-initial.png');
    });

    test('International 10x10 game board', async () => {
      // Switch to 10x10 board
      await gamePage.openSettings();
      await gamePage.selectBoardSize('10');
      await gamePage.confirmConfigurationChange();
      
      // Take screenshot of 10x10 board
      await expect(gamePage.page).toHaveScreenshot('international-10x10-board.png');
      await expect(gamePage.board).toHaveScreenshot('board-10x10-initial.png');
    });
  });

  test.describe('Game State Visual Tests', () => {
    test('Piece selection highlighting', async () => {
      // Select a red piece (Red pieces start at rows 5-7)
      await gamePage.clickSquare(5, 0);
      await gamePage.expectSquareToBeSelected({ row: 5, col: 0 });
      
      // Take screenshot showing selected piece and valid move highlights
      await expect(gamePage.board).toHaveScreenshot('piece-selected-with-hints.png');
      
      // Test without move hints
      await gamePage.openSettings();
      await gamePage.toggleMoveHints(); // Disable
      await gamePage.configDoneButton.click();
      
      await gamePage.clickSquare(5, 2); // Select different red piece
      await expect(gamePage.board).toHaveScreenshot('piece-selected-no-hints.png');
    });

    test('Mid-game board state', async () => {
      // Make several moves to create a mid-game state
      await gamePage.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
      await gamePage.waitForAnimations();
      
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.waitForAnimations();
      
      await gamePage.movePiece({ row: 2, col: 3 }, { row: 3, col: 2 });
      await gamePage.waitForAnimations();
      
      await gamePage.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 });
      await gamePage.waitForAnimations();
      
      // Take screenshot of mid-game state
      await expect(gamePage.board).toHaveScreenshot('mid-game-state.png');
      await expect(gamePage.page).toHaveScreenshot('mid-game-full-interface.png');
    });

    test('Game status display variations', async () => {
      // Test Red's turn display
      await gamePage.expectCurrentPlayer('Red');
      await expect(gamePage.gameStatus).toHaveScreenshot('status-red-turn.png');
      
      // Make a move to switch to Black's turn
      // Red pieces start at rows 5-7 and move upward (decreasing row numbers)
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.waitForAnimations();
      
      await gamePage.expectCurrentPlayer('Black');
      await expect(gamePage.gameStatus).toHaveScreenshot('status-black-turn.png');
      
      // Test move counter display
      await expect(gamePage.moveCount).toContainText('Move 2');
      await expect(gamePage.gameStatus).toHaveScreenshot('status-move-2.png');
    });

    test('Error message display', async () => {
      // Try to trigger an error message by making an invalid move
      // Note: This depends on how the application handles invalid moves
      await gamePage.clickSquare(2, 1); // Select piece
      
      // Try to move to an invalid square (this might show an error or simply not work)
      await gamePage.clickSquare(1, 1); // Invalid move
      
      // If an error message appears, capture it
      if (await gamePage.errorMessage.isVisible()) {
        await expect(gamePage.errorMessage).toHaveScreenshot('error-message.png');
      }
    });
  });

  test.describe('Theme Visual Tests', () => {
    test('Classic theme appearance', async () => {
      await gamePage.openSettings();
      const classicTheme = gamePage.page.locator('input[value="classic"]');
      await classicTheme.click();
      await gamePage.configDoneButton.click();
      
      // Take screenshots of classic theme
      await expect(gamePage.page).toHaveScreenshot('theme-classic-full.png');
      await expect(gamePage.board).toHaveScreenshot('theme-classic-board.png');
    });

    test('Modern theme appearance', async () => {
      await gamePage.openSettings();
      const modernTheme = gamePage.page.locator('input[value="modern"]');
      await modernTheme.click();
      await gamePage.configDoneButton.click();
      
      // Take screenshots of modern theme
      await expect(gamePage.page).toHaveScreenshot('theme-modern-full.png');
      await expect(gamePage.board).toHaveScreenshot('theme-modern-board.png');
    });

    test('Dark theme appearance', async () => {
      await gamePage.openSettings();
      const darkTheme = gamePage.page.locator('input[value="dark"]');
      await darkTheme.click();
      await gamePage.configDoneButton.click();
      
      // Take screenshots of dark theme
      await expect(gamePage.page).toHaveScreenshot('theme-dark-full.png');
      await expect(gamePage.board).toHaveScreenshot('theme-dark-board.png');
      
      // Test settings panel in dark theme
      await gamePage.openSettings();
      await expect(gamePage.configContainer).toHaveScreenshot('settings-panel-dark-theme.png');
    });
  });

  test.describe('Piece Visual States', () => {
    test('Regular pieces appearance', async () => {
      // Focus on specific pieces for detailed visual testing
      // Red pieces are at rows 5-7, Black pieces are at rows 0-2
      const redPiece = gamePage.getPieceOnSquare(5, 0);
      const blackPiece = gamePage.getPieceOnSquare(2, 1);
      
      await expect(redPiece).toHaveScreenshot('red-piece-regular.png');
      await expect(blackPiece).toHaveScreenshot('black-piece-regular.png');
    });

    test('King piece appearance', async () => {
      // This test assumes we can create a king piece
      // For now, we'll test the visual components we can access
      
      // Take screenshots that would show king pieces if they exist
      // This serves as a baseline for when king promotion is implemented
      await expect(gamePage.board).toHaveScreenshot('board-for-king-comparison.png');
    });

    test('Piece hover and selection states', async () => {
      // Test piece selection visual state
      // Red pieces are at rows 5-7, and Red plays first
      await gamePage.clickSquare(5, 0);
      await gamePage.expectSquareToBeSelected({ row: 5, col: 0 });
      
      const selectedSquare = gamePage.getSquare(5, 0);
      await expect(selectedSquare).toHaveScreenshot('square-selected-state.png');
      
      // Test valid move highlighting
      // From (5,0), Red can move to (4,1)
      const validMoveSquare = gamePage.getSquare(4, 1);
      await expect(validMoveSquare).toHaveScreenshot('square-valid-move-state.png');
    });
  });

  test.describe('Animation States', () => {
    test('Piece movement animation frames', async () => {
      // Slow down animations for visual testing
      await gamePage.openSettings();
      const slowAnimation = gamePage.page.locator('input[value="slow"]');
      await slowAnimation.click();
      await gamePage.configDoneButton.click();
      
      // Start a move
      await gamePage.clickSquare(2, 1);
      await gamePage.clickSquare(3, 0);
      
      // Take screenshot during animation (this might be timing-dependent)
      await gamePage.page.waitForTimeout(100); // Brief delay to catch animation
      await expect(gamePage.board).toHaveScreenshot('piece-movement-animation.png');
      
      // Wait for animation to complete
      await gamePage.waitForAnimations();
      await expect(gamePage.board).toHaveScreenshot('piece-movement-complete.png');
    });
  });

  test.describe('Mobile Visual Tests', () => {
    test('Mobile layout visual verification', async () => {
      await gamePage.page.setViewportSize({ width: 375, height: 667 });
      await gamePage.goto();
      
      // Take screenshot of mobile layout
      await expect(gamePage.page).toHaveScreenshot('mobile-layout.png');
      
      // Test mobile settings panel
      await gamePage.openSettings();
      await expect(gamePage.page).toHaveScreenshot('mobile-settings-panel.png');
    });

    test('Tablet layout visual verification', async () => {
      await gamePage.page.setViewportSize({ width: 768, height: 1024 });
      await gamePage.goto();
      
      // Take screenshot of tablet layout
      await expect(gamePage.page).toHaveScreenshot('tablet-layout.png');
    });
  });

  test.describe('Configuration Dialog Visual Tests', () => {
    test('Confirmation dialog appearance', async () => {
      await gamePage.openSettings();
      await gamePage.selectBoardSize('10');
      
      // Confirmation dialog should appear
      await expect(gamePage.confirmDialog).toBeVisible();
      await expect(gamePage.confirmDialog).toHaveScreenshot('confirmation-dialog.png');
    });

    test('Settings panel with different configurations', async () => {
      await gamePage.openSettings();
      
      // Test various configurations
      await gamePage.selectBoardSize('10');
      await gamePage.confirmConfigurationChange();
      
      await gamePage.openSettings();
      await gamePage.toggleMoveHints(); // Change move hints setting
      
      // Take screenshot of settings with different options selected
      await expect(gamePage.configContainer).toHaveScreenshot('settings-international-no-hints.png');
    });
  });

  test.describe('Cross-browser Visual Consistency', () => {
    test('Baseline visual test for regression detection', async ({ browserName }) => {
      // This test creates browser-specific baselines
      
      // Take comprehensive screenshots for each browser
      await expect(gamePage.page).toHaveScreenshot(`${browserName}-full-interface.png`);
      await expect(gamePage.board).toHaveScreenshot(`${browserName}-game-board.png`);
      
      // Test settings panel
      await gamePage.openSettings();
      await expect(gamePage.configContainer).toHaveScreenshot(`${browserName}-settings-panel.png`);
      
      // Test with piece selected
      await gamePage.configDoneButton.click();
      await gamePage.clickSquare(2, 1);
      await expect(gamePage.board).toHaveScreenshot(`${browserName}-piece-selected.png`);
    });
  });
});