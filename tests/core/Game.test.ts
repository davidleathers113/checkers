import { Game } from '../../src/core/Game';
import { Board } from '../../src/core/Board';
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { GameObserver } from '../../src/core/GameObserver';
import { ValidationEngine } from '../../src/strategies/ValidationEngine';
import { StandardRules } from '../../src/rules/StandardRules';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { GameOverError } from '../../src/errors';
import { Player } from '../../src/types';

/** Seeds a board where RED can move into the promotion row, with a distant
 *  BLACK piece so the game is not already over. */
class PromotionSetupRules extends StandardRules {
  override getInitialBoard(): Board {
    return new Board(8)
      .setPiece(new Position(1, 2), new RegularPiece(Player.RED))
      .setPiece(new Position(7, 0), new RegularPiece(Player.BLACK));
  }
}

function makeObserver(): GameObserver {
  return {
    onMove: jest.fn(),
    onGameEnd: jest.fn(),
    onTurnChange: jest.fn(),
    onInvalidMove: jest.fn(),
    onPiecePromoted: jest.fn(),
    onBoardUpdate: jest.fn(),
  } as unknown as GameObserver;
}

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

  describe('observers', () => {
    it('notifies observers on a move and stops after removal', () => {
      const game = new Game({ ruleEngine: new StandardRules() });
      const observer = makeObserver();
      game.addObserver(observer);

      game.makeMove(game.getAllPossibleMoves()[0]!);
      expect(observer.onMove).toHaveBeenCalledTimes(1);
      expect(observer.onBoardUpdate).toHaveBeenCalled();

      game.removeObserver(observer);
      game.makeMove(game.getAllPossibleMoves()[0]!);
      expect(observer.onMove).toHaveBeenCalledTimes(1); // unchanged after removal

      const observer2 = makeObserver();
      game.addObserver(observer2);
      game.clearObservers();
      game.makeMove(game.getAllPossibleMoves()[0]!);
      expect(observer2.onMove).not.toHaveBeenCalled();
    });

    it('notifies onInvalidMove when an illegal move is attempted', () => {
      const game = new Game({ ruleEngine: new StandardRules() });
      const observer = makeObserver();
      game.addObserver(observer);

      // A move from an empty square is illegal.
      expect(() => game.makeMove(new Move(new Position(4, 4), new Position(3, 3)))).toThrow();
      expect(observer.onInvalidMove).toHaveBeenCalled();
    });
  });

  describe('game-over guards and empty queries', () => {
    it('throws GameOverError on makeMove after the game ends', () => {
      const game = new Game({ ruleEngine: new SingleCaptureRules() });
      game.makeMove(game.getAllPossibleMoves().find(m => m.isCapture())!);
      expect(game.isGameOver()).toBe(true);

      expect(() => game.makeMove(new Move(new Position(0, 0), new Position(1, 1)))).toThrow(GameOverError);
      expect(game.getAllPossibleMoves()).toHaveLength(0);
      expect(game.getMandatoryMoves()).toHaveLength(0);
    });

    it('returns no moves for an empty square or an opponent piece', () => {
      const game = new Game({ ruleEngine: new StandardRules() });
      expect(game.getPossibleMoves(new Position(4, 4))).toHaveLength(0); // empty (current player RED)
      expect(game.getPossibleMoves(new Position(0, 1))).toHaveLength(0); // BLACK piece, not RED's turn
    });
  });

  describe('promotion via an unflagged move', () => {
    it('promotes a regular piece that reaches the back row', () => {
      const game = new Game({ ruleEngine: new PromotionSetupRules() });
      // Raw move (no isPromotion flag) onto row 0; Game must promote it.
      game.makeMove(new Move(new Position(1, 2), new Position(0, 1)));
      const piece = game.getBoard().getPiece(new Position(0, 1));
      expect(piece).not.toBeNull();
      expect(piece!.isKing()).toBe(true);
    });
  });

  describe('engine accessors', () => {
    it('gets and sets the rule engine, rejecting incompatible board states', () => {
      const game = new Game({ ruleEngine: new StandardRules() });
      expect(game.getRuleEngine()).toBeInstanceOf(StandardRules);

      const replacement = new StandardRules(8);
      game.setRuleEngine(replacement);
      expect(game.getRuleEngine()).toBe(replacement);

      // A 10x10 rule engine is invalid for the current 8x8 board.
      expect(() => game.setRuleEngine(new StandardRules(10))).toThrow();
    });

    it('gets and sets the validation engine', () => {
      const game = new Game({ ruleEngine: new StandardRules() });
      const engine = ValidationEngine.createStandard();
      game.setValidationEngine(engine);
      expect(game.getValidationEngine()).toBe(engine);
    });
  });

  describe('reset', () => {
    it('restores the initial position and clears history', () => {
      const game = new Game({ ruleEngine: new StandardRules() });
      game.makeMove(game.getAllPossibleMoves()[0]!);
      game.reset();
      expect(game.getMoveCount()).toBe(0);
      expect(game.getCurrentPlayer()).toBe(Player.RED);
      expect(game.canUndo()).toBe(false);
      expect(game.getBoard().getPieceCount(Player.RED)).toBe(12);
    });
  });
});
