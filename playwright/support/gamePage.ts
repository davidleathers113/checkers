import { type Locator, type Page, expect } from '@playwright/test';

export class GamePage {
  readonly page: Page;

  // Main game container
  readonly gameContainer: Locator;
  readonly settingsButton: Locator;
  readonly errorMessage: Locator;

  // Game configuration
  readonly configContainer: Locator;
  readonly configCloseButton: Locator;
  readonly boardSize8Radio: Locator;
  readonly boardSize10Radio: Locator;
  readonly showMoveHintsCheckbox: Locator;
  readonly resetConfigButton: Locator;
  readonly configDoneButton: Locator;
  readonly confirmDialog: Locator;
  readonly confirmCancelButton: Locator;
  readonly confirmNewGameButton: Locator;

  // Game status and controls
  readonly gameStatus: Locator;
  readonly currentPlayer: Locator;
  readonly moveCount: Locator;
  readonly gameOverMessage: Locator;
  readonly gameControls: Locator;
  readonly newGameButton: Locator;
  readonly undoButton: Locator;
  readonly redoButton: Locator;

  // Game board
  readonly board: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main elements
    this.gameContainer = page.locator('.game-container');
    this.settingsButton = page.locator('[data-testid="settings-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');

    // Configuration
    this.configContainer = page.locator('[data-testid="game-config"]');
    this.configCloseButton = page.locator('[data-testid="config-close-button"]');
    this.boardSize8Radio = page.locator('[data-testid="board-size-8"]');
    this.boardSize10Radio = page.locator('[data-testid="board-size-10"]');
    this.showMoveHintsCheckbox = page.locator('[data-testid="show-move-hints-checkbox"]');
    this.resetConfigButton = page.locator('[data-testid="reset-config-button"]');
    this.configDoneButton = page.locator('[data-testid="config-done-button"]');
    this.confirmDialog = page.locator('[data-testid="confirm-dialog"]');
    this.confirmCancelButton = page.locator('[data-testid="confirm-cancel-button"]');
    this.confirmNewGameButton = page.locator('[data-testid="confirm-new-game-button"]');

    // Status and controls
    this.gameStatus = page.locator('[data-testid="game-status"]');
    this.currentPlayer = page.locator('[data-testid="current-player"]');
    this.moveCount = page.locator('[data-testid="move-count"]');
    this.gameOverMessage = page.locator('[data-testid="game-over-message"]');
    this.gameControls = page.locator('[data-testid="game-controls"]');
    this.newGameButton = page.locator('[data-testid="new-game-button"]');
    this.undoButton = page.locator('[data-testid="undo-button"]');
    this.redoButton = page.locator('[data-testid="redo-button"]');

    // Game board
    this.board = page.locator('[data-testid="game-board"]');
  }

  // --- Navigation Actions ---

  async goto(): Promise<void> {
    await this.page.goto('/');
    // Wait for the React app to load and render
    await this.page.waitForSelector('.game-container', { timeout: 10000 });
  }

  // --- Configuration Actions ---

  async openSettings(): Promise<void> {
    await this.settingsButton.click();
    await expect(this.configContainer).toBeVisible();
  }

  async closeSettings(): Promise<void> {
    await this.configCloseButton.click();
    await expect(this.configContainer).not.toBeVisible();
  }

  async selectBoardSize(size: '8' | '10'): Promise<void> {
    if (size === '8') {
      await this.boardSize8Radio.click();
    } else {
      await this.boardSize10Radio.click();
    }
  }

  async toggleMoveHints(): Promise<void> {
    await this.showMoveHintsCheckbox.click();
  }

  async resetConfiguration(): Promise<void> {
    await this.resetConfigButton.click();
  }

  async confirmConfigurationChange(): Promise<void> {
    await expect(this.confirmDialog).toBeVisible();
    await this.confirmNewGameButton.click();
    await expect(this.confirmDialog).not.toBeVisible();
  }

  async cancelConfigurationChange(): Promise<void> {
    await expect(this.confirmDialog).toBeVisible();
    await this.confirmCancelButton.click();
    await expect(this.confirmDialog).not.toBeVisible();
  }

  // --- Game Control Actions ---

  async startNewGame(): Promise<void> {
    await this.newGameButton.click();
  }

  async undoMove(): Promise<void> {
    await this.undoButton.click();
  }

  async redoMove(): Promise<void> {
    await this.redoButton.click();
  }

  // --- Board Interaction ---

  getSquare(row: number, col: number): Locator {
    return this.page.locator(`[data-testid="game-square-${row}-${col}"]`);
  }

  getPieceOnSquare(row: number, col: number): Locator {
    return this.page.locator(`[data-testid^="game-piece-"][data-testid$="-${row}-${col}"]`);
  }

  async clickSquare(row: number, col: number): Promise<void> {
    await this.getSquare(row, col).click();
  }

  async movePiece(from: {row: number, col: number}, to: {row: number, col: number}): Promise<void> {
    const fromSquare = this.getSquare(from.row, from.col);
    const toSquare = this.getSquare(to.row, to.col);
    
    // Try drag and drop first
    try {
      await fromSquare.dragTo(toSquare);
    } catch {
      // Fallback to click-based movement
      await fromSquare.click();
      await toSquare.click();
    }
  }

  // --- Assertions ---

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async expectGameToBeStarted(): Promise<void> {
    await expect(this.board).toBeVisible();
    await expect(this.currentPlayer).toBeVisible();
    await expect(this.gameControls).toBeVisible();
  }

  async expectCurrentPlayer(player: 'Red' | 'Black'): Promise<void> {
    await expect(this.currentPlayer).toContainText(`Current Turn: ${player}`);
  }

  async expectGameOver(winner?: 'Red' | 'Black'): Promise<void> {
    await expect(this.gameOverMessage).toBeVisible();
    if (winner) {
      await expect(this.gameOverMessage).toContainText(`${winner} Wins!`);
    }
  }

  async expectPieceToBe(position: {row: number, col: number}, color: 'red' | 'black'): Promise<void> {
    const piece = this.getPieceOnSquare(position.row, position.col);
    await expect(piece).toBeVisible();
    await expect(piece).toHaveAttribute('data-testid', `game-piece-${color}-${position.row}-${position.col}`);
  }

  async expectSquareToBeEmpty(position: {row: number, col: number}): Promise<void> {
    await expect(this.getPieceOnSquare(position.row, position.col)).not.toBeVisible();
  }

  async expectSquareToBeSelected(position: {row: number, col: number}): Promise<void> {
    await expect(this.getSquare(position.row, position.col)).toHaveClass(/selected/);
  }

  async expectSquareToShowValidMove(position: {row: number, col: number}): Promise<void> {
    await expect(this.getSquare(position.row, position.col)).toHaveClass(/valid-move/);
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectNoErrorMessage(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async expectUndoButtonEnabled(): Promise<void> {
    await expect(this.undoButton).toBeEnabled();
  }

  async expectUndoButtonDisabled(): Promise<void> {
    await expect(this.undoButton).toBeDisabled();
  }

  async expectRedoButtonEnabled(): Promise<void> {
    await expect(this.redoButton).toBeEnabled();
  }

  async expectRedoButtonDisabled(): Promise<void> {
    await expect(this.redoButton).toBeDisabled();
  }

  async expectBoardSize(size: 8 | 10): Promise<void> {
    const squares = await this.board.locator('.game-square').count();
    expect(squares).toBe(size * size);
  }

  // --- Utility Methods ---

  async waitForAnimations(): Promise<void> {
    // Wait for any CSS animations to complete
    await this.page.waitForTimeout(500);
  }

  async getScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}