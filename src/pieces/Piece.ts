import { Player, Direction } from '../types';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';

/**
 * Abstract base class for all game pieces.
 * Extend this class to create custom piece types.
 */
export abstract class Piece {
  constructor(
    public readonly player: Player,
    protected readonly id: string = Math.random().toString(36).substr(2, 9)
  ) {}

  /**
   * Checks if this piece can move from one position to another.
   */
  abstract canMove(from: Position, to: Position, board: Board): boolean;

  /**
   * Gets all possible non-capture moves from a position.
   */
  abstract getPossibleMoves(position: Position, board: Board): Position[];

  /**
   * Gets all possible capture moves from a position.
   */
  abstract getCaptureMoves(position: Position, board: Board): Move[];

  /**
   * Creates a copy of this piece.
   */
  abstract copy(): Piece;

  /**
   * Promotes this piece (e.g., regular to king).
   * Default implementation returns self (no promotion).
   */
  abstract promote(): Piece;

  /**
   * Gets the value of this piece for evaluation.
   */
  abstract getValue(): number;

  /**
   * Gets the symbol representation of this piece.
   */
  abstract getSymbol(): string;

  /**
   * Gets the directions this piece can move.
   */
  abstract getMoveDirections(): Direction[];

  /**
   * Checks if this piece can capture in a given direction.
   */
  abstract canCaptureInDirection(direction: Direction): boolean;

  /**
   * Gets the maximum distance this piece can move.
   */
  abstract getMaxMoveDistance(): number;

  /**
   * Checks if this piece is a king.
   */
  abstract isKing(): boolean;

  /**
   * Checks if this piece belongs to the given player.
   */
  belongsTo(player: Player): boolean {
    return this.player === player;
  }

  /**
   * Checks if this piece is an opponent of the given player.
   */
  isOpponentOf(player: Player): boolean {
    return this.player !== player;
  }

  /**
   * Gets a unique identifier for this piece.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Checks if this piece equals another piece.
   */
  equals(other: Piece | null): boolean {
    if (!other) return false;
    return this.id === other.id && this.player === other.player;
  }

  /**
   * Helper method to check if a position is valid and empty.
   */
  protected isValidEmptyPosition(position: Position, board: Board): boolean {
    return board.isValidPosition(position) && board.isEmpty(position);
  }

  /**
   * Helper method to check if a position contains an opponent.
   */
  protected hasOpponent(position: Position, board: Board): boolean {
    const piece = board.getPiece(position);
    return piece !== null && piece.isOpponentOf(this.player);
  }

  /**
   * Helper method to get positions in a direction.
   */
  protected getPositionsInDirection(
    start: Position,
    direction: Direction,
    maxDistance: number = 1,
    boardSize: number = 8
  ): Position[] {
    const positions: Position[] = [];
    let current = start;

    for (let i = 0; i < maxDistance; i++) {
      const next = this.getNextPosition(current, direction, boardSize);
      if (!next) break;
      positions.push(next);
      current = next;
    }

    return positions;
  }

  /**
   * Helper method to get the next position in a direction.
   */
  protected getNextPosition(position: Position, direction: Direction, boardSize: number = 8): Position | null {
    let { row, col } = position;

    switch (direction) {
    case Direction.NORTH_WEST:
      row--; col--;
      break;
    case Direction.NORTH_EAST:
      row--; col++;
      break;
    case Direction.SOUTH_WEST:
      row++; col--;
      break;
    case Direction.SOUTH_EAST:
      row++; col++;
      break;
    }

    const newPos = new Position(row, col);
    return newPos.isValid(boardSize) ? newPos : null;
  }
}