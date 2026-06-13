import { KingPiece } from '../../src/pieces/KingPiece';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Player, Direction } from '../../src/types';

describe('KingPiece', () => {
  const emptyBoard = (): Board => new Board(8);

  describe('metadata', () => {
    it('reports king-specific attributes', () => {
      const king = new KingPiece(Player.RED);
      expect(king.isKing()).toBe(true);
      expect(king.getValue()).toBe(3);
      expect(king.getMaxMoveDistance()).toBe(7);
      expect(king.getMoveDirections()).toHaveLength(4);
      expect(king.canCaptureInDirection(Direction.NORTH_WEST)).toBe(true);
      expect(king.canCaptureInDirection(Direction.SOUTH_EAST)).toBe(true);
    });

    it('renders the correct symbol per player', () => {
      expect(new KingPiece(Player.RED).getSymbol()).toBe('R');
      expect(new KingPiece(Player.BLACK).getSymbol()).toBe('B');
    });

    it('copies preserving identity and stays a king when promoted', () => {
      const king = new KingPiece(Player.BLACK);
      const copy = king.copy();
      expect(copy).toBeInstanceOf(KingPiece);
      expect(copy.player).toBe(Player.BLACK);
      expect(copy.getId()).toBe(king.getId());
      expect(king.promote()).toBe(king);
    });
  });

  describe('canMove', () => {
    it('rejects non-diagonal and occupied destinations', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard()
        .setPiece(new Position(4, 4), king)
        .setPiece(new Position(2, 2), new RegularPiece(Player.RED));

      expect(king.canMove(new Position(4, 4), new Position(4, 6), board)).toBe(false); // not diagonal
      expect(king.canMove(new Position(4, 4), new Position(2, 2), board)).toBe(false); // occupied
    });

    it('allows long diagonal moves over a clear path', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard().setPiece(new Position(4, 4), king);
      expect(king.canMove(new Position(4, 4), new Position(7, 7), board)).toBe(true);
      expect(king.canMove(new Position(4, 4), new Position(1, 1), board)).toBe(true);
    });

    it('allows a move that jumps exactly one opponent', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard()
        .setPiece(new Position(4, 4), king)
        .setPiece(new Position(5, 5), new RegularPiece(Player.BLACK));
      // (6,6) empty landing beyond the single opponent at (5,5)
      expect(king.canMove(new Position(4, 4), new Position(7, 7), board)).toBe(true);
    });

    it('rejects a move blocked by two pieces in the path', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard()
        .setPiece(new Position(4, 4), king)
        .setPiece(new Position(5, 5), new RegularPiece(Player.BLACK))
        .setPiece(new Position(6, 6), new RegularPiece(Player.BLACK));
      expect(king.canMove(new Position(4, 4), new Position(7, 7), board)).toBe(false);
    });
  });

  describe('getPossibleMoves', () => {
    it('returns long-range moves in all four directions on an empty board', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard().setPiece(new Position(4, 4), king);
      const moves = king.getPossibleMoves(new Position(4, 4), board);
      expect(moves.length).toBeGreaterThan(4);
      expect(moves.some(p => p.equals(new Position(7, 7)))).toBe(true);
      expect(moves.some(p => p.equals(new Position(1, 1)))).toBe(true);
    });

    it('stops a direction at the first blocking piece', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard()
        .setPiece(new Position(4, 4), king)
        .setPiece(new Position(6, 6), new RegularPiece(Player.BLACK));
      const moves = king.getPossibleMoves(new Position(4, 4), board);
      // (5,5) reachable, (6,6) blocked, (7,7) unreachable past the blocker
      expect(moves.some(p => p.equals(new Position(5, 5)))).toBe(true);
      expect(moves.some(p => p.equals(new Position(7, 7)))).toBe(false);
    });
  });

  describe('getCaptureMoves', () => {
    it('finds a flying capture landing beyond a single opponent', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard()
        .setPiece(new Position(2, 2), king)
        .setPiece(new Position(4, 4), new RegularPiece(Player.BLACK));
      const captures = king.getCaptureMoves(new Position(2, 2), board);
      expect(captures.length).toBeGreaterThan(0);
      expect(captures.every(m => m.captures.length >= 1)).toBe(true);
      // can land on either empty square beyond the captured piece
      expect(captures.some(m => m.to.equals(new Position(5, 5)) || m.to.equals(new Position(6, 6)))).toBe(true);
    });

    it('finds multi-capture sequences', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard()
        .setPiece(new Position(1, 1), king)
        .setPiece(new Position(2, 2), new RegularPiece(Player.BLACK))
        .setPiece(new Position(4, 4), new RegularPiece(Player.BLACK));
      const captures = king.getCaptureMoves(new Position(1, 1), board);
      const multi = captures.find(m => m.captures.length >= 2);
      expect(multi).toBeDefined();
    });

    it('returns no captures when there is nothing to jump', () => {
      const king = new KingPiece(Player.RED);
      const board = emptyBoard().setPiece(new Position(4, 4), king);
      expect(king.getCaptureMoves(new Position(4, 4), board)).toHaveLength(0);
    });
  });
});
