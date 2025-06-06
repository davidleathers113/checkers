import { Position } from './Position';
import { Piece } from '../pieces/Piece';
import { Player } from '../types';
import { InvalidPositionError, InvalidBoardStateError } from '../errors';

/**
 * Immutable class representing the game board.
 * All operations return new Board instances.
 */
export class Board {
  private readonly squares: ReadonlyArray<ReadonlyArray<Piece | null>>;
  private readonly pieceCount: Map<Player, number>;
  
  constructor(
    public readonly size: number = 8,
    squares?: ReadonlyArray<ReadonlyArray<Piece | null>>
  ) {
    if (size < 4 || size % 2 !== 0) {
      throw new InvalidBoardStateError('Board size must be even and at least 4');
    }
    
    this.squares = squares || this.createEmptyBoard(size);
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
    return this.squares[position.row]![position.col]!;
  }

  /**
   * Sets a piece at a position (returns new Board).
   */
  setPiece(position: Position, piece: Piece | null): Board {
    if (!this.isValidPosition(position)) {
      throw new InvalidPositionError(position);
    }

    const newSquares = this.copySquares();
    newSquares[position.row]![position.col] = piece;
    return new Board(this.size, newSquares);
  }

  /**
   * Moves a piece from one position to another (returns new Board).
   */
  movePiece(from: Position, to: Position): Board {
    if (!this.isValidPosition(from) || !this.isValidPosition(to)) {
      throw new InvalidPositionError(from.isValid(this.size) ? to : from);
    }

    const piece = this.getPiece(from);
    if (!piece) {
      throw new InvalidBoardStateError(`No piece at position ${from}`);
    }

    const newSquares = this.copySquares();
    newSquares[from.row]![from.col] = null;
    newSquares[to.row]![to.col] = piece;
    return new Board(this.size, newSquares);
  }

  /**
   * Removes a piece from a position (returns new Board).
   */
  removePiece(position: Position): Board {
    return this.setPiece(position, null);
  }

  /**
   * Removes multiple pieces (returns new Board).
   */
  removePieces(positions: Position[]): Board {
    const newSquares = this.copySquares();
    
    for (const position of positions) {
      if (this.isValidPosition(position)) {
        newSquares[position.row]![position.col] = null;
      }
    }
    
    return new Board(this.size, newSquares);
  }

  /**
   * Gets all pieces for a player.
   */
  getPlayerPieces(player: Player): Array<{ position: Position; piece: Piece }> {
    const pieces: Array<{ position: Position; piece: Piece }> = [];
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.squares[row]![col];
        if (piece && piece.player === player) {
          pieces.push({
            position: new Position(row, col),
            piece
          });
        }
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
    return this.squares[position.row]![position.col] === null;
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
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.squares[row]![col] !== null) {
          positions.push(new Position(row, col));
        }
      }
    }
    
    return positions;
  }

  /**
   * Gets all empty positions.
   */
  getEmptyPositions(): Position[] {
    const positions: Position[] = [];
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.squares[row]![col] === null) {
          positions.push(new Position(row, col));
        }
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
   * Creates a deep copy of this board.
   */
  copy(): Board {
    return new Board(this.size, this.copySquares());
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
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const thisPiece = this.squares[row]![col]!;
        const otherPiece = other.squares[row]![col]!;
        
        if (thisPiece === null && otherPiece === null) continue;
        if (thisPiece === null || otherPiece === null) return false;
        if (!thisPiece.equals(otherPiece)) return false;
      }
    }
    
    return true;
  }

  /**
   * Gets a hash representation of the board state.
   */
  hash(): string {
    const parts: string[] = [];
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.squares[row]![col];
        if (piece) {
          parts.push(`${row},${col}:${piece.player}:${piece.isKing()}`);
        }
      }
    }
    
    return parts.join('|');
  }

  /**
   * Creates an empty board.
   */
  private createEmptyBoard(size: number): ReadonlyArray<ReadonlyArray<Piece | null>> {
    const board: (Piece | null)[][] = [];
    
    for (let row = 0; row < size; row++) {
      board[row] = [];
      for (let col = 0; col < size; col++) {
        board[row]![col] = null;
      }
    }
    
    return board;
  }

  /**
   * Creates a deep copy of the squares array.
   */
  private copySquares(): (Piece | null)[][] {
    return this.squares.map(row => 
      row.map(piece => piece ? piece.copy() : null)
    );
  }

  /**
   * Calculates piece count for each player.
   */
  private calculatePieceCount(): Map<Player, number> {
    const count = new Map<Player, number>();
    count.set(Player.RED, 0);
    count.set(Player.BLACK, 0);
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.squares[row]![col];
        if (piece) {
          count.set(piece.player, (count.get(piece.player) || 0) + 1);
        }
      }
    }
    
    return count;
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
      const rowStr = this.squares[row]!.map(piece => 
        piece ? piece.getSymbol() : '.'
      ).join(' ');
      lines.push(`${rank} ${rowStr} ${rank}`);
    }
    
    // Column footers
    lines.push('  ' + Array.from({ length: this.size }, (_, i) => 
      String.fromCharCode(97 + i)
    ).join(' '));
    
    return lines.join('\n');
  }
}