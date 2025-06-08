import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';
import { RuleEngine } from '../rules/RuleEngine'; // Import RuleEngine

/**
 * Validates that mandatory captures are taken when available.
 */
export class MandatoryCaptureValidator extends BaseMoveValidator {
  private readonly ruleEngine: RuleEngine;

  constructor(ruleEngine: RuleEngine) { // Accept RuleEngine instance
    super(20, 'MandatoryCaptureValidator');
    this.ruleEngine = ruleEngine;
  }

  validateMove(board: Board, move: Move, player: Player): boolean {
    // Ask the rule engine if captures are mandatory for this player
    if (!this.ruleEngine.areCapturesMandatory(board, player)) {
      // If not mandatory, this validator has no further checks.
      // However, if the move IS a capture, it should still be valid on its own.
      // If it's NOT a capture, it's fine.
      return true;
    }

    // Captures ARE mandatory. Get the list of mandatory moves from the rule engine.
    // The rule engine is responsible for determining what constitutes a "mandatory" capture
    // (e.g., simple existence of any capture, or longest capture sequence).
    const mandatoryMoves = this.ruleEngine.getMandatoryMoves(board, player);

    // If mandatoryMoves is empty, it implies a contradiction with areCapturesMandatory returning true,
    // or that areCapturesMandatory has a more nuanced meaning (e.g. captures *could* be made).
    // For safety, if no specific mandatory moves are returned, allow any move that is a capture.
    if (mandatoryMoves.length === 0) {
        if (!move.isCapture()) {
            throw new InvalidMoveError(
                move,
                'A capture is mandatory, but no specific mandatory capture moves were identified. Move must be a capture.'
            );
        }
        return true; // Allow any capture if no specific ones are listed as mandatory but captures are generally required
    }

    // If captures are mandatory and specific mandatory moves are listed,
    // the current move must be one of them.
    if (!move.isCapture()) {
      throw new InvalidMoveError(
        move, 
        'Captures are mandatory and this move is not a capture.'
      );
    }

    const isAmongMandatory = mandatoryMoves.some(m => m.equals(move));
    if (!isAmongMandatory) {
      throw new InvalidMoveError(
        move, 
        'Move is not among the required mandatory capture moves.'
      );
    }

    return true;
  }

  // The methods getAllCaptureMoves, movesAreEquivalent, and hasMaximumCaptureRule
  // are no longer needed here as their logic is now encapsulated within the RuleEngine's
  // areCapturesMandatory and getMandatoryMoves methods.
}