import { RegularPiece } from '../../src/pieces/RegularPiece';
import { KingPiece } from '../../src/pieces/KingPiece';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Player, Direction } from '../../src/types';

describe('RegularPiece', () => {
  let redPiece: RegularPiece;
  let blackPiece: RegularPiece;
  let board: Board;

  beforeEach(() => {
    redPiece = new RegularPiece(Player.RED);
    blackPiece = new RegularPiece(Player.BLACK);
    board = new Board();
  });

  describe('constructor', () => {
    it('should create piece with correct player', () => {
      expect(redPiece.player).toBe(Player.RED);
      expect(blackPiece.player).toBe(Player.BLACK);
    });

    it('should generate unique IDs', () => {
      const piece1 = new RegularPiece(Player.RED);
      const piece2 = new RegularPiece(Player.RED);
      
      expect(piece1.getId()).not.toBe(piece2.getId());
    });
  });

  describe('canMove', () => {
    beforeEach(() => {
      board = board.setPiece(new Position(3, 3), redPiece);
    });

    it('should allow forward diagonal moves', () => {
      // Red moves toward row 0
      expect(redPiece.canMove(new Position(3, 3), new Position(2, 2), board)).toBe(true);
      expect(redPiece.canMove(new Position(3, 3), new Position(2, 4), board)).toBe(true);
    });

    it('should not allow backward moves for regular pieces', () => {
      expect(redPiece.canMove(new Position(3, 3), new Position(4, 2), board)).toBe(false);
      expect(redPiece.canMove(new Position(3, 3), new Position(4, 4), board)).toBe(false);
    });

    it('should not allow non-diagonal moves', () => {
      expect(redPiece.canMove(new Position(3, 3), new Position(3, 4), board)).toBe(false);
      expect(redPiece.canMove(new Position(3, 3), new Position(2, 3), board)).toBe(false);
    });

    it('should not allow moves to occupied squares', () => {
      const occupiedBoard = board.setPiece(new Position(2, 2), blackPiece);
      expect(redPiece.canMove(new Position(3, 3), new Position(2, 2), occupiedBoard)).toBe(false);
    });

    it('should allow capture moves', () => {
      // Place enemy piece to capture
      const captureBoard = board.setPiece(new Position(4, 4), blackPiece);
      expect(redPiece.canMove(new Position(3, 3), new Position(5, 5), captureBoard)).toBe(true);
    });

    it('should not allow capture of own pieces', () => {
      const ownPieceBoard = board.setPiece(new Position(4, 4), new RegularPiece(Player.RED));
      expect(redPiece.canMove(new Position(3, 3), new Position(5, 5), ownPieceBoard)).toBe(false);
    });
  });

  describe('getPossibleMoves', () => {
    it('should return forward diagonal moves for red', () => {
      board = board.setPiece(new Position(3, 3), redPiece);
      const moves = redPiece.getPossibleMoves(new Position(3, 3), board);
      
      expect(moves).toContainEqual(new Position(2, 2));
      expect(moves).toContainEqual(new Position(2, 4));
      expect(moves).not.toContainEqual(new Position(4, 2));
      expect(moves).not.toContainEqual(new Position(4, 4));
    });

    it('should return forward diagonal moves for black', () => {
      board = board.setPiece(new Position(3, 3), blackPiece);
      const moves = blackPiece.getPossibleMoves(new Position(3, 3), board);
      
      expect(moves).toContainEqual(new Position(4, 2));
      expect(moves).toContainEqual(new Position(4, 4));
      expect(moves).not.toContainEqual(new Position(2, 2));
      expect(moves).not.toContainEqual(new Position(2, 4));
    });

    it('should exclude blocked moves', () => {
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(2, 2), blackPiece); // Block one direction
      
      const moves = redPiece.getPossibleMoves(new Position(3, 3), board);
      
      expect(moves).not.toContainEqual(new Position(2, 2));
      expect(moves).toContainEqual(new Position(2, 4));
    });
  });

  describe('getCaptureMoves', () => {
    it('should return capture moves', () => {
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(4, 4), blackPiece); // Enemy to capture
      
      const captureMoves = redPiece.getCaptureMoves(new Position(3, 3), board);
      
      expect(captureMoves).toHaveLength(1);
      expect(captureMoves[0]!.to).toEqual(new Position(5, 5));
      expect(captureMoves[0]!.captures).toContainEqual(new Position(4, 4));
    });

    it('should return empty array when no captures available', () => {
      board = board.setPiece(new Position(3, 3), redPiece);
      
      const captureMoves = redPiece.getCaptureMoves(new Position(3, 3), board);
      expect(captureMoves).toHaveLength(0);
    });

    it('should not capture own pieces', () => {
      board = board.setPiece(new Position(3, 3), redPiece);
      board = board.setPiece(new Position(4, 4), new RegularPiece(Player.RED)); // Own piece
      
      const captureMoves = redPiece.getCaptureMoves(new Position(3, 3), board);
      expect(captureMoves).toHaveLength(0);
    });
  });

  describe('copy', () => {
    it('should create exact copy', () => {
      const copy = redPiece.copy();
      
      expect(copy).toBeInstanceOf(RegularPiece);
      expect(copy.player).toBe(redPiece.player);
      expect(copy.getId()).toBe(redPiece.getId());
      expect(copy).not.toBe(redPiece); // Different instance
    });
  });

  describe('promote', () => {
    it('should return king piece', () => {
      const king = redPiece.promote();
      
      expect(king).toBeInstanceOf(KingPiece);
      expect(king.player).toBe(redPiece.player);
      expect(king.getId()).toBe(redPiece.getId());
    });
  });

  describe('getValue', () => {
    it('should return 1 for regular pieces', () => {
      expect(redPiece.getValue()).toBe(1);
    });
  });

  describe('getSymbol', () => {
    it('should return correct symbols', () => {
      expect(redPiece.getSymbol()).toBe('r');
      expect(blackPiece.getSymbol()).toBe('b');
    });
  });

  describe('getMoveDirections', () => {
    it('should return forward directions for red', () => {
      const directions = redPiece.getMoveDirections();
      expect(directions).toContain(Direction.NORTH_WEST);
      expect(directions).toContain(Direction.NORTH_EAST);
      expect(directions).not.toContain(Direction.SOUTH_WEST);
      expect(directions).not.toContain(Direction.SOUTH_EAST);
    });

    it('should return forward directions for black', () => {
      const directions = blackPiece.getMoveDirections();
      expect(directions).toContain(Direction.SOUTH_WEST);
      expect(directions).toContain(Direction.SOUTH_EAST);
      expect(directions).not.toContain(Direction.NORTH_WEST);
      expect(directions).not.toContain(Direction.NORTH_EAST);
    });
  });

  describe('canCaptureInDirection', () => {
    it('should allow captures in any direction', () => {
      expect(redPiece.canCaptureInDirection(Direction.NORTH_WEST)).toBe(true);
      expect(redPiece.canCaptureInDirection(Direction.SOUTH_EAST)).toBe(true);
    });
  });

  describe('getMaxMoveDistance', () => {
    it('should return 1 for regular pieces', () => {
      expect(redPiece.getMaxMoveDistance()).toBe(1);
    });
  });

  describe('isKing', () => {
    it('should return false for regular pieces', () => {
      expect(redPiece.isKing()).toBe(false);
    });
  });

  describe('belongsTo', () => {
    it('should correctly identify ownership', () => {
      expect(redPiece.belongsTo(Player.RED)).toBe(true);
      expect(redPiece.belongsTo(Player.BLACK)).toBe(false);
    });
  });

  describe('isOpponentOf', () => {
    it('should correctly identify opponents', () => {
      expect(redPiece.isOpponentOf(Player.BLACK)).toBe(true);
      expect(redPiece.isOpponentOf(Player.RED)).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for same piece', () => {
      expect(redPiece.equals(redPiece)).toBe(true);
    });

    it('should return false for different pieces', () => {
      const anotherPiece = new RegularPiece(Player.RED);
      expect(redPiece.equals(anotherPiece)).toBe(false);
    });

    it('should return false for null', () => {
      expect(redPiece.equals(null)).toBe(false);
    });
  });
});