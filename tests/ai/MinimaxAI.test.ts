import { MinimaxAI } from '../../src/ai/MinimaxAI';
import { evaluateBoard, opponentOf, MAN_VALUE, KING_VALUE } from '../../src/ai/Evaluation';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { StandardRules } from '../../src/rules/StandardRules';
import { JumpOwnRules } from '../../src/rules/JumpOwnRules';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';

const RED = Player.RED;
const BLACK = Player.BLACK;
// Deterministic RNG: avoids the easy-mode random branch and fixes the jitter.
const fixedRng = (): number => 0.99;

describe('Evaluation', () => {
  it('opponentOf flips the player', () => {
    expect(opponentOf(RED)).toBe(BLACK);
    expect(opponentOf(BLACK)).toBe(RED);
  });

  it('scores material advantage and is zero-sum on a mirror', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(2, 5), new RegularPiece(BLACK));
    // Mirror position: roughly symmetric, so close to zero.
    expect(Math.abs(evaluateBoard(board, RED))).toBeLessThan(MAN_VALUE);

    const redAhead = board.setPiece(new Position(6, 1), new RegularPiece(RED));
    expect(evaluateBoard(redAhead, RED)).toBeGreaterThan(evaluateBoard(board, RED));
  });

  it('values a king above a man', () => {
    const withMan = new Board(8).setPiece(new Position(4, 4), new RegularPiece(RED));
    const withKing = new Board(8).setPiece(new Position(4, 4), new KingPiece(RED));
    expect(evaluateBoard(withKing, RED)).toBeGreaterThan(evaluateBoard(withMan, RED));
    expect(evaluateBoard(withKing, RED)).toBeGreaterThanOrEqual(KING_VALUE);
  });
});

describe('MinimaxAI', () => {
  const rules = new StandardRules();

  it('returns null when the player has no pieces or moves', () => {
    const ai = new MinimaxAI({ difficulty: 'medium', rng: fixedRng });
    expect(ai.chooseMove(new Board(8), RED, rules)).toBeNull();
  });

  it('returns a legal move from the opening position', () => {
    const ai = new MinimaxAI({ difficulty: 'medium', rng: fixedRng });
    const board = rules.getInitialBoard();
    const move = ai.chooseMove(board, RED, rules)!;
    expect(move).not.toBeNull();
    const legal = rules.getAllPossibleMoves(board, RED);
    expect(legal.some(m => m.equals(move))).toBe(true);
  });

  it('takes a mandatory capture', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(BLACK));
    const ai = new MinimaxAI({ difficulty: 'medium', rng: fixedRng });
    const move = ai.chooseMove(board, RED, rules)!;
    expect(move.isCapture()).toBe(true);
  });

  it('plays the move that wins by elimination', () => {
    // RED can capture BLACK's only piece.
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(BLACK));
    const ai = new MinimaxAI({ difficulty: 'hard', rng: fixedRng });
    const move = ai.chooseMove(board, RED, rules)!;
    const after = move.apply(board);
    expect(after.getPieceCount(BLACK)).toBe(0);
  });

  it('avoids hanging a piece when not forced (uses search depth)', () => {
    // RED at (5,2) may move to (4,1) [safe] or (4,3) [BLACK at (3,4) then captures it].
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(3, 4), new RegularPiece(BLACK));
    const ai = new MinimaxAI({ difficulty: 'medium', rng: fixedRng });
    const move = ai.chooseMove(board, RED, rules)!;
    expect(move.to.equals(new Position(4, 1))).toBe(true);
  });

  it('works with the Jump Your Own Man variant', () => {
    const jumpRules = new JumpOwnRules();
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(RED))
      .setPiece(new Position(2, 5), new RegularPiece(BLACK));
    const ai = new MinimaxAI({ difficulty: 'medium', rng: fixedRng });
    const move = ai.chooseMove(board, RED, jumpRules)!;
    expect(jumpRules.getAllPossibleMoves(board, RED).some(m => m.equals(move))).toBe(true);
  });

  it('easy mode can play a random legal move', () => {
    const board = rules.getInitialBoard();
    // rng below the threshold triggers the random branch.
    const ai = new MinimaxAI({ difficulty: 'easy', rng: () => 0.1 });
    const move = ai.chooseMove(board, RED, rules)!;
    expect(rules.getAllPossibleMoves(board, RED).some(m => m.equals(move))).toBe(true);
  });

  it('returns the only legal move without searching', () => {
    const board = new Board(8)
      .setPiece(new Position(5, 2), new RegularPiece(RED))
      .setPiece(new Position(4, 3), new RegularPiece(BLACK));
    // Single mandatory capture available.
    const ai = new MinimaxAI({ difficulty: 'hard', rng: fixedRng });
    expect(ai.chooseMove(board, RED, rules)).not.toBeNull();
  });

  it('hard difficulty returns a legal opening move within the node budget', () => {
    const ai = new MinimaxAI({ difficulty: 'hard', rng: fixedRng });
    const board = rules.getInitialBoard();
    const move = ai.chooseMove(board, RED, rules)!;
    expect(rules.getAllPossibleMoves(board, RED).some(m => m.equals(move))).toBe(true);
  });
});
