import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
import { StandardRules } from '../../src/rules/StandardRules';
import { PerformanceProfiler } from '../../src/utils/PerformanceProfiler';

describe('Board Performance', () => {
  let board: Board;
  let rules: StandardRules;

  beforeEach(() => {
    rules = new StandardRules();
    board = rules.getInitialBoard();
    PerformanceProfiler.clear();
  });

  afterEach(() => {
    if (process.env['LOG_PERFORMANCE']) {
      PerformanceProfiler.logStats();
    }
  });

  it('should measure Board.copy() performance', () => {
    // Measure single copy
    PerformanceProfiler.measure('Board.copy() - single', () => {
      board.copy();
    });

    // Measure 1000 copies
    PerformanceProfiler.measure('Board.copy() - 1000x', () => {
      for (let i = 0; i < 1000; i++) {
        board.copy();
      }
    });

    const stats = PerformanceProfiler.getStats('Board.copy() - 1000x');
    expect(stats).not.toBeNull();
    console.log(`Board.copy() 1000x: ${stats!.total.toFixed(3)}ms (${(stats!.total / 1000).toFixed(3)}ms per copy)`);
  });

  it('should measure Board.setPiece() performance', () => {
    const piece = new RegularPiece(Player.RED);
    const positions = board.getEmptyPositions();

    // Measure setting pieces on empty board
    PerformanceProfiler.measure('Board.setPiece() - 100 operations', () => {
      let currentBoard = board;
      for (let i = 0; i < 100 && i < positions.length; i++) {
        currentBoard = PerformanceProfiler.measure('Board.setPiece() - single', () => 
          currentBoard.setPiece(positions[i]!, piece)
        );
      }
    });

    const stats = PerformanceProfiler.getStats('Board.setPiece() - single');
    expect(stats).not.toBeNull();
    console.log(`Board.setPiece() average: ${stats!.average.toFixed(3)}ms`);
  });

  it('should measure Board.movePiece() performance', () => {
    // Create a board with some pieces
    let testBoard = board;
    const piece = new RegularPiece(Player.RED);
    testBoard = testBoard.setPiece(new Position(3, 3), piece);

    // Measure moving pieces
    PerformanceProfiler.measure('Board.movePiece() - 100 operations', () => {
      let currentBoard = testBoard;
      for (let i = 0; i < 100; i++) {
        const from = new Position(3 + (i % 2), 3);
        const to = new Position(4 - (i % 2), 4);
        currentBoard = currentBoard.setPiece(from, piece);
        currentBoard = PerformanceProfiler.measure('Board.movePiece() - single', () =>
          currentBoard.movePiece(from, to)
        );
      }
    });

    const stats = PerformanceProfiler.getStats('Board.movePiece() - single');
    expect(stats).not.toBeNull();
    console.log(`Board.movePiece() average: ${stats!.average.toFixed(3)}ms`);
  });

  it('should measure deep copy performance impact', () => {
    // Measure the copySquares method indirectly
    const originalBoard = rules.getInitialBoard();
    
    // Time how long it takes to perform operations that trigger deep copies
    const operations = 50;
    
    PerformanceProfiler.measure(`Chain of ${operations} setPiece operations`, () => {
      let currentBoard = originalBoard;
      for (let i = 0; i < operations; i++) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        if (row < 8 && col < 8) {
          const pos = new Position(row, col);
          if (pos.isDarkSquare() && currentBoard.isEmpty(pos)) {
            currentBoard = currentBoard.setPiece(pos, new RegularPiece(Player.RED));
          }
        }
      }
    });

    const stats = PerformanceProfiler.getStats(`Chain of ${operations} setPiece operations`);
    expect(stats).not.toBeNull();
    console.log(`Chain of ${operations} operations: ${stats!.total.toFixed(3)}ms`);
  });
});