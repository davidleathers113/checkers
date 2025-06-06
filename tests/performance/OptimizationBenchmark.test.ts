import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
import { PerformanceProfiler } from '../../src/utils/PerformanceProfiler';

describe('Optimization Benchmarks', () => {
  beforeEach(() => {
    PerformanceProfiler.clear();
  });

  describe('Board Copy-on-Write Performance', () => {
    it('should perform shallow copies efficiently', () => {
      const board = new Board(8);
      const piece = new RegularPiece(Player.RED);
      
      // Measure time for 1000 board mutations
      const endTimer = PerformanceProfiler.createTimer('board-mutations');
      let currentBoard = board;
      for (let i = 0; i < 1000; i++) {
        const row = i % 8;
        const col = (i * 3) % 8;
        currentBoard = currentBoard.setPiece(new Position(row, col), piece);
      }
      endTimer();
      
      const stats = PerformanceProfiler.getStats('board-mutations');
      expect(stats).not.toBeNull();
      expect(stats!.total).toBeLessThan(50); // 50ms for 1000 operations
      console.log(`1000 board mutations took ${stats!.total.toFixed(2)}ms`);
    });

    it('should share unchanged data between board instances', () => {
      const board = new Board(8);
      const piece = new RegularPiece(Player.RED);
      
      // Set up initial board
      const board1 = board.setPiece(new Position(0, 0), piece);
      const board2 = board1.setPiece(new Position(1, 1), piece);
      
      // The underlying arrays should be different objects
      // but pieces should be shared (same reference)
      const piece1 = board1.getPiece(new Position(0, 0));
      const piece2 = board2.getPiece(new Position(0, 0));
      
      expect(piece1).toBe(piece2); // Same piece object reference
    });
  });

  describe('Stateless Capture Search Performance', () => {
    it('should efficiently find multi-jump captures without creating boards', () => {
      const board = new Board(8);
      
      // Set up a complex capture scenario
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      // Create a triple-jump scenario
      let testBoard = board
        .setPiece(new Position(0, 0), redPiece)
        .setPiece(new Position(1, 1), blackPiece)
        .setPiece(new Position(3, 3), blackPiece)
        .setPiece(new Position(5, 5), blackPiece);
      
      // Measure capture move generation
      const captures = PerformanceProfiler.measure('capture-search', () => 
        redPiece.getCaptureMoves(new Position(0, 0), testBoard)
      );
      
      const stats = PerformanceProfiler.getStats('capture-search');
      expect(stats).not.toBeNull();
      expect(stats!.average).toBeLessThan(5); // 5ms for complex capture search
      console.log(`Multi-jump capture search took ${stats!.average.toFixed(2)}ms`);
      
      // Verify captures were found
      expect(captures.length).toBeGreaterThan(0);
    });

    it('should handle recursive captures without stack overflow', () => {
      const board = new Board(8);
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      // Create a maximum complexity scenario
      let testBoard = board;
      
      // Place pieces in a zigzag pattern for maximum captures
      for (let i = 0; i < 4; i++) {
        testBoard = testBoard
          .setPiece(new Position(i * 2 + 1, i * 2 + 1), blackPiece)
          .setPiece(new Position(i * 2 + 1, 7 - (i * 2 + 1)), blackPiece);
      }
      testBoard = testBoard.setPiece(new Position(0, 0), redPiece);
      
      // This should complete without error
      const captures = redPiece.getCaptureMoves(new Position(0, 0), testBoard);
      expect(captures).toBeDefined();
    });
  });

  describe('Position Hash Performance', () => {
    it('should generate string hashes efficiently', () => {
      const positions: Position[] = [];
      
      // Generate positions
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          positions.push(new Position(row, col));
        }
      }
      
      // Measure hash generation
      const endTimer = PerformanceProfiler.createTimer('position-hashing');
      const hashes = new Set<string>();
      for (const pos of positions) {
        hashes.add(pos.hash());
      }
      endTimer();
      
      const stats = PerformanceProfiler.getStats('position-hashing');
      expect(stats).not.toBeNull();
      expect(stats!.total).toBeLessThan(1); // 1ms for 64 hashes
      expect(hashes.size).toBe(64); // All unique
      console.log(`64 position hashes took ${stats!.total.toFixed(2)}ms`);
    });
  });

  describe('Variable Board Size Support', () => {
    it('should support 10x10 board for International Draughts', () => {
      const board = new Board(10);
      const pos = new Position(9, 9);
      
      expect(board.isValidPosition(pos)).toBe(true);
      expect(pos.toString(10)).toBe('j1');
      expect(Position.fromString('j1', 10).equals(pos)).toBe(true);
    });

    it('should handle board size in position conversions', () => {
      // 8x8 board
      const pos8 = new Position(0, 0);
      expect(pos8.toString(8)).toBe('a8');
      
      // 10x10 board
      const pos10 = new Position(0, 0);
      expect(pos10.toString(10)).toBe('a10');
      
      // Parse back
      expect(Position.fromString('a8', 8).equals(pos8)).toBe(true);
      expect(Position.fromString('a10', 10).equals(pos10)).toBe(true);
    });
  });
});