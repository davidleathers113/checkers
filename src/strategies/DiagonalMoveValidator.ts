import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Validates that moves are diagonal.
 * Detailed path, distance, and piece-specific constraints are now primarily handled by RuleEngine.
 */
export class DiagonalMoveValidator extends BaseMoveValidator {
  constructor() {
    super(5, 'DiagonalMoveValidator');
  }

  override validateMove(_board: Board, move: Move, _player: Player): boolean {
    // For multi-step moves (captures), each step should be diagonal.
    // The Move object itself should ensure its steps are diagonal if it's constructed that way.
    // If a move has steps, we assume the RuleEngine generated it correctly.
    // This validator focuses on single-step moves or the overall nature if no steps.
    if (move.steps.length > 0) {
      for (const step of move.steps) {
        if (!step.from.isOnSameDiagonalAs(step.to)) {
          throw new InvalidMoveError(move, `Step from ${step.from} to ${step.to} must be diagonal.`);
        }
      }
      // If all steps are diagonal, the overall "move" (from start of first step to end of last step)
      // will also be diagonal if it's a valid checkers jump sequence.
      return true;
    }

    // For single-segment moves (non-captures or single captures not detailed with steps)
    if (!move.isDiagonal()) {
      throw new InvalidMoveError(move, 'Move must be diagonal.');
    }

    // Distance and piece-specific direction/path checks are now deferred to RuleEngine's
    // move generation and its primary validateMove method.
    // This validator's role is simplified to the fundamental diagonal requirement.

    return true;
  }

  // Removed private methods: isValidDirectionForRegularPiece, isPathValidForKing
  // as this level of detail is now handled by the RuleEngine.
}