import { JumpOwnRules } from '../../src/rules/JumpOwnRules';
import { Game } from '../../src/core/Game';
import { Board } from '../../src/core/Board';
import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';

const RED = Player.RED;
const BLACK = Player.BLACK;

/** Convenience: does a move list contain a (from,to) pair? */
function hasMove(moves: Move[], from: Position, to: Position): boolean {
  return moves.some(m => m.from.equals(from) && m.to.equals(to));
}

describe('JumpOwnRules — hop over your own man', () => {
  const rules = new JumpOwnRules();

  describe('regular pieces', () => {
    it('offers a forward hop over an adjacent own piece into the empty square beyond', () => {
      const board = new Board(8)
        .setPiece(new Position(5, 2), new RegularPiece(RED))
        .setPiece(new Position(4, 3), new RegularPiece(RED)); // own piece to hop (NE)

      const moves = rules.getPossibleMoves(board, new Position(5, 2));
      expect(hasMove(moves, new Position(5, 2), new Position(3, 4))).toBe(true);

      const hop = new Move(new Position(5, 2), new Position(3, 4), []);
      expect(rules.validateMove(board, hop)).toBe(true);
    });

    it('does not remove the hopped piece when the move is applied', () => {
      const board = new Board(8)
        .setPiece(new Position(5, 2), new RegularPiece(RED))
        .setPiece(new Position(4, 3), new RegularPiece(RED));
      const after = new Move(new Position(5, 2), new Position(3, 4), []).apply(board);

      expect(after.isEmpty(new Position(5, 2))).toBe(true);              // moved away
      expect(after.getPiece(new Position(3, 4))?.player).toBe(RED);      // landed
      expect(after.getPiece(new Position(4, 3))?.player).toBe(RED);      // hopped piece stays
    });

    it('does not let a regular piece hop backward', () => {
      const board = new Board(8)
        .setPiece(new Position(3, 3), new RegularPiece(RED))
        .setPiece(new Position(4, 4), new RegularPiece(RED)); // behind RED (SE)
      const moves = rules.getPossibleMoves(board, new Position(3, 3));
      expect(hasMove(moves, new Position(3, 3), new Position(5, 5))).toBe(false);
      expect(rules.validateMove(board, new Move(new Position(3, 3), new Position(5, 5), []))).toBe(false);
    });

    it('does not offer a hop when the landing square is occupied', () => {
      const board = new Board(8)
        .setPiece(new Position(5, 2), new RegularPiece(RED))
        .setPiece(new Position(4, 3), new RegularPiece(RED))
        .setPiece(new Position(3, 4), new RegularPiece(RED)); // landing blocked
      const moves = rules.getPossibleMoves(board, new Position(5, 2));
      expect(hasMove(moves, new Position(5, 2), new Position(3, 4))).toBe(false);
    });

    it('chains hops over several own pieces in one turn', () => {
      const board = new Board(8)
        .setPiece(new Position(6, 1), new RegularPiece(RED))
        .setPiece(new Position(5, 2), new RegularPiece(RED))
        .setPiece(new Position(3, 4), new RegularPiece(RED));
      // (6,1) hops (5,2) -> (4,3); from (4,3) hops (3,4) -> (2,5)
      const moves = rules.getPossibleMoves(board, new Position(6, 1));
      expect(hasMove(moves, new Position(6, 1), new Position(4, 3))).toBe(true);
      expect(hasMove(moves, new Position(6, 1), new Position(2, 5))).toBe(true);
    });

    it('promotes when a hop lands on the back row', () => {
      const board = new Board(8)
        .setPiece(new Position(2, 1), new RegularPiece(RED))
        .setPiece(new Position(1, 2), new RegularPiece(RED));
      const moves = rules.getPossibleMoves(board, new Position(2, 1));
      const hop = moves.find(m => m.to.equals(new Position(0, 3)));
      expect(hop).toBeDefined();
      expect(hop!.isPromotion).toBe(true);

      const after = hop!.apply(board);
      expect(after.getPiece(new Position(0, 3))?.isKing()).toBe(true);
    });
  });

  describe('interaction with captures', () => {
    it('treats an adjacent opponent as a normal capture, not a hop', () => {
      const board = new Board(8)
        .setPiece(new Position(5, 2), new RegularPiece(RED))
        .setPiece(new Position(4, 3), new RegularPiece(BLACK)); // opponent
      const moves = rules.getPossibleMoves(board, new Position(5, 2));
      // The move to (3,4) exists but as a capture (removes the opponent), not a no-capture hop.
      const toLanding = moves.find(m => m.to.equals(new Position(3, 4)));
      expect(toLanding).toBeDefined();
      expect(toLanding!.isCapture()).toBe(true);
      // A non-capturing "hop" over the opponent must be rejected.
      expect(rules.validateMove(board, new Move(new Position(5, 2), new Position(3, 4), []))).toBe(false);
    });

    it('suppresses hops while a mandatory opponent capture is available', () => {
      const board = new Board(8)
        .setPiece(new Position(5, 2), new RegularPiece(RED))
        .setPiece(new Position(4, 3), new RegularPiece(RED)) // would enable a hop
        .setPiece(new Position(5, 6), new RegularPiece(RED))
        .setPiece(new Position(4, 5), new RegularPiece(BLACK)); // forces a capture by (5,6)
      const moves = rules.getPossibleMoves(board, new Position(5, 2));
      expect(hasMove(moves, new Position(5, 2), new Position(3, 4))).toBe(false);
      expect(rules.validateMove(board, new Move(new Position(5, 2), new Position(3, 4), []))).toBe(false);
    });
  });

  describe('hop then capture (mixed sequences)', () => {
    it('lets a piece hop its own man and then capture an opponent in one turn', () => {
      const board = new Board(8)
        .setPiece(new Position(6, 1), new RegularPiece(RED)) // mover
        .setPiece(new Position(5, 2), new RegularPiece(RED)) // own piece to hop (NE)
        .setPiece(new Position(3, 4), new RegularPiece(BLACK)); // opponent beyond the hop landing

      // No direct capture exists, so hops are allowed.
      const moves = rules.getPossibleMoves(board, new Position(6, 1));

      // The bare hop is still offered...
      expect(hasMove(moves, new Position(6, 1), new Position(4, 3))).toBe(true);

      // ...and so is the chained hop-then-capture: hop (6,1)->(4,3), then jump
      // the BLACK at (3,4) landing on (2,5).
      const combo = moves.find(m => m.to.equals(new Position(2, 5)));
      expect(combo).toBeDefined();
      expect(combo!.isCapture()).toBe(true);
      expect(combo!.captures.some(c => c.equals(new Position(3, 4)))).toBe(true);
      expect(rules.validateMove(board, combo!)).toBe(true);

      const after = combo!.apply(board);
      expect(after.getPiece(new Position(2, 5))?.player).toBe(RED); // landed
      expect(after.isEmpty(new Position(6, 1))).toBe(true); // moved away
      expect(after.getPiece(new Position(5, 2))?.player).toBe(RED); // hopped own man stays
      expect(after.isEmpty(new Position(3, 4))).toBe(true); // opponent captured
    });

    it('chains a hop into a multi-capture (hop, capture, capture)', () => {
      const board = new Board(8)
        .setPiece(new Position(6, 1), new RegularPiece(RED)) // mover
        .setPiece(new Position(5, 2), new RegularPiece(RED)) // own piece to hop (NE)
        .setPiece(new Position(3, 4), new RegularPiece(BLACK)) // first capture
        .setPiece(new Position(1, 4), new RegularPiece(BLACK)); // second capture

      // hop (6,1)->(4,3), capture (3,4)->(2,5), capture (1,4)->(0,3).
      const moves = rules.getPossibleMoves(board, new Position(6, 1));
      const full = moves.find(m => m.to.equals(new Position(0, 3)));
      expect(full).toBeDefined();
      expect(full!.captures).toHaveLength(2);

      const after = full!.apply(board);
      expect(after.getPiece(new Position(0, 3))?.player).toBe(RED);
      expect(after.getPiece(new Position(5, 2))?.player).toBe(RED); // hopped own stays
      expect(after.isEmpty(new Position(3, 4))).toBe(true);
      expect(after.isEmpty(new Position(1, 4))).toBe(true);
    });

    it('offers nothing for a piece that cannot reach any capture while a jump is mandatory', () => {
      const board = new Board(8)
        .setPiece(new Position(6, 1), new RegularPiece(RED))
        .setPiece(new Position(5, 2), new RegularPiece(RED)) // (6,1) could hop this, but...
        .setPiece(new Position(5, 6), new RegularPiece(RED))
        .setPiece(new Position(4, 5), new RegularPiece(BLACK)); // (5,6)x(4,5)->(3,4) is forced
      // (6,1) can only make a pure hop, which reaches no capture — so while a
      // jump is mandatory it offers nothing (a pure hop/slide is not allowed).
      const moves = rules.getPossibleMoves(board, new Position(6, 1));
      expect(moves).toHaveLength(0);
    });

    it('lets a different piece satisfy a forced jump by hopping its own man first', () => {
      // (5,0) has a direct capture, so a jump is mandatory. (6,3) has no direct
      // capture, but can hop its own man at (5,4) to (4,5) and then jump the
      // BLACK at (3,6). That hop-then-capture must be offered (not locked out).
      const board = new Board(8)
        .setPiece(new Position(5, 0), new RegularPiece(RED)) // forces the jump (x(4,1)->(3,2))
        .setPiece(new Position(4, 1), new RegularPiece(BLACK))
        .setPiece(new Position(6, 3), new RegularPiece(RED)) // reaches a capture via a hop
        .setPiece(new Position(5, 4), new RegularPiece(RED)) // own man to hop over (NE)
        .setPiece(new Position(3, 6), new RegularPiece(BLACK)); // captured after the hop

      const moves = rules.getPossibleMoves(board, new Position(6, 3));
      const combo = moves.find(m => m.to.equals(new Position(2, 7)));
      expect(combo).toBeDefined();
      expect(combo!.captures.some(c => c.equals(new Position(3, 6)))).toBe(true);
      expect(rules.validateMove(board, combo!)).toBe(true);
    });

    it('does not let a regular man capture backward (only kings may)', () => {
      // BLACK sits behind RED (SE = backward for RED). No capture should exist.
      const board = new Board(8)
        .setPiece(new Position(3, 3), new RegularPiece(RED))
        .setPiece(new Position(4, 4), new RegularPiece(BLACK))
        .setPiece(new Position(2, 7), new RegularPiece(BLACK)); // keeps the game live
      const moves = rules.getPossibleMoves(board, new Position(3, 3));
      expect(moves.some(m => m.isCapture())).toBe(false);
      // A king in the same spot may capture backward.
      const kingBoard = board.setPiece(new Position(3, 3), new KingPiece(RED));
      const kingMoves = rules.getPossibleMoves(kingBoard, new Position(3, 3));
      expect(kingMoves.some(m => m.isCapture() && m.captures.some(c => c.equals(new Position(4, 4))))).toBe(true);
    });

    it('lets a king hop its own man flying-style and then capture an opponent', () => {
      const board = new Board(8)
        .setPiece(new Position(5, 2), new KingPiece(RED)) // mover
        .setPiece(new Position(4, 3), new RegularPiece(RED)) // own piece to hop (NE)
        .setPiece(new Position(2, 5), new RegularPiece(BLACK)); // opponent beyond the hop

      const moves = rules.getPossibleMoves(board, new Position(5, 2));
      // hop (5,2)->(3,4) over (4,3); then fly-capture (2,5) landing on (1,6) or (0,7).
      const combo = moves.find(m => m.captures.some(c => c.equals(new Position(2, 5))));
      expect(combo).toBeDefined();

      const after = combo!.apply(board);
      expect(after.getPiece(new Position(4, 3))?.player).toBe(RED); // hopped own stays
      expect(after.isEmpty(new Position(2, 5))).toBe(true); // opponent captured
      expect(after.getPiece(combo!.to)?.isKing()).toBe(true); // king landed
    });

    it('executes a hop-then-capture through the Game controller', () => {
      class MixedSetupRules extends JumpOwnRules {
        override getInitialBoard(): Board {
          return new Board(8)
            .setPiece(new Position(6, 1), new RegularPiece(RED))
            .setPiece(new Position(5, 2), new RegularPiece(RED))
            .setPiece(new Position(3, 4), new RegularPiece(BLACK));
        }
      }
      const game = new Game({ ruleEngine: new MixedSetupRules() });
      const combo = game.getPossibleMoves(new Position(6, 1)).find(m => m.to.equals(new Position(2, 5)));
      expect(combo).toBeDefined();

      expect(game.makeMove(combo!)).toBe(true);
      const board = game.getBoard();
      expect(board.getPiece(new Position(2, 5))?.player).toBe(RED);
      expect(board.getPiece(new Position(5, 2))?.player).toBe(RED); // own piece survives
      expect(board.isEmpty(new Position(3, 4))).toBe(true); // opponent removed
    });
  });

  describe('capture then hop', () => {
    it('lets a piece capture an opponent and then hop its own man in one turn', () => {
      const board = new Board(8)
        .setPiece(new Position(5, 2), new RegularPiece(RED)) // mover; captures (4,3)
        .setPiece(new Position(4, 3), new RegularPiece(BLACK)) // opponent
        .setPiece(new Position(2, 5), new RegularPiece(RED)); // own man to hop after the capture

      const moves = rules.getPossibleMoves(board, new Position(5, 2));

      // The plain capture is still offered...
      expect(hasMove(moves, new Position(5, 2), new Position(3, 4))).toBe(true);
      // ...and so is capture-then-hop: capture (4,3)->(3,4), then hop (2,5)->(1,6).
      const combo = moves.find(m => m.to.equals(new Position(1, 6)));
      expect(combo).toBeDefined();
      expect(combo!.captures.some(c => c.equals(new Position(4, 3)))).toBe(true);
      expect(rules.validateMove(board, combo!)).toBe(true);

      const after = combo!.apply(board);
      expect(after.getPiece(new Position(1, 6))?.player).toBe(RED); // landed
      expect(after.isEmpty(new Position(4, 3))).toBe(true); // opponent captured
      expect(after.getPiece(new Position(2, 5))?.player).toBe(RED); // own man hopped, not removed
      expect(after.isEmpty(new Position(5, 2))).toBe(true); // moved away
    });

    it('offers shorter capturing lines too (no forced maximum in this variant)', () => {
      const board = new Board(8)
        .setPiece(new Position(6, 1), new RegularPiece(RED)) // can double-capture
        .setPiece(new Position(5, 2), new RegularPiece(BLACK))
        .setPiece(new Position(3, 4), new RegularPiece(BLACK))
        .setPiece(new Position(3, 2), new RegularPiece(RED)); // enables a 1-capture-then-hop

      const moves = rules.getPossibleMoves(board, new Position(6, 1));

      // The full two-capture line is available...
      expect(hasMove(moves, new Position(6, 1), new Position(2, 5))).toBe(true);
      // ...and so is the shorter one-capture-then-hop (you are not forced to take the max).
      expect(hasMove(moves, new Position(6, 1), new Position(2, 1))).toBe(true);
      // Every offered move still captures at least one opponent.
      expect(moves.every(m => m.getCaptureCount() >= 1)).toBe(true);
    });

    it('executes a capture-then-hop through the Game controller', () => {
      class CaptureHopSetupRules extends JumpOwnRules {
        override getInitialBoard(): Board {
          return new Board(8)
            .setPiece(new Position(5, 2), new RegularPiece(RED))
            .setPiece(new Position(4, 3), new RegularPiece(BLACK))
            .setPiece(new Position(2, 5), new RegularPiece(RED))
            .setPiece(new Position(0, 7), new RegularPiece(BLACK)); // keeps the game live
        }
      }
      const game = new Game({ ruleEngine: new CaptureHopSetupRules() });
      const combo = game.getPossibleMoves(new Position(5, 2)).find(m => m.to.equals(new Position(1, 6)));
      expect(combo).toBeDefined();

      expect(game.makeMove(combo!)).toBe(true);
      const board = game.getBoard();
      expect(board.getPiece(new Position(1, 6))?.player).toBe(RED);
      expect(board.isEmpty(new Position(4, 3))).toBe(true); // opponent removed
      expect(board.getPiece(new Position(2, 5))?.player).toBe(RED); // own man survives
    });
  });

  describe('kings', () => {
    it('hops over an own piece flying-style and may land on any empty square beyond', () => {
      const board = new Board(8)
        .setPiece(new Position(6, 6), new KingPiece(RED))
        .setPiece(new Position(4, 4), new RegularPiece(RED)); // own piece with a gap before it
      const moves = rules.getPossibleMoves(board, new Position(6, 6));
      // Slides to the empty (5,5) plus hops over (4,4) to (3,3)/(2,2)/(1,1).
      expect(hasMove(moves, new Position(6, 6), new Position(5, 5))).toBe(true);
      expect(hasMove(moves, new Position(6, 6), new Position(3, 3))).toBe(true);
      expect(hasMove(moves, new Position(6, 6), new Position(1, 1))).toBe(true);

      const after = new Move(new Position(6, 6), new Position(3, 3), []).apply(board);
      expect(after.getPiece(new Position(4, 4))?.player).toBe(RED); // hopped king-side piece stays
    });
  });

  describe('through the Game controller', () => {
    class HopSetupRules extends JumpOwnRules {
      override getInitialBoard(): Board {
        return new Board(8)
          .setPiece(new Position(5, 2), new RegularPiece(RED))
          .setPiece(new Position(4, 3), new RegularPiece(RED))
          .setPiece(new Position(2, 7), new RegularPiece(BLACK)); // keeps the game live
      }
    }

    it('lets a player make a hop move via makeMove', () => {
      const game = new Game({ ruleEngine: new HopSetupRules() });
      const hop = game.getPossibleMoves(new Position(5, 2)).find(m => m.to.equals(new Position(3, 4)));
      expect(hop).toBeDefined();

      expect(game.makeMove(hop!)).toBe(true);
      expect(game.getBoard().getPiece(new Position(3, 4))?.player).toBe(RED);
      expect(game.getBoard().getPiece(new Position(4, 3))?.player).toBe(RED); // not removed
    });
  });
});
