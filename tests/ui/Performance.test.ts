import { performance } from 'perf_hooks';
import { Game } from '../../src/core/Game';
import { StandardRules } from '../../src/rules/StandardRules';
import { Position } from '../../src/core/Position';
import { ANIMATION_DURATIONS } from '../../src/ui/web/types/GameConfig';

describe('Performance Tests', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game({ ruleEngine: new StandardRules() });
  });

  test('board initialization performance', () => {
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      new Game({ ruleEngine: new StandardRules() });
    }

    const end = performance.now();
    const averageTime = (end - start) / iterations;

    // Should initialize in less than 1ms on average
    expect(averageTime).toBeLessThan(1);
  });

  test('move generation performance', () => {
    const iterations = 100;
    const position = new Position(5, 0); // Starting red piece position
    
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      game.getPossibleMoves(position);
    }

    const end = performance.now();
    const averageTime = (end - start) / iterations;

    // Should generate moves in less than 2ms on average
    expect(averageTime).toBeLessThan(2);
  });

  test('board copy performance', () => {
    const iterations = 1000;
    const board = game.getBoard();
    
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      board.copy();
    }

    const end = performance.now();
    const averageTime = (end - start) / iterations;

    // Board copy should be fast (less than 0.1ms)
    expect(averageTime).toBeLessThan(0.1);
  });

  test('game state serialization performance', () => {
    const iterations = 1000;
    
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      JSON.stringify(game.getGameState());
    }

    const end = performance.now();
    const averageTime = (end - start) / iterations;

    // Serialization should be fast
    expect(averageTime).toBeLessThan(0.5);
  });

  test('animation duration configurations are reasonable', () => {
    // Test that animation durations are within reasonable ranges
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
      ruleEngine: new StandardRules(10) 
    });

    const iterations = 100;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      largeBoardGame.getAllPossibleMoves();
    }

    const end = performance.now();
    const averageTime = (end - start) / iterations;

    // Should handle 10x10 boards efficiently (less than 5ms)
    expect(averageTime).toBeLessThan(5);
  });

  test('memory usage stays reasonable during gameplay', () => {
    // Simulate a series of moves to test memory usage
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Make 20 moves (10 each player)
    for (let i = 0; i < 10; i++) {
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

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be reasonable (less than 10MB for 50 moves)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  test('position hashing performance', () => {
    const iterations = 10000;
    const positions = [];
    
    // Generate test positions
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        positions.push(new Position(row, col));
      }
    }

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const pos = positions[i % positions.length]!;
      pos.hash();
    }

    const end = performance.now();
    const averageTime = (end - start) / iterations;

    // Position hashing should be very fast (less than 0.002ms)
    expect(averageTime).toBeLessThan(0.002);
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

    const end = performance.now();
    const averageTime = (end - start) / iterations;

    // Undo/redo should be fast (less than 3ms)
    expect(averageTime).toBeLessThan(3);
  });
});