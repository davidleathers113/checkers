import { Position } from '../../src/core/Position';
import { InvalidPositionError } from '../../src/errors';

describe('Position', () => {
  describe('constructor', () => {
    it('should create a position with given coordinates', () => {
      const pos = new Position(3, 4);
      expect(pos.row).toBe(3);
      expect(pos.col).toBe(4);
    });

    it('should be immutable', () => {
      const pos = new Position(2, 5);
      expect(() => {
        // @ts-expect-error Testing immutability
        pos.row = 1;
      }).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal positions', () => {
      const pos1 = new Position(2, 3);
      const pos2 = new Position(2, 3);
      expect(pos1.equals(pos2)).toBe(true);
    });

    it('should return false for different positions', () => {
      const pos1 = new Position(2, 3);
      const pos2 = new Position(2, 4);
      expect(pos1.equals(pos2)).toBe(false);
    });

    it('should return false for null', () => {
      const pos = new Position(2, 3);
      expect(pos.equals(null)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true for valid positions', () => {
      expect(new Position(0, 0).isValid()).toBe(true);
      expect(new Position(7, 7).isValid()).toBe(true);
      expect(new Position(3, 4).isValid()).toBe(true);
    });

    it('should return false for invalid positions', () => {
      expect(new Position(-1, 0).isValid()).toBe(false);
      expect(new Position(0, -1).isValid()).toBe(false);
      expect(new Position(8, 0).isValid()).toBe(false);
      expect(new Position(0, 8).isValid()).toBe(false);
    });

    it('should handle custom board sizes', () => {
      expect(new Position(9, 9).isValid(10)).toBe(true);
      expect(new Position(10, 9).isValid(10)).toBe(false);
    });
  });

  describe('getDiagonalPositions', () => {
    it('should return positions at distance 1', () => {
      const pos = new Position(3, 3);
      const diagonals = pos.getDiagonalPositions();
      
      expect(diagonals).toHaveLength(4);
      expect(diagonals).toContainEqual(new Position(2, 2)); // NW
      expect(diagonals).toContainEqual(new Position(2, 4)); // NE
      expect(diagonals).toContainEqual(new Position(4, 2)); // SW
      expect(diagonals).toContainEqual(new Position(4, 4)); // SE
    });

    it('should return positions at custom distance', () => {
      const pos = new Position(3, 3);
      const diagonals = pos.getDiagonalPositions(2);
      
      expect(diagonals).toContainEqual(new Position(1, 1)); // NW
      expect(diagonals).toContainEqual(new Position(1, 5)); // NE
      expect(diagonals).toContainEqual(new Position(5, 1)); // SW
      expect(diagonals).toContainEqual(new Position(5, 5)); // SE
    });
  });

  describe('diagonalDistanceTo', () => {
    it('should return correct distance for diagonal positions', () => {
      const pos1 = new Position(2, 2);
      const pos2 = new Position(4, 4);
      expect(pos1.diagonalDistanceTo(pos2)).toBe(2);
    });

    it('should return -1 for non-diagonal positions', () => {
      const pos1 = new Position(2, 2);
      const pos2 = new Position(2, 4);
      expect(pos1.diagonalDistanceTo(pos2)).toBe(-1);
    });
  });

  describe('getDirectionTo', () => {
    it('should return correct directions', () => {
      const center = new Position(3, 3);
      
      expect(center.getDirectionTo(new Position(2, 2))).toBe('NW');
      expect(center.getDirectionTo(new Position(2, 4))).toBe('NE');
      expect(center.getDirectionTo(new Position(4, 2))).toBe('SW');
      expect(center.getDirectionTo(new Position(4, 4))).toBe('SE');
    });

    it('should return null for non-diagonal positions', () => {
      const pos1 = new Position(3, 3);
      const pos2 = new Position(3, 4);
      expect(pos1.getDirectionTo(pos2)).toBe(null);
    });
  });

  describe('getPositionsBetween', () => {
    it('should return positions between diagonal points', () => {
      const pos1 = new Position(1, 1);
      const pos2 = new Position(4, 4);
      const between = pos1.getPositionsBetween(pos2);
      
      expect(between).toHaveLength(2);
      expect(between).toContainEqual(new Position(2, 2));
      expect(between).toContainEqual(new Position(3, 3));
    });

    it('should return empty array for adjacent positions', () => {
      const pos1 = new Position(2, 2);
      const pos2 = new Position(3, 3);
      const between = pos1.getPositionsBetween(pos2);
      
      expect(between).toHaveLength(0);
    });

    it('should return empty array for non-diagonal positions', () => {
      const pos1 = new Position(2, 2);
      const pos2 = new Position(2, 4);
      const between = pos1.getPositionsBetween(pos2);
      
      expect(between).toHaveLength(0);
    });
  });

  describe('isDarkSquare', () => {
    it('should correctly identify dark squares', () => {
      expect(new Position(0, 1).isDarkSquare()).toBe(true);
      expect(new Position(1, 0).isDarkSquare()).toBe(true);
      expect(new Position(1, 2).isDarkSquare()).toBe(true);
      
      expect(new Position(0, 0).isDarkSquare()).toBe(false);
      expect(new Position(0, 2).isDarkSquare()).toBe(false);
      expect(new Position(1, 1).isDarkSquare()).toBe(false);
    });
  });

  describe('toString', () => {
    it('should convert to standard notation', () => {
      expect(new Position(0, 0).toString()).toBe('a8');
      expect(new Position(7, 0).toString()).toBe('a1');
      expect(new Position(0, 7).toString()).toBe('h8');
      expect(new Position(7, 7).toString()).toBe('h1');
      expect(new Position(3, 3).toString()).toBe('d5');
    });
  });

  describe('fromString', () => {
    it('should create position from valid notation', () => {
      expect(Position.fromString('a8')).toEqual(new Position(0, 0));
      expect(Position.fromString('h1')).toEqual(new Position(7, 7));
      expect(Position.fromString('d5')).toEqual(new Position(3, 3));
    });

    it('should throw error for invalid notation', () => {
      expect(() => Position.fromString('i1')).toThrow(InvalidPositionError);
      expect(() => Position.fromString('a9')).toThrow(InvalidPositionError);
      expect(() => Position.fromString('z0')).toThrow(InvalidPositionError);
      expect(() => Position.fromString('abc')).toThrow(InvalidPositionError);
    });
  });

  describe('offset', () => {
    it('should create new position with offset', () => {
      const pos = new Position(3, 3);
      const offset = pos.offset(1, -1);
      
      expect(offset).toEqual(new Position(4, 2));
      expect(pos).toEqual(new Position(3, 3)); // Original unchanged
    });
  });

  describe('hash', () => {
    it('should generate consistent hash', () => {
      const pos1 = new Position(2, 3);
      const pos2 = new Position(2, 3);
      
      expect(pos1.hash()).toBe(pos2.hash());
    });

    it('should generate different hashes for different positions', () => {
      const pos1 = new Position(2, 3);
      const pos2 = new Position(3, 2);
      
      expect(pos1.hash()).not.toBe(pos2.hash());
    });
  });

  describe('fromHash', () => {
    it('should recreate position from hash', () => {
      const original = new Position(3, 4);
      const hash = original.hash();
      const recreated = Position.fromHash(hash);
      
      expect(recreated).toEqual(original);
    });
  });
});