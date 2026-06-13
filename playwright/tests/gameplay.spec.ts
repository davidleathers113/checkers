import { test, expect } from '@playwright/test';
import { GamePage } from '../support/gamePage';

/**
 * Board orientation (matches the app): BLACK occupies the top rows (0-2), RED
 * the bottom rows (5-7), and RED moves first.
 */
test.describe('Gameplay Scenarios', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem('checkers-game-config', JSON.stringify({ sound: false }))
    );
    gamePage = new GamePage(page);
    await gamePage.goto();
  });

  test.describe('Basic moves', () => {
    test('Red makes a valid opening move', async () => {
      await gamePage.expectCurrentPlayer('Red');
      await gamePage.clickSquare(5, 0);
      await gamePage.expectSquareToBeSelected({ row: 5, col: 0 });
      await gamePage.clickSquare(4, 1);

      await gamePage.expectSquareToBeEmpty({ row: 5, col: 0 });
      await gamePage.expectPieceToBe({ row: 4, col: 1 }, 'red');
      await gamePage.expectCurrentPlayer('Black');
      await expect(gamePage.moveCount).toContainText('Move 2');
    });

    test('Black responds with a valid move', async () => {
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.expectCurrentPlayer('Black');

      await gamePage.clickSquare(2, 1);
      await gamePage.expectSquareToBeSelected({ row: 2, col: 1 });
      await gamePage.clickSquare(3, 0);

      await gamePage.expectPieceToBe({ row: 3, col: 0 }, 'black');
      await gamePage.expectCurrentPlayer('Red');
      await expect(gamePage.moveCount).toContainText('Move 3');
    });

    test('cannot select the opponent\'s pieces', async () => {
      await gamePage.clickSquare(2, 1); // a Black piece, on Red's turn
      await expect(gamePage.getSquare(2, 1)).not.toHaveClass(/selected/);
      await gamePage.expectCurrentPlayer('Red');
    });

    test('cannot move on the opponent\'s turn', async () => {
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.expectCurrentPlayer('Black');

      await gamePage.clickSquare(5, 2); // a Red piece, but it is Black's turn
      await expect(gamePage.getSquare(5, 2)).not.toHaveClass(/selected/);
      await gamePage.expectCurrentPlayer('Black');
    });

    test('an invalid target deselects without moving', async () => {
      await gamePage.clickSquare(5, 0);
      await gamePage.expectSquareToBeSelected({ row: 5, col: 0 });

      await gamePage.clickSquare(4, 3); // empty, but not a legal target for (5,0)
      await gamePage.expectPieceToBe({ row: 5, col: 0 }, 'red');
      await gamePage.expectCurrentPlayer('Red');

      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.expectPieceToBe({ row: 4, col: 1 }, 'red');
      await gamePage.expectCurrentPlayer('Black');
    });

    test('a piece can be moved by dragging', async () => {
      await gamePage.dragPiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.expectPieceToBe({ row: 4, col: 1 }, 'red');
      await gamePage.expectSquareToBeEmpty({ row: 5, col: 0 });
    });
  });

  test.describe('Captures', () => {
    test('captures an opponent piece and flags the mandatory jump', async () => {
      await gamePage.movePiece({ row: 5, col: 2 }, { row: 4, col: 3 }); // red advances
      await gamePage.movePiece({ row: 2, col: 5 }, { row: 3, col: 4 }); // black sets up the jump

      await expect(gamePage.captureAlert).toBeVisible(); // Red must jump

      await gamePage.movePiece({ row: 4, col: 3 }, { row: 2, col: 5 }); // jump over (3,4)
      await gamePage.expectSquareToBeEmpty({ row: 3, col: 4 });
      await gamePage.expectPieceToBe({ row: 2, col: 5 }, 'red');
      await expect(gamePage.moveCount).toContainText('Move 4');
    });
  });

  test.describe('New game', () => {
    test('New Game resets the board to the start', async () => {
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await expect(gamePage.moveCount).toContainText('Move 2');

      await gamePage.startNewGame();
      await expect(gamePage.moveCount).toContainText('Move 1');
      await gamePage.expectCurrentPlayer('Red');
      await gamePage.expectPieceToBe({ row: 0, col: 1 }, 'black');
      await gamePage.expectPieceToBe({ row: 5, col: 0 }, 'red');
      await gamePage.expectSquareToBeEmpty({ row: 4, col: 1 });
    });
  });

  test.describe('Undo / Redo', () => {
    test('undo reverts the last move', async () => {
      await gamePage.expectUndoButtonDisabled();
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.expectUndoButtonEnabled();

      await gamePage.undoMove();
      await gamePage.expectPieceToBe({ row: 5, col: 0 }, 'red');
      await gamePage.expectSquareToBeEmpty({ row: 4, col: 1 });
      await gamePage.expectCurrentPlayer('Red');
      await expect(gamePage.moveCount).toContainText('Move 1');
    });

    test('redo re-applies an undone move', async () => {
      await gamePage.expectRedoButtonDisabled();
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
      await gamePage.undoMove();
      await gamePage.expectRedoButtonEnabled();

      await gamePage.redoMove();
      await gamePage.expectPieceToBe({ row: 4, col: 1 }, 'red');
      await gamePage.expectSquareToBeEmpty({ row: 5, col: 0 });
      await gamePage.expectCurrentPlayer('Black');
      await expect(gamePage.moveCount).toContainText('Move 2');
    });

    test('undo across multiple moves', async () => {
      await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 }); // red
      await gamePage.movePiece({ row: 2, col: 1 }, { row: 3, col: 2 }); // black
      await gamePage.movePiece({ row: 5, col: 4 }, { row: 4, col: 5 }); // red
      await expect(gamePage.moveCount).toContainText('Move 4');

      await gamePage.undoMove();
      await gamePage.undoMove();
      await expect(gamePage.moveCount).toContainText('Move 2');
      await gamePage.expectPieceToBe({ row: 4, col: 1 }, 'red');   // first move stands
      await gamePage.expectPieceToBe({ row: 2, col: 1 }, 'black');  // second move undone
      await gamePage.expectSquareToBeEmpty({ row: 4, col: 5 });     // third move undone
    });
  });
});
