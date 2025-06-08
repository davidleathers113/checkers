import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Validates capture moves according to standard rules.
 */
export class CaptureValidator extends BaseMoveValidator {
  constructor() {
    super(10, 'CaptureValidator');
  }

  override shouldValidate(_board: Board, move: Move, _player: Player): boolean {
    return move.isCapture();
  }

  override validateMove(board: Board, move: Move, player: Player): boolean {
    if (!move.isCapture()) return true;

    // Validate each captured position
    for (const capturePos of move.captures) {
      // Check if capture position is valid
      if (!board.isValidPosition(capturePos)) {
        throw new InvalidMoveError(move, `Invalid capture position: ${capturePos}`);
      }

      // Check if there's a piece to capture
      const capturedPiece = board.getPiece(capturePos);
      if (!capturedPiece) {
        throw new InvalidMoveError(move, `No piece to capture at position: ${capturePos}`);
      }

      // Check if captured piece belongs to opponent
      if (capturedPiece.player === player) {
        throw new InvalidMoveError(move, 'Cannot capture own piece');
      }
    }

    // Validate that the move path includes all captures
    if (!this.validateCapturePath(board, move)) {
      throw new InvalidMoveError(move, 'Invalid capture path');
    }

    return true;
  }

  /**
   * Validates that the capture path is correct.
   */
  private validateCapturePath(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // For multi-step moves, each step's validation is handled by the rule engine
    if (move.steps.length > 1) {
      return true;
    }

    // For regular pieces, validate single jump
    if (!piece.isKing() && move.captures.length === 1) {
      return this.validateSingleJump(move);
    }

    // For kings or multi-captures, validate the entire path
    return this.validateMultiCapturePath(board, move);
  }

  /**
   * Validates a single jump capture.
   */
  private validateSingleJump(move: Move): boolean {
    const distance = move.getDistance();
    if (distance !== 2) return false;

    // The captured piece should be exactly in the middle
    const capturePos = move.captures[0]!;
    const betweenPositions = move.from.getPositionsBetween(move.to);
    
    return betweenPositions.length === 1 && 
           betweenPositions[0]!.equals(capturePos);
  }

  /**
   * Validates a multi-capture path.
   */
  private validateMultiCapturePath(_board: Board, move: Move): boolean {
    // For multi-captures, we need to validate the entire sequence
    // This is a simplified validation - more complex logic would be needed
    // for full multi-jump validation
    
    const betweenPositions = move.from.getPositionsBetween(move.to);
    
    // Each captured position should be on the path
    for (const capturePos of move.captures) {
      if (!betweenPositions.some(pos => pos.equals(capturePos))) {
        return false;
      }
    }

    return true;
  }
}