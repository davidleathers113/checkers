import { Position } from './Position';
import { Piece } from '../pieces/Piece';
import { Player } from '../types';
import { InvalidPositionError, InvalidBoardStateError } from '../errors';

/**
 * Immutable class representing the game board.
 * All operations return new Board instances using a performant copy-on-write strategy.
 */
export class Board {
  // The board state is now a flat, 1D array for performance.
  private readonly squares: ReadonlyArray<Piece | null>;
  private readonly pieceCount: Map<Player, number>;
  
  constructor(
    public readonly size: number = 8,
    // The constructor can accept a 1D or 2D array for flexibility.
    initialSquares?: ReadonlyArray<ReadonlyArray<Piece | null>> | ReadonlyArray<Piece | null>
  ) {
    if (size < 4 || size % 2 !== 0) {
      throw new InvalidBoardStateError('Board size must be even and at least 4');
    }
    
    if (initialSquares) {
      // Flatten if a 2D array is provided
      this.squares = Array.isArray(initialSquares[0]) 
        ? (initialSquares as ReadonlyArray<ReadonlyArray<Piece | null>>).flat() 
        : initialSquares as ReadonlyArray<Piece | null>;
    } else {
      this.squares = this.createEmptyBoard(size);
    }
    
    this.pieceCount = this.calculatePieceCount();
    Object.freeze(this.squares);
    Object.freeze(this.pieceCount);
    Object.freeze(this);
  }

  /**
   * Gets the piece at a given position.
   */
  getPiece(position: Position): Piece | null {
    if (!this.isValidPosition(position)) {
      throw new InvalidPositionError(position);
    }
    return this.squares[position.row * this.size + position.col]!;
  }

  /**
   * Sets a piece at a position using copy-on-write.
   */
  setPiece(position: Position, piece: Piece | null): Board {
    if (!this.isValidPosition(position)) {
      throw new InvalidPositionError(position);
    }

    // Create a shallow copy of the squares array. This is very fast.
    const newSquares = [...this.squares];
    
    // Mutate only the specific index in the new array.
    newSquares[position.row * this.size + position.col] = piece;
    
    // Return a new Board instance with the modified array.
    // The underlying Piece objects are still shared, which is fine due to their immutability.
    return new Board(this.size, newSquares);
  }

  /**
   * Moves a piece from one position to another.
   */
  movePiece(from: Position, to: Position): Board {
    if (!this.isValidPosition(from) || !this.isValidPosition(to)) {
      throw new InvalidPositionError(from.isValid(this.size) ? to : from);
    }

    const piece = this.getPiece(from);
    if (!piece) {
      throw new InvalidBoardStateError(`No piece at position ${from}`);
    }

    const newSquares = [...this.squares];
    newSquares[from.row * this.size + from.col] = null;
    newSquares[to.row * this.size + to.col] = piece;
    return new Board(this.size, newSquares);
  }

  /**
   * Removes a piece from a position (returns new Board).
   */
  removePiece(position: Position): Board {
    return this.setPiece(position, null);
  }

  /**
   * Removes multiple pieces.
   */
  removePieces(positions: Position[]): Board {
    const newSquares = [...this.squares];
    
    for (const position of positions) {
      if (this.isValidPosition(position)) {
        newSquares[position.row * this.size + position.col] = null;
      }
    }
    
    return new Board(this.size, newSquares);
  }

  /**
   * Gets all pieces for a player.
   */
  getPlayerPieces(player: Player): Array<{ position: Position; piece: Piece }> {
    const pieces: Array<{ position: Position; piece: Piece }> = [];
    
    for (let i = 0; i < this.squares.length; i++) {
      const piece = this.squares[i];
      if (piece && piece.player === player) {
        pieces.push({
          position: new Position(Math.floor(i / this.size), i % this.size),
          piece
        });
      }
    }
    
    return pieces;
  }

  /**
   * Gets the count of pieces for each player.
   */
  getPieceCount(player: Player): number {
    return this.pieceCount.get(player) || 0;
  }

