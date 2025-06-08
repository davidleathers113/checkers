import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Validates basic properties of capture moves.
 * Detailed path and sequence validation is now handled by RuleEngine.
 */
export class CaptureValidator extends BaseMoveValidator {
  constructor() {
    super(10, 'CaptureValidator');
  }

  override shouldValidate(_board: Board, move: Move, _player: Player): boolean {
    // This validator should only run if the move claims to be a capture.
    return move.isCapture();
  }

  override validateMove(board: Board, move: Move, player: Player): boolean {
    // This check is technically redundant due to shouldValidate, but good for clarity.
    if (!move.isCapture()) return true;

    if (move.captures.length === 0) {
      throw new InvalidMoveError(move, 'A capture move must specify at least one captured piece position.');
    }

    // Validate each captured position
    for (const capturePos of move.captures) {
      // Check if capture position is valid on the board
      if (!board.isValidPosition(capturePos)) {
        throw new InvalidMoveError(move, `Invalid capture position: ${capturePos}. Position is off-board.`);
      }

      // Check if there's a piece to capture at the specified position
      const capturedPiece = board.getPiece(capturePos);
      if (!capturedPiece) {
        throw new InvalidMoveError(move, `No piece to capture at specified position: ${capturePos}.`);
      }

      // Check if captured piece belongs to an opponent
      if (capturedPiece.player === player) {
        throw new InvalidMoveError(move, `Cannot capture own piece at ${capturePos}.`);
      }
    }

    // The detailed validation of the jump path, whether the piece can make that jump,
    // if the landing square is empty, and if the sequence of jumps (for multi-captures)
    // is valid according to piece type (regular vs. king) and variant rules,
    // is now the responsibility of the RuleEngine's getCaptureMovesForPiece method
    // (which generates valid captures) and the RuleEngine's primary validateMove method.
    // This validator focuses on the fundamental aspects of a capture claim.

    return true;
  }

  // Removed private methods: validateCapturePath, validateSingleJump, validateMultiCapturePath
  // as this level of detail is now handled by the RuleEngine.
}