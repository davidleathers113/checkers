import { Move } from '../../src/core/Move';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';

describe('Move factories and helpers', () => {
  describe('isValidDistance', () => {
    it('is true for a one-square non-capture and a two-square capture', () => {
      expect(new Move(new Position(3, 3), new Position(2, 4)).isValidDistance()).toBe(true);
      expect(new Move(new Position(3, 3), new Position(5, 5), [new Position(4, 4)]).isValidDistance()).toBe(true);
    });

    it('is false for other distances', () => {
      expect(new Move(new Position(3, 3), new Position(0, 0)).isValidDistance()).toBe(false);
    });
  });

  describe('equals', () => {
    it('distinguishes moves with differently ordered captures', () => {
      const a = new Move(new Position(0, 0), new Position(4, 4), [new Position(1, 1), new Position(3, 3)]);
      const b = new Move(new Position(0, 0), new Position(4, 4), [new Position(3, 3), new Position(1, 1)]);
      expect(a.equals(b)).toBe(false);
      expect(a.equals(null)).toBe(false);
      expect(a.equals(a)).toBe(true);
    });
  });

  describe('createMultiCapture', () => {
    it('builds a multi-step capture from positions and captures', () => {
      const move = Move.createMultiCapture(
        [new Position(5, 2), new Position(3, 4), new Position(1, 6)],
        [new Position(4, 3), new Position(2, 5)]
      );
      expect(move.from.equals(new Position(5, 2))).toBe(true);
      expect(move.to.equals(new Position(1, 6))).toBe(true);
      expect(move.captures).toHaveLength(2);
      expect(move.steps).toHaveLength(2);
    });

    it('throws when fewer than two positions are given', () => {
      expect(() => Move.createMultiCapture([new Position(5, 2)], [])).toThrow();
    });
  });

  describe('createMultiStep', () => {
    it('derives endpoints and captures from steps', () => {
      const move = Move.createMultiStep([
        { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
        { from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) },
      ]);
      expect(move.captures).toHaveLength(2);
      expect(move.to.equals(new Position(1, 6))).toBe(true);
    });

    it('throws when given no steps', () => {
      expect(() => Move.createMultiStep([])).toThrow();
    });
  });

  describe('getIntermediatePositions', () => {
    it('returns the squares between endpoints for a simple move', () => {
      const move = new Move(new Position(2, 2), new Position(5, 5));
      expect(move.getIntermediatePositions().length).toBeGreaterThan(0);
    });

    it('returns an empty array for multi-captures', () => {
      const move = new Move(new Position(0, 0), new Position(4, 4), [new Position(1, 1), new Position(3, 3)]);
      expect(move.getIntermediatePositions()).toHaveLength(0);
    });
  });

  describe('fromString', () => {
    it('throws on malformed notation', () => {
      expect(() => Move.fromString('garbage')).toThrow();
    });
  });

  describe('apply with promotion on a multi-step move', () => {
    it('promotes the piece at the final square', () => {
      const board = new Board(8)
        .setPiece(new Position(4, 1), new RegularPiece(Player.RED))
        .setPiece(new Position(3, 2), new RegularPiece(Player.BLACK))
        .setPiece(new Position(1, 2), new RegularPiece(Player.BLACK));
      const move = new Move(
        new Position(4, 1),
        new Position(0, 1),
        [new Position(3, 2), new Position(1, 2)],
        true,
        [
          { from: new Position(4, 1), to: new Position(2, 3), captured: new Position(3, 2) },
          { from: new Position(2, 3), to: new Position(0, 1), captured: new Position(1, 2) },
        ]
      );
      const result = move.apply(board);
      const promoted = result.getPiece(new Position(0, 1));
      expect(promoted).not.toBeNull();
      expect(promoted!.isKing()).toBe(true);
      expect(result.isEmpty(new Position(3, 2))).toBe(true);
      expect(result.isEmpty(new Position(1, 2))).toBe(true);
    });
  });
});
