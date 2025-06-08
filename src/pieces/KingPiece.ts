import { Piece } from './Piece';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player, Direction, PieceType } from '../types';

/**
 * King piece that can move in all diagonal directions.
 */
export class KingPiece extends Piece {
  public readonly type: PieceType = PieceType.KING;

  // canMove, getPossibleMoves, getCaptureMoves, and promote are removed.
  // Logic is now delegated to RuleEngine.

  /**
   * Creates a copy of this piece.
   */
  copy(): KingPiece {
    return new KingPiece(this.player, this.id);
  }

  // promote() is removed from base class.

  /**
   * Gets the value of a king piece (typically 3-4).
   */
  getValue(): number {
    return 3;
  }

  /**
   * Gets the symbol for display.
   */
  getSymbol(): string {
    return this.player === Player.RED ? 'R' : 'B';
  }

  /**
   * Kings can move in all diagonal directions.
   */
  getMoveDirections(): Direction[] {
    return [
      Direction.NORTH_WEST,
      Direction.NORTH_EAST,
      Direction.SOUTH_WEST,
      Direction.SOUTH_EAST
    ];
  }

  /**
   * Kings can capture in any direction.
   */
  canCaptureInDirection(_direction: Direction): boolean {
    return true;
  }

  /**
   * Kings can move across the entire board.
   */
  getMaxMoveDistance(): number {
    return 7; // Maximum for 8x8 board
  }

  /**
   * This is a king piece.
   * This is now inherited from Piece class and will correctly return true
   * based on this.type === PieceType.KING.
   */
  // isKing(): boolean {
  //  return true;
  // }

  // Private helper methods isPathClear, getCapturesInDirection, and isAlreadyCaptured
  // are no longer used locally. Their logic has been incorporated into AmericanCheckersRules
  // or similar helpers if needed there.
}