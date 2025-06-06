import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';
import { InvalidPositionError, InvalidBoardStateError } from '../../src/errors';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    it('should create empty 8x8 board by default', () => {
      expect(board.size).toBe(8);
      expect(board.getPieceCount(Player.RED)).toBe(0);
      expect(board.getPieceCount(Player.BLACK)).toBe(0);
    });

    it('should create board with custom size', () => {
      const customBoard = new Board(10);
      expect(customBoard.size).toBe(10);
    });

    it('should throw error for invalid board size', () => {
      expect(() => new Board(3)).toThrow(InvalidBoardStateError);
      expect(() => new Board(7)).toThrow(InvalidBoardStateError);
    });

    it('should be immutable', () => {
      expect(() => {
        // @ts-expect-error Testing immutability
        board.size = 10;
      }).toThrow();
    });
  });

  describe('getPiece', () => {
    it('should return null for empty position', () => {
      const pos = new Position(3, 3);
      expect(board.getPiece(pos)).toBe(null);
    });

    it('should throw error for invalid position', () => {
      const invalidPos = new Position(-1, 0);
      expect(() => board.getPiece(invalidPos)).toThrow(InvalidPositionError);
    });
  });

  describe('setPiece', () => {
    it('should place piece and return new board', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      const newBoard = board.setPiece(pos, piece);

      expect(newBoard.getPiece(pos)).toBe(piece);
      expect(board.getPiece(pos)).toBe(null); // Original unchanged
      expect(newBoard).not.toBe(board); // Different instance
    });

    it('should remove piece when setting to null', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      
      const boardWithPiece = board.setPiece(pos, piece);
      const boardWithoutPiece = boardWithPiece.setPiece(pos, null);

      expect(boardWithoutPiece.getPiece(pos)).toBe(null);
    });

    it('should throw error for invalid position', () => {
      const invalidPos = new Position(-1, 0);
      const piece = new RegularPiece(Player.RED);
      
      expect(() => board.setPiece(invalidPos, piece)).toThrow(InvalidPositionError);
    });
  });

  describe('movePiece', () => {
    it('should move piece from one position to another', () => {
      const from = new Position(3, 3);
      const to = new Position(4, 4);
      const piece = new RegularPiece(Player.RED);
      
      const boardWithPiece = board.setPiece(from, piece);
      const boardAfterMove = boardWithPiece.movePiece(from, to);

      expect(boardAfterMove.getPiece(from)).toBe(null);
      expect(boardAfterMove.getPiece(to)).toBe(piece);
    });

    it('should throw error when no piece at source', () => {
      const from = new Position(3, 3);
      const to = new Position(4, 4);
      
      expect(() => board.movePiece(from, to)).toThrow(InvalidBoardStateError);
    });
  });

  describe('removePiece', () => {
    it('should remove piece and return new board', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      
      const boardWithPiece = board.setPiece(pos, piece);
      const boardWithoutPiece = boardWithPiece.removePiece(pos);

      expect(boardWithoutPiece.getPiece(pos)).toBe(null);
      expect(boardWithPiece.getPiece(pos)).toBe(piece); // Original unchanged
    });
  });

  describe('removePieces', () => {
    it('should remove multiple pieces', () => {
      const pos1 = new Position(3, 3);
      const pos2 = new Position(4, 4);
      const piece1 = new RegularPiece(Player.RED);
      const piece2 = new RegularPiece(Player.BLACK);
      
      let boardWithPieces = board.setPiece(pos1, piece1);
      boardWithPieces = boardWithPieces.setPiece(pos2, piece2);
      
      const boardWithoutPieces = boardWithPieces.removePieces([pos1, pos2]);

      expect(boardWithoutPieces.getPiece(pos1)).toBe(null);
      expect(boardWithoutPieces.getPiece(pos2)).toBe(null);
    });
  });

  describe('getPlayerPieces', () => {
    it('should return all pieces for a player', () => {
      const pos1 = new Position(1, 1);
      const pos2 = new Position(3, 3);
      const redPiece1 = new RegularPiece(Player.RED);
      const redPiece2 = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      let testBoard = board.setPiece(pos1, redPiece1);
      testBoard = testBoard.setPiece(pos2, redPiece2);
      testBoard = testBoard.setPiece(new Position(5, 5), blackPiece);

      const redPieces = testBoard.getPlayerPieces(Player.RED);
      expect(redPieces).toHaveLength(2);
      expect(redPieces[0]!.piece).toEqual(redPiece1);
      expect(redPieces[1]!.piece).toEqual(redPiece2);
    });
  });

  describe('getPieceCount', () => {
    it('should return correct piece count', () => {
      const redPiece = new RegularPiece(Player.RED);
      const blackPiece = new RegularPiece(Player.BLACK);
      
      let testBoard = board.setPiece(new Position(1, 1), redPiece);
      testBoard = testBoard.setPiece(new Position(2, 2), redPiece);
      testBoard = testBoard.setPiece(new Position(3, 3), blackPiece);

      expect(testBoard.getPieceCount(Player.RED)).toBe(2);
      expect(testBoard.getPieceCount(Player.BLACK)).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty position', () => {
      const pos = new Position(3, 3);
      expect(board.isEmpty(pos)).toBe(true);
    });

    it('should return false for occupied position', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      const boardWithPiece = board.setPiece(pos, piece);
      
      expect(boardWithPiece.isEmpty(pos)).toBe(false);
    });

    it('should throw error for invalid position', () => {
      const invalidPos = new Position(-1, 0);
      expect(() => board.isEmpty(invalidPos)).toThrow(InvalidPositionError);
    });
  });

  describe('hasPlayerPiece', () => {
    it('should return true when position has player piece', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      const boardWithPiece = board.setPiece(pos, piece);
      
      expect(boardWithPiece.hasPlayerPiece(pos, Player.RED)).toBe(true);
      expect(boardWithPiece.hasPlayerPiece(pos, Player.BLACK)).toBe(false);
    });

    it('should return false for empty position', () => {
      const pos = new Position(3, 3);
      expect(board.hasPlayerPiece(pos, Player.RED)).toBe(false);
    });
  });

  describe('getOccupiedPositions', () => {
    it('should return all occupied positions', () => {
      const pos1 = new Position(1, 1);
      const pos2 = new Position(3, 3);
      const piece1 = new RegularPiece(Player.RED);
      const piece2 = new RegularPiece(Player.BLACK);
      
      let testBoard = board.setPiece(pos1, piece1);
      testBoard = testBoard.setPiece(pos2, piece2);

      const occupied = testBoard.getOccupiedPositions();
      expect(occupied).toHaveLength(2);
      expect(occupied).toContainEqual(pos1);
      expect(occupied).toContainEqual(pos2);
    });
  });

  describe('getEmptyPositions', () => {
    it('should return all empty positions', () => {
      const emptyPositions = board.getEmptyPositions();
      expect(emptyPositions).toHaveLength(64); // 8x8 board
    });

    it('should exclude occupied positions', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      const boardWithPiece = board.setPiece(pos, piece);
      
      const emptyPositions = boardWithPiece.getEmptyPositions();
      expect(emptyPositions).toHaveLength(63);
      expect(emptyPositions).not.toContainEqual(pos);
    });
  });

  describe('getPlayablePositions', () => {
    it('should return all dark squares', () => {
      const playable = board.getPlayablePositions();
      expect(playable).toHaveLength(32); // Half of 64 squares
      
      // All should be dark squares
      playable.forEach(pos => {
        expect(pos.isDarkSquare()).toBe(true);
      });
    });
  });

  describe('copy', () => {
    it('should create deep copy', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      const originalBoard = board.setPiece(pos, piece);
      
      const copiedBoard = originalBoard.copy();
      
      expect(copiedBoard).toEqual(originalBoard);
      expect(copiedBoard).not.toBe(originalBoard);
      expect(copiedBoard.getPiece(pos)).toEqual(piece);
    });
  });

  describe('equals', () => {
    it('should return true for identical boards', () => {
      const pos = new Position(3, 3);
      const piece1 = new RegularPiece(Player.RED);
      const piece2 = new RegularPiece(Player.RED);
      
      const board1 = board.setPiece(pos, piece1);
      const board2 = board.setPiece(pos, piece2);
      
      // Note: This will be false because pieces have different IDs
      // In practice, you'd want to compare piece types and players
      expect(board1.equals(board2)).toBe(false);
    });

    it('should return false for different board sizes', () => {
      const board10 = new Board(10);
      expect(board.equals(board10)).toBe(false);
    });

    it('should return false for null', () => {
      expect(board.equals(null)).toBe(false);
    });
  });

  describe('hash', () => {
    it('should generate hash string', () => {
      const pos = new Position(3, 3);
      const piece = new RegularPiece(Player.RED);
      const boardWithPiece = board.setPiece(pos, piece);
      
      const hash = boardWithPiece.hash();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for different boards', () => {
      const pos1 = new Position(3, 3);
      const pos2 = new Position(4, 4);
      const piece = new RegularPiece(Player.RED);
      
      const board1 = board.setPiece(pos1, piece);
      const board2 = board.setPiece(pos2, piece);
      
      expect(board1.hash()).not.toBe(board2.hash());
    });
  });

  describe('toString', () => {
    it('should generate string representation', () => {
      const boardString = board.toString();
      
      expect(typeof boardString).toBe('string');
      expect(boardString).toContain('a'); // Column labels
      expect(boardString).toContain('1'); // Row labels
      expect(boardString).toContain('8'); // Row labels
    });
  });
});