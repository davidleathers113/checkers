import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';
import { StandardRules } from '../../src/rules/StandardRules';
import { Game } from '../../src/core/Game';
import { PerformanceProfiler } from '../../src/utils/PerformanceProfiler';

describe('Move Generation Performance', () => {
  let game: Game;
  let rules: StandardRules;

  beforeEach(() => {
    rules = new StandardRules();
    game = new Game({ ruleEngine: rules });
    PerformanceProfiler.clear();
  });

  afterEach(() => {
    if (process.env['LOG_PERFORMANCE']) {
      PerformanceProfiler.logStats();
    }
  });

  it('should measure getPossibleMoves() for regular pieces', () => {
    const board = rules.getInitialBoard();
    const redPieces = board.getPlayerPieces(Player.RED);

    // Measure move generation for each piece
    PerformanceProfiler.measure('getPossibleMoves() - all starting pieces', () => {
      for (const { position } of redPieces) {
        PerformanceProfiler.measure('RegularPiece.getPossibleMoves()', () => {
          rules.getPossibleMoves(board, position);
        });
      }
    });

    const stats = PerformanceProfiler.getStats('RegularPiece.getPossibleMoves()');
    expect(stats).not.toBeNull();
    console.log(`RegularPiece.getPossibleMoves() average: ${stats!.average.toFixed(3)}ms`);
  });

  it('should measure getPossibleMoves() for kings', () => {
    let board = new Board();
    
    // Create a board with king pieces
    const positions = [
      new Position(3, 3),
      new Position(4, 4),
      new Position(5, 5)
    ];
    
    for (const pos of positions) {
      board = board.setPiece(pos, new KingPiece(Player.RED));
    }

    // Measure king move generation
    PerformanceProfiler.measure('KingPiece.getPossibleMoves() - all', () => {
      for (const pos of positions) {
        PerformanceProfiler.measure('KingPiece.getPossibleMoves()', () => {
          rules.getPossibleMoves(board, pos);
        });
      }
    });

    const stats = PerformanceProfiler.getStats('KingPiece.getPossibleMoves()');
    expect(stats).not.toBeNull();
    console.log(`KingPiece.getPossibleMoves() average: ${stats!.average.toFixed(3)}ms`);
  });

  it('should measure getAllPossibleMoves() performance', () => {
    const board = rules.getInitialBoard();

    // Measure getting all moves for a player
    PerformanceProfiler.measure('getAllPossibleMoves() - RED player', () => {
      rules.getAllPossibleMoves(board, Player.RED);
    });

    PerformanceProfiler.measure('getAllPossibleMoves() - BLACK player', () => {
      rules.getAllPossibleMoves(board, Player.BLACK);
    });

    const redStats = PerformanceProfiler.getStats('getAllPossibleMoves() - RED player');
    const blackStats = PerformanceProfiler.getStats('getAllPossibleMoves() - BLACK player');
    
    expect(redStats).not.toBeNull();
    expect(blackStats).not.toBeNull();
    
    console.log(`getAllPossibleMoves() RED: ${redStats!.total.toFixed(3)}ms`);
    console.log(`getAllPossibleMoves() BLACK: ${blackStats!.total.toFixed(3)}ms`);
  });

  it('should measure complex capture move generation', () => {
    // Create a board with multiple capture opportunities
    let board = new Board();
    
    // Set up a complex capture scenario
    board = board.setPiece(new Position(2, 2), new RegularPiece(Player.RED));
    board = board.setPiece(new Position(3, 3), new RegularPiece(Player.BLACK));
    board = board.setPiece(new Position(5, 5), new RegularPiece(Player.BLACK));
    board = board.setPiece(new Position(3, 5), new RegularPiece(Player.BLACK));
    
    const timer = PerformanceProfiler.createTimer('Complex capture move generation');
    const moves = rules.getPossibleMoves(board, new Position(2, 2));
    timer();

    const stats = PerformanceProfiler.getStats('Complex capture move generation');
    expect(stats).not.toBeNull();
    console.log(`Complex capture generation: ${stats!.total.toFixed(3)}ms for ${moves.length} moves`);
  });

  it('should measure move validation performance', () => {
    // Test validation performance
    const possibleMoves = game.getAllPossibleMoves();
    
    if (possibleMoves.length > 0) {
      const move = possibleMoves[0]!;
      
      // Measure validation time
      PerformanceProfiler.measure('Move validation - 100x', () => {
        for (let i = 0; i < 100; i++) {
          PerformanceProfiler.measure('validateMove()', () => {
            rules.validateMove(game.getBoard(), move);
          });
        }
      });

      const stats = PerformanceProfiler.getStats('validateMove()');
      expect(stats).not.toBeNull();
      console.log(`validateMove() average: ${stats!.average.toFixed(3)}ms`);
    }
  });

  it('should identify performance bottlenecks in move generation', () => {
    // Create a worst-case scenario for move generation
    let board = new Board();
    
    // Place pieces in a pattern that maximizes capture checks
    for (let row = 0; row < 8; row += 2) {
      for (let col = (row % 2); col < 8; col += 2) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          const player = row < 4 ? Player.BLACK : Player.RED;
          board = board.setPiece(pos, new RegularPiece(player));
        }
      }
    }

    console.log('\n=== Worst-case move generation ===');
    
    const startTotal = performance.now();
    const allMoves = PerformanceProfiler.measure('Worst-case getAllPossibleMoves()', () => {
      return rules.getAllPossibleMoves(board, Player.RED);
    });
    const endTotal = performance.now();

    console.log(`Total moves generated: ${allMoves.length}`);
    console.log(`Total time: ${(endTotal - startTotal).toFixed(3)}ms`);
    console.log(`Average per move: ${((endTotal - startTotal) / allMoves.length).toFixed(3)}ms`);
  });
});