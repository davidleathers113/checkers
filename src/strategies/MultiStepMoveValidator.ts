import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Fully validates explicit multi-step (multi-jump) moves.
 *
 * The single-step validators (Basic/Diagonal/Capture) intentionally defer
 * multi-step geometry to the rule engine — they only check per-step position
 * validity and diagonality. This validator closes that gap by simulating the
 * sequence on a temporary board, verifying that each landing square is empty,
 * each captured piece is an opponent sitting exactly between the step
 * endpoints, and that step distances are correct (2 for captures, 1 otherwise).
 */
export class MultiStepMoveValidator extends BaseMoveValidator {
  constructor() {
    super(15, 'MultiStepMoveValidator');
  }

  override shouldValidate(_board: Board, move: Move, _player: Player): boolean {
    return move.steps.length > 1;
  }

  override validateMove(board: Board, move: Move, player: Player): boolean {
    let tempBoard = board;
    let currentPos = move.from;

    for (const step of move.steps) {
      // Each step must continue from where the previous one ended.
      if (!step.from.equals(currentPos)) {
        throw new InvalidMoveError(move, 'Move steps are not contiguous');
      }

      // The moving piece must exist and belong to the player at this point.
      const currentPiece = tempBoard.getPiece(step.from);
      if (!currentPiece || currentPiece.player !== player) {
        throw new InvalidMoveError(move, 'No movable piece at step source position');
      }

      // Steps must be diagonal.
      if (!step.from.isOnSameDiagonalAs(step.to)) {
        throw new InvalidMoveError(move, 'All steps must be diagonal');
      }

      // The landing square must be empty on the running board.
      if (!tempBoard.isEmpty(step.to)) {
        throw new InvalidMoveError(move, 'Intermediate landing square is occupied');
      }

      if (step.captured) {
        // A capture step jumps one opponent that lies on the diagonal between
        // the endpoints, with the rest of the path clear. This covers both a
        // regular piece's two-square jump and a king's longer flying jump.
        const between = step.from.getPositionsBetween(step.to);
        if (!between.some(pos => pos.equals(step.captured!))) {
          throw new InvalidMoveError(move, 'Captured piece must lie between step endpoints');
        }

        const capturedPiece = tempBoard.getPiece(step.captured);
        if (!capturedPiece || capturedPiece.player === player) {
          throw new InvalidMoveError(move, 'Capture step must jump an opponent piece');
        }

        for (const pos of between) {
          if (!pos.equals(step.captured) && !tempBoard.isEmpty(pos)) {
            throw new InvalidMoveError(move, 'Capture path is blocked');
          }
        }

        tempBoard = tempBoard.removePiece(step.captured);
      } else {
        // Non-capture steps move a single square.
        if (step.from.diagonalDistanceTo(step.to) !== 1) {
          throw new InvalidMoveError(move, 'Non-capture step must span one square');
        }
      }

      tempBoard = tempBoard.movePiece(step.from, step.to);
      currentPos = step.to;
    }

    return true;
  }
}
