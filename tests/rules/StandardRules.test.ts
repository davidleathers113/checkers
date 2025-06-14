import { StandardRules } from '../../src/rules/StandardRules';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Move } from '../../src/core/Move';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Player } from '../../src/types';

describe('StandardRules', () => {
  let rules: StandardRules;
  let board: Board;

  beforeEach(() => {
    rules = new StandardRules();
    board = new Board();
  });

  describe('validateMove', () => {
    it('should validate simple forward move', () => {
      const piece = new RegularPiece(Player.RED);
      board = board.setPiece(new Position(3, 3), piece);
      
      const move = new Move(new Position(3, 3), new Position(2, 4));
      expect(rules.validateMove(board, move)).toBe(true);
    });

    it('should reject backward move for regular piece', () => {
      const piece = new RegularPiece(Player.RED);
      board = board.setPiece(new Position(3, 3), piece);
      
      const move = new Move(new Position(3, 3), new Position(4, 4));
      expect(rules.validateMove(board, move)).toBe(false);
    });

    it('should validate capture move', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(4, 4), blackPiece);
      
      const move = new Move(new Position(3, 3), new Position(5, 5), [new Position(4, 4)]);
      expect(rules.validateMove(board, move)).toBe(true);
    });

    it('should enforce mandatory captures', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(4, 4), blackPiece);
      
      // When capture is available, regular moves should be invalid
      const regularMove = new Move(new Position(3, 3), new Position(2, 2));
      expect(rules.validateMove(board, regularMove)).toBe(false);
    });
  });

  describe('getPossibleMoves', () => {
    it('should return possible moves for piece', () => {
      const piece = new RegularPiece(Player.RED);
      board = board.setPiece(new Position(3, 3), piece);
      
      const moves = rules.getPossibleMoves(board, new Position(3, 3));
      
      expect(moves.length).toBeGreaterThan(0);
      expect(moves[0]!.from).toEqual(new Position(3, 3));
    });

    it('should return empty array for empty position', () => {
      const moves = rules.getPossibleMoves(board, new Position(3, 3));
      expect(moves).toHaveLength(0);
    });

    it('should include promotion moves when appropriate', () => {
      const piece = new RegularPiece(Player.RED);
      board = board.setPiece(new Position(1, 1), piece); // Near promotion row
      
      const moves = rules.getPossibleMoves(board, new Position(1, 1));
      const promotionMoves = moves.filter(move => move.isPromotion);
      
      expect(promotionMoves.length).toBeGreaterThan(0);
    });
  });

  describe('getAllPossibleMoves', () => {
    it('should return all moves for player', () => {
      const redPiece1 = new RegularPiece(Player.RED);
      const redPiece2 = new RegularPiece(Player.RED);
      
      board = board.setPiece(new Position(3, 3), redPiece1);
      board = board.setPiece(new Position(5, 5), redPiece2);
      
      const moves = rules.getAllPossibleMoves(board, Player.RED);
      
      expect(moves.length).toBeGreaterThan(0);
      expect(moves.some(move => move.from.equals(new Position(3, 3)))).toBe(true);
      expect(moves.some(move => move.from.equals(new Position(5, 5)))).toBe(true);
    });

    it('should prioritize captures when available', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(4, 4), blackPiece);
      
      const moves = rules.getAllPossibleMoves(board, Player.RED);
      
      // Should only return capture moves
      expect(moves.every(move => move.isCapture())).toBe(true);
    });
  });

  describe('isGameOver', () => {
    it('should return false for active game', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(5, 5), blackPiece);
      
      expect(rules.isGameOver(board)).toBe(false);
    });

    it('should return true when no pieces for a player', () => {
      const redPiece = new RegularPiece(Player.RED);
      board = board.setPiece(new Position(3, 3), redPiece);
      
      expect(rules.isGameOver(board)).toBe(true);
    });
  });

  describe('getWinner', () => {
    it('should return winner when opponent has no pieces', () => {
      const redPiece = new RegularPiece(Player.RED);
      board = board.setPiece(new Position(3, 3), redPiece);
      
      expect(rules.getWinner(board)).toBe(Player.RED);
    });

    it('should return null for active game', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(5, 5), blackPiece);
      
      expect(rules.getWinner(board)).toBe(null);
    });
  });

  describe('getMandatoryMoves', () => {
    it('should return empty array when no captures available', () => {
      const redPiece = new RegularPiece(Player.RED);
      board = board.setPiece(new Position(3, 3), redPiece);
      
      const mandatory = rules.getMandatoryMoves(board, Player.RED);
      expect(mandatory).toHaveLength(0);
    });

    it('should return capture moves when available', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(4, 4), blackPiece);
      
      const mandatory = rules.getMandatoryMoves(board, Player.RED);
      
      expect(mandatory.length).toBeGreaterThan(0);
      expect(mandatory.every(move => move.isCapture())).toBe(true);
    });

    it('should return maximum captures when multiple options exist', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece1 = new RegularPiece(Player.BLACK);
      const blackPiece2 = new RegularPiece(Player.BLACK);
      
      // Set up position where multi-capture is possible
      board = board.setPiece(new Position(2, 2), redPiece);
      board = board.setPiece(new Position(3, 3), blackPiece1);
      board = board.setPiece(new Position(5, 5), blackPiece2);
      
      const mandatory = rules.getMandatoryMoves(board, Player.RED);
      
      // Should prefer moves that capture more pieces
      const maxCaptures = Math.max(...mandatory.map(move => move.getCaptureCount()));
      expect(mandatory.every(move => move.getCaptureCount() === maxCaptures)).toBe(true);
    });
  });

  describe('shouldPromote', () => {
    it('should promote red piece on row 0', () => {
      const piece = new RegularPiece(Player.RED);
      const position = new Position(0, 1);
      
      expect(rules.shouldPromote(position, piece)).toBe(true);
    });

    it('should promote black piece on last row', () => {
      const piece = new RegularPiece(Player.BLACK);
      const position = new Position(7, 1);
      
      expect(rules.shouldPromote(position, piece)).toBe(true);
    });

    it('should not promote in middle of board', () => {
      const piece = new RegularPiece(Player.RED);
      const position = new Position(3, 3);
      
      expect(rules.shouldPromote(position, piece)).toBe(false);
    });

    it('should not promote kings', () => {
      const king = new KingPiece(Player.RED);
      const position = new Position(0, 1);
      
      expect(rules.shouldPromote(position, king)).toBe(false);
    });
  });

  describe('getInitialBoard', () => {
    it('should create standard starting position', () => {
      const initialBoard = rules.getInitialBoard();
      
      // Check red pieces are in correct positions
      expect(initialBoard.getPieceCount(Player.RED)).toBe(12);
      expect(initialBoard.getPieceCount(Player.BLACK)).toBe(12);
      
      // Check specific positions (BLACK pieces on top, RED on bottom)
      expect(initialBoard.getPiece(new Position(0, 1))).toBeInstanceOf(RegularPiece);
      expect(initialBoard.getPiece(new Position(0, 1))!.player).toBe(Player.BLACK);
      
      expect(initialBoard.getPiece(new Position(7, 0))).toBeInstanceOf(RegularPiece);
      expect(initialBoard.getPiece(new Position(7, 0))!.player).toBe(Player.RED);
    });

    it('should place pieces only on dark squares', () => {
      const initialBoard = rules.getInitialBoard();
      const occupiedPositions = initialBoard.getOccupiedPositions();
      
      occupiedPositions.forEach(pos => {
        expect(pos.isDarkSquare()).toBe(true);
      });
    });
  });

  describe('isValidBoardState', () => {
    it('should validate correct board state', () => {
      const validBoard = rules.getInitialBoard();
      expect(rules.isValidBoardState(validBoard)).toBe(true);
    });

    it('should reject pieces on light squares', () => {
      const piece = new RegularPiece(Player.RED);
      const invalidBoard = board.setPiece(new Position(0, 0), piece); // Light square
      
      expect(rules.isValidBoardState(invalidBoard)).toBe(false);
    });

    it('should reject too many pieces', () => {
      let invalidBoard = board;
      
      // Add too many pieces
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const pos = new Position(row, col);
          if (pos.isDarkSquare()) {
            invalidBoard = invalidBoard.setPiece(pos, new RegularPiece(Player.RED));
          }
        }
      }
      
      expect(rules.isValidBoardState(invalidBoard)).toBe(false);
    });

    it('should reject wrong board size', () => {
      const wrongSizeBoard = new Board(10);
      expect(rules.isValidBoardState(wrongSizeBoard)).toBe(false);
    });
  });

  describe('multi-jump captures', () => {
    it('should validate a double jump capture move', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece1 = new RegularPiece(Player.BLACK);
      const blackPiece2 = new RegularPiece(Player.BLACK);
      
      // Set up a double jump scenario
      // Red at (5,2) can jump black at (4,3) to (3,4), then black at (2,5) to (1,6)
      board = board.setPiece(new Position(5, 2), redPiece);
      board = board.setPiece(new Position(4, 3), blackPiece1);
      board = board.setPiece(new Position(2, 5), blackPiece2);
      
      // Create multi-step move
      const steps = [
        { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
        { from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) }
      ];
      
      const move = new Move(
        new Position(5, 2),
        new Position(1, 6),
        [new Position(4, 3), new Position(2, 5)],
        false,
        steps
      );
      
      expect(rules.validateMove(board, move)).toBe(true);
    });

    it('should reject multi-jump if intermediate square is occupied', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece1 = new RegularPiece(Player.BLACK);
      const blackPiece2 = new RegularPiece(Player.BLACK);
      const blockingPiece = new RegularPiece(Player.RED);
      
      board = board.setPiece(new Position(5, 2), redPiece);
      board = board.setPiece(new Position(4, 3), blackPiece1);
      board = board.setPiece(new Position(3, 4), blockingPiece); // Blocks landing
      board = board.setPiece(new Position(2, 5), blackPiece2);
      
      const steps = [
        { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
        { from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) }
      ];
      
      const move = new Move(
        new Position(5, 2),
        new Position(1, 6),
        [new Position(4, 3), new Position(2, 5)],
        false,
        steps
      );
      
      expect(rules.validateMove(board, move)).toBe(false);
    });

    it('should generate multi-jump captures correctly', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece1 = new RegularPiece(Player.BLACK);
      const blackPiece2 = new RegularPiece(Player.BLACK);
      
      // Set up for double jump
      board = board.setPiece(new Position(5, 2), redPiece);
      board = board.setPiece(new Position(4, 3), blackPiece1);
      board = board.setPiece(new Position(2, 5), blackPiece2);
      
      const moves = rules.getPossibleMoves(board, new Position(5, 2));
      
      // Should include the multi-jump capture
      const multiJump = moves.find(m => m.getCaptureCount() === 2);
      expect(multiJump).toBeDefined();
      expect(multiJump?.from.equals(new Position(5, 2))).toBe(true);
      expect(multiJump?.to.equals(new Position(1, 6))).toBe(true);
      expect(multiJump?.captures.length).toBe(2);
    });

    it('should enforce maximum capture rule in multi-jumps', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece1 = new RegularPiece(Player.BLACK);
      const blackPiece2 = new RegularPiece(Player.BLACK);
      const blackPiece3 = new RegularPiece(Player.BLACK);
      
      // Red can capture 1 piece or 2 pieces - should force 2
      board = board.setPiece(new Position(5, 2), redPiece);
      board = board.setPiece(new Position(4, 3), blackPiece1);
      board = board.setPiece(new Position(2, 5), blackPiece2);
      board = board.setPiece(new Position(4, 1), blackPiece3); // Single capture option
      
      const mandatory = rules.getMandatoryMoves(board, Player.RED);
      
      // Should only allow the double capture
      expect(mandatory.every(m => m.getCaptureCount() === 2)).toBe(true);
    });

    it('should handle triple jump captures', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece1 = new RegularPiece(Player.BLACK);
      const blackPiece2 = new RegularPiece(Player.BLACK);
      const blackPiece3 = new RegularPiece(Player.BLACK);
      
      // Set up triple jump scenario
      board = board.setPiece(new Position(7, 0), redPiece);
      board = board.setPiece(new Position(6, 1), blackPiece1);
      board = board.setPiece(new Position(4, 3), blackPiece2);
      board = board.setPiece(new Position(2, 5), blackPiece3);
      
      const moves = rules.getPossibleMoves(board, new Position(7, 0));
      
      // Should find the triple jump
      const tripleJump = moves.find(m => m.getCaptureCount() === 3);
      expect(tripleJump).toBeDefined();
      expect(tripleJump?.steps.length).toBe(3);
    });

    it('should apply multi-jump move correctly to board', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece1 = new RegularPiece(Player.BLACK);
      const blackPiece2 = new RegularPiece(Player.BLACK);
      
      board = board.setPiece(new Position(5, 2), redPiece);
      board = board.setPiece(new Position(4, 3), blackPiece1);
      board = board.setPiece(new Position(2, 5), blackPiece2);
      
      const steps = [
        { from: new Position(5, 2), to: new Position(3, 4), captured: new Position(4, 3) },
        { from: new Position(3, 4), to: new Position(1, 6), captured: new Position(2, 5) }
      ];
      
      const move = new Move(
        new Position(5, 2),
        new Position(1, 6),
        [new Position(4, 3), new Position(2, 5)],
        false,
        steps
      );
      
      const newBoard = move.apply(board);
      
      // Original position should be empty
      expect(newBoard.isEmpty(new Position(5, 2))).toBe(true);
      
      // Final position should have the piece
      expect(newBoard.getPiece(new Position(1, 6))?.player).toBe(Player.RED);
      
      // Captured pieces should be removed
      expect(newBoard.isEmpty(new Position(4, 3))).toBe(true);
      expect(newBoard.isEmpty(new Position(2, 5))).toBe(true);
    });
  });
});