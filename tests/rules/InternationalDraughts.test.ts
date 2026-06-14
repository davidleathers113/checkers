import { InternationalDraughtsRules, InternationalManPiece } from '../../examples/InternationalDraughts';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';

const RED = Player.RED;
const BLACK = Player.BLACK;

describe('International Draughts — men capture in any direction', () => {
  it('lets an International man capture backward (unlike a standard man)', () => {
    // BLACK sits behind RED at (4,4) — SE, which is backward for RED.
    const board = new Board(8)
      .setPiece(new Position(3, 3), new InternationalManPiece(RED))
      .setPiece(new Position(4, 4), new RegularPiece(BLACK));

    const caps = new InternationalManPiece(RED).getCaptureMoves(new Position(3, 3), board);
    expect(caps.length).toBeGreaterThan(0);
    expect(caps[0]!.to).toEqual(new Position(5, 5)); // landed beyond the backward capture

    // A standard man in the same position cannot capture backward.
    const standard = new RegularPiece(RED).getCaptureMoves(new Position(3, 3), board);
    expect(standard).toHaveLength(0);
  });

  it('preserves the man type across a copy (so backward captures survive a move)', () => {
    const man = new InternationalManPiece(RED);
    expect(man.copy()).toBeInstanceOf(InternationalManPiece);
  });

  it('sets up a 10x10 board of International men', () => {
    const board = new InternationalDraughtsRules().getInitialBoard();
    expect(board.size).toBe(10);
    expect(board.getPiece(new Position(0, 1))).toBeInstanceOf(InternationalManPiece);
    expect(board.getPieceCount(RED)).toBe(20);
    expect(board.getPieceCount(BLACK)).toBe(20);
  });
});
