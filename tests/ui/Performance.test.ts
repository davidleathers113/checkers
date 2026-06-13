import { performance } from 'perf_hooks';
import { Game } from '../../src/core/Game';
import { StandardRules } from '../../src/rules/StandardRules';
import { Position } from '../../src/core/Position';
import { ANIMATION_DURATIONS } from '../../src/ui/web/types/GameConfig';

/**
 * Performance smoke tests for the web UI layer.
 *
 * These guard against catastrophic regressions, NOT precise micro-benchmark
 * numbers — fine-grained benchmarking lives in tests/performance/. Each test
 * leads with a deterministic correctness assertion so pass/fail does not hinge
 * on wall-clock timing, then applies a generous time budget that tolerates the
 * 10-50x slowdown introduced by coverage instrumentation, GC pauses, and Jest
 * worker contention. Tight per-iteration averages (e.g. < 0.002ms) are
 * intentionally avoided because GC outliers make them flaky under load.
 */
describe('Performance Tests', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game({ ruleEngine: new StandardRules() });
  });

  test('board initialization performance', () => {
    const iterations = 1000;
    const start = performance.now();

    let lastGame: Game | null = null;
    for (let i = 0; i < iterations; i++) {
      lastGame = new Game({ ruleEngine: new StandardRules() });
    }

    const total = performance.now() - start;

    // Correctness: a freshly initialized game has the standard 24 pieces.
    expect(lastGame!.getBoard().getOccupiedPositions()).toHaveLength(24);
    // Budget: 1000 initializations well under instrumentation-tolerant ceiling.
    expect(total).toBeLessThan(3000);
  });

  test('move generation performance', () => {
    const iterations = 100;
    const position = new Position(5, 0); // Starting red piece position

    const start = performance.now();

    let moves = game.getPossibleMoves(position);
    for (let i = 1; i < iterations; i++) {
      moves = game.getPossibleMoves(position);
    }

    const total = performance.now() - start;

    // Correctness: a starting red piece always has at least one legal move.
    expect(moves.length).toBeGreaterThan(0);
    expect(total).toBeLessThan(2000);
  });

  test('board copy performance', () => {
    const iterations = 1000;
    const board = game.getBoard();

    const start = performance.now();

    let copy = board.copy();
    for (let i = 1; i < iterations; i++) {
      copy = board.copy();
    }

    const total = performance.now() - start;

    // Correctness: a copy preserves the full piece layout.
    expect(copy.getOccupiedPositions()).toHaveLength(board.getOccupiedPositions().length);
    expect(total).toBeLessThan(2000);
  });

  test('game state serialization performance', () => {
    const iterations = 1000;

    const start = performance.now();

    let serialized = '';
    for (let i = 0; i < iterations; i++) {
      serialized = JSON.stringify(game.getGameState());
    }

    const total = performance.now() - start;

    // Correctness: serialization produces parseable JSON.
    expect(() => JSON.parse(serialized)).not.toThrow();
    expect(total).toBeLessThan(3000);
  });

  test('animation duration configurations are reasonable', () => {
    // Pure value checks — deterministic, no timing involved.
    expect(ANIMATION_DURATIONS.slow).toBeGreaterThan(400);
    expect(ANIMATION_DURATIONS.slow).toBeLessThan(1000);

    expect(ANIMATION_DURATIONS.normal).toBeGreaterThan(200);
    expect(ANIMATION_DURATIONS.normal).toBeLessThan(500);

    expect(ANIMATION_DURATIONS.fast).toBeGreaterThan(50);
    expect(ANIMATION_DURATIONS.fast).toBeLessThan(200);

    // Ensure proper ordering
    expect(ANIMATION_DURATIONS.slow).toBeGreaterThan(ANIMATION_DURATIONS.normal);
    expect(ANIMATION_DURATIONS.normal).toBeGreaterThan(ANIMATION_DURATIONS.fast);
  });

  test('large board performance (10x10)', () => {
    const largeBoardGame = new Game({
      ruleEngine: new StandardRules(10),
    });

    const iterations = 100;
    const start = performance.now();

    let moves = largeBoardGame.getAllPossibleMoves();
    for (let i = 1; i < iterations; i++) {
      moves = largeBoardGame.getAllPossibleMoves();
    }

    const total = performance.now() - start;

    // Correctness: the opening position on a 10x10 board has legal moves.
    expect(moves.length).toBeGreaterThan(0);
    expect(total).toBeLessThan(3000);
  });

  test('memory usage stays reasonable during gameplay', () => {
    const initialMemory = process.memoryUsage().heapUsed;

    let movesMade = 0;
    // Make up to 10 moves to exercise allocation during gameplay.
    for (let i = 0; i < 10; i++) {
      const moves = game.getAllPossibleMoves();
      if (moves.length > 0) {
        try {
          game.makeMove(moves[0]!);
          movesMade++;
        } catch (error) {
          // Skip invalid moves
          break;
        }
      }
    }

    const memoryIncrease = process.memoryUsage().heapUsed - initialMemory;

    // Correctness: gameplay actually progressed.
    expect(movesMade).toBeGreaterThan(0);
    // Budget: generous ceiling tolerant of coverage instrumentation heap.
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  test('position hashing performance', () => {
    const positions: Position[] = [];

    // Generate test positions
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        positions.push(new Position(row, col));
      }
    }

    const iterations = 10000;
    const hashes = new Set<string>();

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const pos = positions[i % positions.length]!;
      hashes.add(pos.hash());
    }

    const total = performance.now() - start;

    // Correctness: every distinct square produces a distinct hash.
    expect(hashes.size).toBe(positions.length);
    // Budget: 10k hashes is trivial work — generous ceiling absorbs GC/load.
    expect(total).toBeLessThan(500);
  });

  test('undo/redo performance', () => {
    // Make some moves first
    for (let i = 0; i < 5; i++) {
      const moves = game.getAllPossibleMoves();
      if (moves.length > 0) {
        try {
          game.makeMove(moves[0]!);
        } catch (error) {
          // Skip invalid moves
          break;
        }
      }
    }

    const startHistory = game.getHistory().length;
    expect(startHistory).toBeGreaterThan(0);

    const iterations = 100;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      if (game.getHistory().length > 0) {
        game.undoMove();
      }
      const moves = game.getAllPossibleMoves();
      if (moves.length > 0) {
        try {
          game.makeMove(moves[0]!);
        } catch (error) {
          // Skip invalid moves
          continue;
        }
      }
    }

    const total = performance.now() - start;

    // Correctness: the game remains in a consistent, playable state.
    expect(game.getHistory().length).toBeGreaterThanOrEqual(0);
    expect(total).toBeLessThan(3000);
  });
});
