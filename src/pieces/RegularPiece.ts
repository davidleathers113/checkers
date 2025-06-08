import { Piece } from './Piece';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player, Direction, PieceType } from '../types';
import { KingPiece } from './KingPiece';

/**
 * Regular checker piece that can only move forward diagonally.
 */
export class RegularPiece extends Piece {
  public readonly type: PieceType = PieceType.REGULAR;

  // canMove, getPossibleMoves, getCaptureMoves, and promote are removed.
  // Logic is now delegated to RuleEngine.

  /**
   * Creates a copy of this piece.
   */
  copy(): RegularPiece {
    return new RegularPiece(this.player, this.id);
  }

  // promote() is removed from base class.

  /**
   * Gets the value of a regular piece (typically 1).
   */
  getValue(): number {
    return 1;
  }

  /**
   * Gets the symbol for display.
   */
  getSymbol(): string {
    return this.player === Player.RED ? 'r' : 'b';
  }

  /**
   * Gets valid move directions (forward only for regular pieces).
   */
  getMoveDirections(): Direction[] {
    if (this.player === Player.RED) {
      return [Direction.NORTH_WEST, Direction.NORTH_EAST];
    } else {
      return [Direction.SOUTH_WEST, Direction.SOUTH_EAST];
    }
  }

  /**
   * Regular pieces can capture in any direction.
   */
  canCaptureInDirection(_direction: Direction): boolean {
    return true;
  }

  /**
   * Regular pieces can only move one square.
   */
  getMaxMoveDistance(): number {
    return 1;
  }

  /**
   * Regular pieces are not kings.
   * This is now inherited from Piece class and will correctly return false
   * based on this.type === PieceType.KING.
   */
  // isKing(): boolean {
  //   return false;
  // }

  // The isForwardDirection method is no longer used locally.
  // Its logic has been incorporated into AmericanCheckersRules._isForwardDirection
  // or similar helpers if needed there.
}