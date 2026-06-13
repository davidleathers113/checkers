import { Game } from '../../src/core/Game';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { StandardRules } from '../../src/rules/StandardRules';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';

/**
 * Rule engine that seeds a tiny board with a single forced RED capture,
 * so capture-related game state can be tested deterministically.
 */
class SingleCaptureRules extends StandardRules {
  override getInitialBoard(): Board {
    return new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(Player.RED))
      .setPiece(new Position(4, 3), new RegularPiece(Player.BLACK));
  }
}

describe('Game', () => {
  describe('undo/redo availability', () => {
    it('tracks canUndo/canRedo across a move, undo, and redo', () => {
      const game = new Game({ ruleEngine: new StandardRules() });

      expect(game.canUndo()).toBe(false);
      expect(game.canRedo()).toBe(false);

      const move = game.getAllPossibleMoves()[0]!;
      game.makeMove(move);

      expect(game.canUndo()).toBe(true);
      expect(game.canRedo()).toBe(false);

      expect(game.undoMove()).toBe(true);
      expect(game.canUndo()).toBe(false);
      expect(game.canRedo()).toBe(true);

      expect(game.redoMove()).toBe(true);
      expect(game.canUndo()).toBe(true);
      expect(game.canRedo()).toBe(false);
    });

    it('clears the redo stack once a new move is made', () => {
      const game = new Game({ ruleEngine: new StandardRules() });

      game.makeMove(game.getAllPossibleMoves()[0]!);
      game.undoMove();
      expect(game.canRedo()).toBe(true);

      game.makeMove(game.getAllPossibleMoves()[0]!);
      expect(game.canRedo()).toBe(false);
    });
  });

  describe('getGameState().capturedPieces', () => {
    it('is empty before any move', () => {
      const game = new Game({ ruleEngine: new StandardRules() });
      expect(game.getGameState().capturedPieces).toHaveLength(0);
    });

    it('reflects captured pieces after a capture, and tracks undo/redo', () => {
      const game = new Game({ ruleEngine: new SingleCaptureRules() });

      const capture = game.getAllPossibleMoves().find(m => m.isCapture());
      expect(capture).toBeDefined();

      game.makeMove(capture!);
      const captured = game.getGameState().capturedPieces;
      expect(captured).toHaveLength(1);
      expect(captured[0]!.player).toBe(Player.BLACK);

      game.undoMove();
      expect(game.getGameState().capturedPieces).toHaveLength(0);

      game.redoMove();
      expect(game.getGameState().capturedPieces).toHaveLength(1);
    });
  });
});
