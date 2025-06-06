import { InvalidPositionError } from '../errors';

/**
 * Immutable class representing a position on the board.
 */
export class Position {
  constructor(
    public readonly row: number,
    public readonly col: number
  ) {
    Object.freeze(this);
  }

  /**
   * Checks if this position equals another position.
   */
  equals(other: Position | null): boolean {
    if (!other) return false;
    return this.row === other.row && this.col === other.col;
  }

  /**
   * Checks if this position is valid for the given board size.
   */
  isValid(boardSize: number = 8): boolean {
    return (
      this.row >= 0 &&
      this.row < boardSize &&
      this.col >= 0 &&
      this.col < boardSize
    );
  }

  /**
   * Gets diagonal positions at a given distance.
   */
  getDiagonalPositions(distance: number = 1): Position[] {
    return [
      new Position(this.row - distance, this.col - distance), // NW
      new Position(this.row - distance, this.col + distance), // NE
      new Position(this.row + distance, this.col - distance), // SW
      new Position(this.row + distance, this.col + distance), // SE
    ];
  }

  /**
   * Gets adjacent diagonal positions.
   */
  getAdjacentDiagonals(): Position[] {
    return this.getDiagonalPositions(1);
  }

  /**
   * Calculates Manhattan distance to another position.
   */
  manhattanDistanceTo(other: Position): number {
    return Math.abs(this.row - other.row) + Math.abs(this.col - other.col);
  }

  /**
   * Calculates diagonal distance to another position.
   * Returns -1 if positions are not on the same diagonal.
   */
  diagonalDistanceTo(other: Position): number {
    const rowDiff = Math.abs(this.row - other.row);
    const colDiff = Math.abs(this.col - other.col);
    
    if (rowDiff !== colDiff) return -1;
    return rowDiff;
  }

  /**
   * Checks if this position is on the same diagonal as another.
   */
  isOnSameDiagonalAs(other: Position): boolean {
    return this.diagonalDistanceTo(other) !== -1;
  }

  /**
   * Gets the direction to another position.
   * Returns null if not on a diagonal.
   */
  getDirectionTo(other: Position): 'NW' | 'NE' | 'SW' | 'SE' | null {
    if (!this.isOnSameDiagonalAs(other)) return null;
    
    const rowDiff = other.row - this.row;
    const colDiff = other.col - this.col;
    
    if (rowDiff < 0 && colDiff < 0) return 'NW';
    if (rowDiff < 0 && colDiff > 0) return 'NE';
    if (rowDiff > 0 && colDiff < 0) return 'SW';
    if (rowDiff > 0 && colDiff > 0) return 'SE';
    
    return null;
  }

  /**
   * Gets positions between this and another position.
   * Returns empty array if not on same diagonal.
   */
  getPositionsBetween(other: Position): Position[] {
    if (!this.isOnSameDiagonalAs(other)) return [];
    
    const positions: Position[] = [];
    const rowStep = other.row > this.row ? 1 : -1;
    const colStep = other.col > this.col ? 1 : -1;
    
    let currentRow = this.row + rowStep;
    let currentCol = this.col + colStep;
    
    while (currentRow !== other.row && currentCol !== other.col) {
      positions.push(new Position(currentRow, currentCol));
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return positions;
  }

  /**
   * Checks if this position is a dark square (playable in checkers).
   */
  isDarkSquare(): boolean {
    return (this.row + this.col) % 2 === 1;
  }

  /**
   * Converts position to string notation (e.g., "a1", "h8").
   */
  toString(boardSize: number = 8): string {
    const file = String.fromCharCode(97 + this.col); // a-h, etc.
    const rank = (boardSize - this.row).toString(); // 1-8, etc.
    return `${file}${rank}`;
  }

  /**
   * Creates a Position from string notation.
   */
  static fromString(notation: string, boardSize: number = 8): Position {
    if (notation.length < 2) {
      throw new InvalidPositionError(new Position(-1, -1));
    }
    
    const file = notation.charCodeAt(0) - 97;
    const rank = parseInt(notation.substring(1), 10);
    
    if (isNaN(rank) || file < 0 || file >= boardSize || rank < 1 || rank > boardSize) {
      throw new InvalidPositionError(new Position(-1, -1));
    }
    
    const row = boardSize - rank;
    return new Position(row, file);
  }

  /**
   * Creates a new position offset by the given amounts.
   */
  offset(rowOffset: number, colOffset: number): Position {
    return new Position(this.row + rowOffset, this.col + colOffset);
  }

  /**
   * Gets a unique hash for this position.
   */
  hash(): string {
    return `${this.row},${this.col}`;
  }

  /**
   * Creates a Position from a hash value.
   */
  static fromHash(hash: string): Position {
    const [row, col] = hash.split(',').map(Number);
    return new Position(row!, col!);
  }
}