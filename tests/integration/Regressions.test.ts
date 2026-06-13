import { Game } from '../../src/core/Game';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { StandardRules } from '../../src/rules/StandardRules';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';

const RED = Player.RED;
const BLACK = Player.BLACK;

/**
 * Regression coverage for two bugs found by the full-playthrough simulation:
 *  1. A king's turning multi-capture (whose start and end are not on one
 *     diagonal) was generated but then rejected by validation.
 *  2. A stalemate (the player to move has pieces but no legal move) was not
 *     reported as game-over, leaving the game stuck.
 */
describe('Regressions — full-game correctness', () => {
  describe('king turning multi-capture', () => {
    // RED king at (4,4): jump NE over (3,5) to (2,6), then NW over (1,5) to (0,4).
    // The sequence turns, so from (4,4) to (0,4) is not a single diagonal.
    const board = new Board(8)
      .setPiece(new Position(4, 4), new KingPiece(RED))
      .setPiece(new Position(3, 5), new RegularPiece(BLACK))
      .setPiece(new Position(1, 5), new RegularPiece(BLACK));
    const rules = new StandardRules();

    it('is generated as a single move with two captures', () => {
      const moves = rules.getPossibleMoves(board, new Position(4, 4));
      const doubleJump = moves.find(m => m.getCaptureCount() === 2);
      expect(doubleJump).toBeDefined();
      expect(doubleJump!.to.equals(new Position(0, 4))).toBe(true);
      expect(doubleJump!.steps.length).toBe(2);
    });

    it('passes validation (generation and validation agree)', () => {
      const doubleJump = rules.getPossibleMoves(board, new Position(4, 4)).find(m => m.getCaptureCount() === 2)!;
      expect(rules.validateMove(board, doubleJump)).toBe(true);
    });

    it('applies correctly through the Game controller', () => {
      class Setup extends StandardRules {
        override getInitialBoard(): Board {
          return board;
        }
      }
      const game = new Game({ ruleEngine: new Setup() });
      const doubleJump = game.getPossibleMoves(new Position(4, 4)).find(m => m.getCaptureCount() === 2)!;
      expect(game.makeMove(doubleJump)).toBe(true);

      const after = game.getBoard();
      expect(after.getPiece(new Position(0, 4))?.isKing()).toBe(true); // king landed
      expect(after.isEmpty(new Position(3, 5))).toBe(true);            // both captured
      expect(after.isEmpty(new Position(1, 5))).toBe(true);
      expect(after.getPieceCount(BLACK)).toBe(0);
    });
  });

  describe('stalemate detection', () => {
    // RED man at (7,0) is fully blocked: its only forward square (6,1) holds a
    // BLACK piece and the capture-landing (5,2) is occupied too. RED, to move,
    // has no legal move and therefore loses.
    class Stalemate extends StandardRules {
      override getInitialBoard(): Board {
        return new Board(8)
          .setPiece(new Position(7, 0), new RegularPiece(RED))
          .setPiece(new Position(6, 1), new RegularPiece(BLACK))
          .setPiece(new Position(5, 2), new RegularPiece(BLACK));
      }
    }

    it('reports the game as over with the opponent as winner', () => {
      const game = new Game({ ruleEngine: new Stalemate() });
      expect(game.getCurrentPlayer()).toBe(RED);
      expect(game.getAllPossibleMoves()).toHaveLength(0);
      expect(game.isGameOver()).toBe(true);
      expect(game.getWinner()).toBe(BLACK);
    });
  });
});
