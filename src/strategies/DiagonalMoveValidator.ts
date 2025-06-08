import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Validates that moves are diagonal and within piece constraints.
 */
export class DiagonalMoveValidator extends BaseMoveValidator {
  constructor() {
    super(5, 'DiagonalMoveValidator');
  }

  override validateMove(board: Board, move: Move, _player: Player): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // For multi-step moves, validate each step is diagonal
    if (move.steps.length > 1) {
      for (const step of move.steps) {
        if (!step.from.isOnSameDiagonalAs(step.to)) {
          throw new InvalidMoveError(move, 'All steps must be diagonal');
        }
      }
      // Multi-step validation is handled by the rule engine
      return true;
    }

    // Check if move is diagonal
    if (!move.isDiagonal()) {
      throw new InvalidMoveError(move, 'Checkers pieces must move diagonally');
    }

    const distance = move.getDistance();
    if (distance < 1) {
      throw new InvalidMoveError(move, 'Invalid move distance');
    }

    // For regular pieces, check distance constraints
    if (!piece.isKing()) {
      const maxDistance = move.isCapture() ? 2 : 1;
      if (distance > maxDistance) {
        throw new InvalidMoveError(
          move, 
          `Regular pieces can only move ${maxDistance} square${maxDistance > 1 ? 's' : ''}`
        );
      }

      // Check direction for regular pieces
      if (!this.isValidDirectionForRegularPiece(move, piece.player)) {
        throw new InvalidMoveError(move, 'Regular pieces can only move forward');
      }
    } else {
      // Kings can move any distance, but path must be clear (except for captures)
      if (!this.isPathValidForKing(board, move)) {
        throw new InvalidMoveError(move, 'Path is blocked for king move');
      }
    }

    return true;
  }

  /**
   * Checks if the move direction is valid for a regular piece.
   */
  private isValidDirectionForRegularPiece(move: Move, player: Player): boolean {
    const direction = move.getDirection();
    if (!direction) return false;

    if (player === Player.RED) {
      // Red moves toward row 0 (up the board)
      return direction === 'NW' || direction === 'NE';
    } else {
      // Black moves toward higher row numbers (down the board)
      return direction === 'SW' || direction === 'SE';
    }
  }

  /**
   * Validates that the path is clear for a king move.
   */
  private isPathValidForKing(board: Board, move: Move): boolean {
    const betweenPositions = move.from.getPositionsBetween(move.to);
    
    if (move.isCapture()) {
      // For captures, only captured pieces should be in the path
      const occupiedPositions = betweenPositions.filter(pos => !board.isEmpty(pos));
      const capturedPositions = move.captures;
      
      // Check that all occupied positions are captured
      return occupiedPositions.every(pos => 
        capturedPositions.some(capture => capture.equals(pos))
      );
    } else {
      // For regular moves, path must be completely clear
      return betweenPositions.every(pos => board.isEmpty(pos));
    }
  }
}