  /**
   * Checks if a position is valid on this board.
   */
  isValidPosition(position: Position): boolean {
    return position.isValid(this.size);
  }

  /**
   * Checks if a position is empty.
   */
  isEmpty(position: Position): boolean {
    if (!this.isValidPosition(position)) {
      throw new InvalidPositionError(position);
    }
    return this.getPiece(position) === null;
  }

  /**
   * Checks if a position contains a piece of a specific player.
   */
  hasPlayerPiece(position: Position, player: Player): boolean {
    const piece = this.getPiece(position);
    return piece !== null && piece.player === player;
  }

  /**
   * Gets all occupied positions.
   */
  getOccupiedPositions(): Position[] {
    const positions: Position[] = [];
    
    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i] !== null) {
        positions.push(new Position(Math.floor(i / this.size), i % this.size));
      }
    }
    
    return positions;
  }

  /**
   * Gets all empty positions.
   */
  getEmptyPositions(): Position[] {
    const positions: Position[] = [];
    
    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i] === null) {
        positions.push(new Position(Math.floor(i / this.size), i % this.size));
      }
    }
    
    return positions;
  }

  /**
   * Gets all playable positions (dark squares).
   */
  getPlayablePositions(): Position[] {
    const positions: Position[] = [];
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          positions.push(pos);
        }
      }
    }
    
    return positions;
  }

  /**
   * Creates a deep copy ONLY when absolutely necessary. For general mutations,
   * use the copy-on-write methods (setPiece, movePiece).
   */
  copy(): Board {
    const newSquares = this.squares.map(p => p ? p.copy() : null);
    return new Board(this.size, newSquares);
  }

  /**
   * Applies a function to transform the board.
   */
  transform(fn: (board: Board) => Board): Board {
    return fn(this);
  }

  /**
   * Checks if this board equals another board.
   */
  equals(other: Board | null): boolean {
    if (!other || this.size !== other.size) return false;
    
    for (let i = 0; i < this.squares.length; i++) {
      const thisPiece = this.squares[i]!;
      const otherPiece = other.squares[i]!;
      
      if (thisPiece === null && otherPiece === null) continue;
      if (thisPiece === null || otherPiece === null) return false;
      if (!thisPiece.equals(otherPiece)) return false;
    }
    
    return true;
  }

  /**
   * Gets a hash representation of the board state.
   */
  hash(): string {
    const parts: string[] = [];
    
    for (let i = 0; i < this.squares.length; i++) {
      const piece = this.squares[i];
      if (piece) {
        const row = Math.floor(i / this.size);
        const col = i % this.size;
        parts.push(`${row},${col}:${piece.player}:${piece.isKing()}`);
      }
    }
    
    return parts.join('|');
  }

  /**
   * Converts the board to a string representation.
   */
  toString(): string {
    const lines: string[] = [];
    
    // Column headers
    lines.push('  ' + Array.from({ length: this.size }, (_, i) => 
      String.fromCharCode(97 + i)
    ).join(' '));
    
    for (let row = 0; row < this.size; row++) {
      const rank = (this.size - row).toString();
      const rowPieces: string[] = [];
      
      for (let col = 0; col < this.size; col++) {
        const piece = this.squares[row * this.size + col];
        rowPieces.push(piece ? piece.getSymbol() : '.');
      }
      
      lines.push(`${rank} ${rowPieces.join(' ')} ${rank}`);
    }
    
    // Column footers
    lines.push('  ' + Array.from({ length: this.size }, (_, i) => 
      String.fromCharCode(97 + i)
    ).join(' '));
    
    return lines.join('\n');
  }

  // --- PRIVATE METHODS ---

  private createEmptyBoard(size: number): ReadonlyArray<Piece | null> {
    return Array(size * size).fill(null);
  }

  private calculatePieceCount(): Map<Player, number> {
    const count = new Map<Player, number>([
      [Player.RED, 0],
      [Player.BLACK, 0]
    ]);
    
    for (const piece of this.squares) {
      if (piece) {
        count.set(piece.player, (count.get(piece.player) || 0) + 1);
      }
    }
    
    return count;
  }
}