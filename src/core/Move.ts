import { Position } from './Position';
import { Board } from './Board';

/**
 * Immutable class representing a game move.
 */
export class Move {
  constructor(
    public readonly from: Position,
    public readonly to: Position,
    public readonly captures: ReadonlyArray<Position> = [],
    public readonly isPromotion: boolean = false
  ) {
    Object.freeze(this.captures);
    Object.freeze(this);
  }

  /**
   * Checks if this is a capture move.
   */
  isCapture(): boolean {
    return this.captures.length > 0;
  }

  /**
   * Checks if this is a multi-capture move.
   */
  isMultiCapture(): boolean {
    return this.captures.length > 1;
  }

  /**
   * Gets the number of captures in this move.
   */
  getCaptureCount(): number {
    return this.captures.length;
  }

  /**
   * Checks if this move is diagonal.
   */
  isDiagonal(): boolean {
    return this.from.isOnSameDiagonalAs(this.to);
  }

  /**
   * Gets the distance of this move.
   */
  getDistance(): number {
    return this.from.diagonalDistanceTo(this.to);
  }

  /**
   * Checks if this is a valid distance for a regular move.
   */
  isValidDistance(): boolean {
    const distance = this.getDistance();
    return distance > 0 && (this.isCapture() ? distance === 2 : distance === 1);
  }

  /**
   * Applies this move to a board (returns new Board).
   */
  apply(board: Board): Board {
    // Move the piece
    let newBoard = board.movePiece(this.from, this.to);
    
    // Remove captured pieces
    if (this.captures.length > 0) {
      newBoard = newBoard.removePieces([...this.captures]);
    }
    
    // Handle promotion if needed
    if (this.isPromotion) {
      const piece = newBoard.getPiece(this.to);
      if (piece) {
        newBoard = newBoard.setPiece(this.to, piece.promote());
      }
    }
    
    return newBoard;
  }

  /**
   * Creates a new move with additional captures.
   */
  withCaptures(additionalCaptures: Position[]): Move {
    return new Move(
      this.from,
      this.to,
      [...this.captures, ...additionalCaptures],
      this.isPromotion
    );
  }

  /**
   * Creates a new move marked as promotion.
   */
  withPromotion(): Move {
    return new Move(this.from, this.to, this.captures, true);
  }

  /**
   * Checks if this move equals another move.
   */
  equals(other: Move | null): boolean {
    if (!other) return false;
    
    if (!this.from.equals(other.from) || !this.to.equals(other.to)) {
      return false;
    }
    
    if (this.captures.length !== other.captures.length) {
      return false;
    }
    
    // Check if captures match (order matters)
    for (let i = 0; i < this.captures.length; i++) {
      if (!this.captures[i]!.equals(other.captures[i]!)) {
        return false;
      }
    }
    
    return this.isPromotion === other.isPromotion;
  }

  /**
   * Converts move to string notation (e.g., "a3-b4" or "a3xc5").
   */
  toString(): string {
    const separator = this.isCapture() ? 'x' : '-';
    let notation = `${this.from}${separator}${this.to}`;
    
    if (this.isMultiCapture()) {
      notation += ` (${this.captures.length} captures)`;
    }
    
    if (this.isPromotion) {
      notation += '=K';
    }
    
    return notation;
  }

  /**
   * Parses a move from string notation.
   */
  static fromString(notation: string): Move {
    // Remove promotion indicator
    const isPromotion = notation.includes('=K');
    notation = notation.replace('=K', '');
    
    // Check for capture notation
    const isCapture = notation.includes('x');
    const separator = isCapture ? 'x' : '-';
    
    const parts = notation.split(separator);
    if (parts.length !== 2) {
      throw new Error(`Invalid move notation: ${notation}`);
    }
    
    const from = Position.fromString(parts[0]!);
    const to = Position.fromString(parts[1]!);
    
    // For captures, calculate the captured position
    const captures: Position[] = [];
    if (isCapture) {
      const capturedPositions = from.getPositionsBetween(to);
      if (capturedPositions.length === 1) {
        captures.push(capturedPositions[0]!);
      }
    }
    
    return new Move(from, to, captures, isPromotion);
  }

  /**
   * Creates a capture move between two positions.
   */
  static createCapture(from: Position, to: Position, captured: Position): Move {
    return new Move(from, to, [captured]);
  }

  /**
   * Creates a multi-capture move.
   */
  static createMultiCapture(positions: Position[], captures: Position[]): Move {
    if (positions.length < 2) {
      throw new Error('Multi-capture requires at least 2 positions');
    }
    
    return new Move(
      positions[0]!,
      positions[positions.length - 1]!,
      captures
    );
  }

  /**
   * Gets a hash representation of this move.
   */
  hash(): string {
    const capturesStr = this.captures
      .map(pos => pos.hash())
      .sort()
      .join(',');
    
    return `${this.from.hash()}-${this.to.hash()}-${capturesStr}-${this.isPromotion}`;
  }

  /**
   * Gets the direction of this move.
   */
  getDirection(): 'NW' | 'NE' | 'SW' | 'SE' | null {
    return this.from.getDirectionTo(this.to);
  }

  /**
   * Checks if this move is forward for the given player.
   */
  isForward(player: 'RED' | 'BLACK'): boolean {
    const direction = this.getDirection();
    if (!direction) return false;
    
    if (player === 'RED') {
      return direction === 'NW' || direction === 'NE';
    } else {
      return direction === 'SW' || direction === 'SE';
    }
  }

  /**
   * Gets intermediate positions for multi-jump moves.
   */
  getIntermediatePositions(): Position[] {
    // For simple moves, just return positions between from and to
    if (!this.isMultiCapture()) {
      return this.from.getPositionsBetween(this.to);
    }
    
    // For multi-captures, this would need more complex logic
    // based on the capture sequence
    return [];
  }
}