import { Move } from '../../src/core/Move';
import { Position } from '../../src/core/Position';
import { Board } from '../../src/core/Board';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';

describe('Move', () => {
  let from: Position;
  let to: Position;

  beforeEach(() => {
    from = new Position(2, 2);
    to = new Position(3, 3);
  });

  describe('constructor', () => {
    it('should create a simple move', () => {
      const move = new Move(from, to);
      
      expect(move.from).toBe(from);
      expect(move.to).toBe(to);
      expect(move.captures).toHaveLength(0);
      expect(move.isPromotion).toBe(false);
    });

    it('should create a capture move', () => {
      const capture = new Position(4, 4);
      const move = new Move(from, to, [capture]);
      
      expect(move.captures).toContain(capture);
      expect(move.captures).toHaveLength(1);
    });

    it('should create a promotion move', () => {
      const move = new Move(from, to, [], true);
      expect(move.isPromotion).toBe(true);
    });

    it('should be immutable', () => {
      const move = new Move(from, to);
      
      expect(() => {
        // @ts-expect-error Testing immutability
        move.from = new Position(0, 0);
      }).toThrow();
    });
  });

  describe('isCapture', () => {
    it('should return false for non-capture move', () => {
      const move = new Move(from, to);
      expect(move.isCapture()).toBe(false);
    });

    it('should return true for capture move', () => {
      const capture = new Position(4, 4);
      const move = new Move(from, to, [capture]);
      expect(move.isCapture()).toBe(true);
    });
  });

  describe('isMultiCapture', () => {
    it('should return false for single capture', () => {
      const capture = new Position(4, 4);
      const move = new Move(from, to, [capture]);
      expect(move.isMultiCapture()).toBe(false);
    });

    it('should return true for multiple captures', () => {
      const captures = [new Position(4, 4), new Position(5, 5)];
      const move = new Move(from, to, captures);
      expect(move.isMultiCapture()).toBe(true);
    });
  });

  describe('getCaptureCount', () => {
    it('should return 0 for non-capture', () => {
      const move = new Move(from, to);
      expect(move.getCaptureCount()).toBe(0);
    });

    it('should return correct count for captures', () => {
      const captures = [new Position(4, 4), new Position(5, 5)];
      const move = new Move(from, to, captures);
      expect(move.getCaptureCount()).toBe(2);
    });
  });

  describe('isDiagonal', () => {
    it('should return true for diagonal move', () => {
      const diagonalMove = new Move(new Position(2, 2), new Position(4, 4));
      expect(diagonalMove.isDiagonal()).toBe(true);
    });

    it('should return false for non-diagonal move', () => {
      const nonDiagonalMove = new Move(new Position(2, 2), new Position(2, 4));
      expect(nonDiagonalMove.isDiagonal()).toBe(false);
    });
  });

  describe('getDistance', () => {
    it('should return correct distance', () => {
      const oneSquare = new Move(new Position(2, 2), new Position(3, 3));
      const twoSquares = new Move(new Position(2, 2), new Position(4, 4));
      
      expect(oneSquare.getDistance()).toBe(1);
      expect(twoSquares.getDistance()).toBe(2);
    });
  });

  describe('apply', () => {
    let board: Board;
    let piece: RegularPiece;

    beforeEach(() => {
      board = new Board();
      piece = new RegularPiece(Player.RED);
    });

    it('should apply simple move', () => {
      const boardWithPiece = board.setPiece(from, piece);
      const move = new Move(from, to);
      
      const newBoard = move.apply(boardWithPiece);
      
      expect(newBoard.getPiece(from)).toBe(null);
      expect(newBoard.getPiece(to)).toBe(piece);
    });

    it('should apply capture move', () => {
      const capturePos = new Position(4, 4);
      const enemyPiece = new RegularPiece(Player.BLACK);
      
      let testBoard = board.setPiece(from, piece);
      testBoard = testBoard.setPiece(capturePos, enemyPiece);
      
      const move = new Move(from, to, [capturePos]);
      const newBoard = move.apply(testBoard);
      
      expect(newBoard.getPiece(from)).toBe(null);
      expect(newBoard.getPiece(to)).toBe(piece);
      expect(newBoard.getPiece(capturePos)).toBe(null);
    });

    it('should apply promotion move', () => {
      const boardWithPiece = board.setPiece(from, piece);
      const move = new Move(from, to, [], true);
      
      const newBoard = move.apply(boardWithPiece);
      const movedPiece = newBoard.getPiece(to);
      
      expect(movedPiece).not.toBe(null);
      expect(movedPiece!.isKing()).toBe(true);
    });
  });

  describe('withCaptures', () => {
    it('should create new move with additional captures', () => {
      const move = new Move(from, to, [new Position(4, 4)]);
      const newCaptures = [new Position(5, 5), new Position(6, 6)];
      
      const newMove = move.withCaptures(newCaptures);
      
      expect(newMove.captures).toHaveLength(3);
      expect(newMove.captures).toContain(new Position(4, 4));
      expect(newMove.captures).toContain(new Position(5, 5));
      expect(newMove.captures).toContain(new Position(6, 6));
      expect(move.captures).toHaveLength(1); // Original unchanged
    });
  });

  describe('withPromotion', () => {
    it('should create new move marked as promotion', () => {
      const move = new Move(from, to);
      const promotionMove = move.withPromotion();
      
      expect(promotionMove.isPromotion).toBe(true);
      expect(move.isPromotion).toBe(false); // Original unchanged
    });
  });

  describe('equals', () => {
    it('should return true for identical moves', () => {
      const move1 = new Move(from, to, [new Position(4, 4)]);
      const move2 = new Move(from, to, [new Position(4, 4)]);
      
      expect(move1.equals(move2)).toBe(true);
    });

    it('should return false for different moves', () => {
      const move1 = new Move(from, to);
      const move2 = new Move(from, new Position(4, 4));
      
      expect(move1.equals(move2)).toBe(false);
    });

    it('should return false for different captures', () => {
      const move1 = new Move(from, to, [new Position(4, 4)]);
      const move2 = new Move(from, to, [new Position(5, 5)]);
      
      expect(move1.equals(move2)).toBe(false);
    });

    it('should return false for null', () => {
      const move = new Move(from, to);
      expect(move.equals(null)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should format simple move', () => {
      const move = new Move(new Position(2, 2), new Position(3, 3));
      const str = move.toString();
      
      expect(str).toContain('c6'); // from position
      expect(str).toContain('d5'); // to position
      expect(str).toContain('-'); // move separator
    });

    it('should format capture move', () => {
      const capture = new Position(4, 4);
      const move = new Move(from, to, [capture]);
      const str = move.toString();
      
      expect(str).toContain('x'); // capture indicator
    });

    it('should format promotion move', () => {
      const move = new Move(from, to, [], true);
      const str = move.toString();
      
      expect(str).toContain('=K'); // promotion indicator
    });

    it('should format multi-capture move', () => {
      const captures = [new Position(4, 4), new Position(5, 5)];
      const move = new Move(from, to, captures);
      const str = move.toString();
      
      expect(str).toContain('2 captures');
    });
  });

  describe('fromString', () => {
    it('should parse simple move', () => {
      const move = Move.fromString('c6-d5');
      
      expect(move.from).toEqual(new Position(2, 2));
      expect(move.to).toEqual(new Position(3, 3));
      expect(move.isCapture()).toBe(false);
    });

    it('should parse capture move', () => {
      const move = Move.fromString('c6xd5');
      
      expect(move.from).toEqual(new Position(2, 2));
      expect(move.to).toEqual(new Position(3, 3));
      expect(move.isCapture()).toBe(true);
    });

    it('should parse promotion move', () => {
      const move = Move.fromString('c6-d5=K');
      
      expect(move.from).toEqual(new Position(2, 2));
      expect(move.to).toEqual(new Position(3, 3));
      expect(move.isPromotion).toBe(true);
    });

    it('should throw error for invalid notation', () => {
      expect(() => Move.fromString('invalid')).toThrow();
      expect(() => Move.fromString('a1')).toThrow();
    });
  });

  describe('createCapture', () => {
    it('should create capture move', () => {
      const captured = new Position(4, 4);
      const move = Move.createCapture(from, to, captured);
      
      expect(move.isCapture()).toBe(true);
      expect(move.captures).toContain(captured);
    });
  });

  describe('getDirection', () => {
    it('should return correct direction', () => {
      const nwMove = new Move(new Position(4, 4), new Position(2, 2));
      const neMove = new Move(new Position(4, 4), new Position(2, 6));
      const swMove = new Move(new Position(2, 2), new Position(4, 0));
      const seMove = new Move(new Position(2, 2), new Position(4, 4));
      
      expect(nwMove.getDirection()).toBe('NW');
      expect(neMove.getDirection()).toBe('NE');
      expect(swMove.getDirection()).toBe('SW');
      expect(seMove.getDirection()).toBe('SE');
    });

    it('should return null for non-diagonal move', () => {
      const move = new Move(new Position(2, 2), new Position(2, 4));
      expect(move.getDirection()).toBe(null);
    });
  });

  describe('isForward', () => {
    it('should correctly identify forward moves for red', () => {
      const forwardMove = new Move(new Position(4, 4), new Position(3, 3));
      const backwardMove = new Move(new Position(3, 3), new Position(4, 4));
      
      expect(forwardMove.isForward('RED')).toBe(true);
      expect(backwardMove.isForward('RED')).toBe(false);
    });

    it('should correctly identify forward moves for black', () => {
      const forwardMove = new Move(new Position(3, 3), new Position(4, 4));
      const backwardMove = new Move(new Position(4, 4), new Position(3, 3));
      
      expect(forwardMove.isForward('BLACK')).toBe(true);
      expect(backwardMove.isForward('BLACK')).toBe(false);
    });
  });

  describe('hash', () => {
    it('should generate consistent hash', () => {
      const move1 = new Move(from, to, [new Position(4, 4)]);
      const move2 = new Move(from, to, [new Position(4, 4)]);
      
      expect(move1.hash()).toBe(move2.hash());
    });

    it('should generate different hashes for different moves', () => {
      const move1 = new Move(from, to);
      const move2 = new Move(to, from);
      
      expect(move1.hash()).not.toBe(move2.hash());
    });
  });
});