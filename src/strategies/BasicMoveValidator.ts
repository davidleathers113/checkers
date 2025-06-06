import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Validates basic move properties like board boundaries and piece existence.
 */
export class BasicMoveValidator extends BaseMoveValidator {
  constructor() {
    super(0, 'BasicMoveValidator'); // Highest priority
  }

  validateMove(board: Board, move: Move, player: Player): boolean {
    // Check if move positions are valid
    if (!board.isValidPosition(move.from)) {
      throw new InvalidMoveError(move, 'Source position is invalid');
    }

    if (!board.isValidPosition(move.to)) {
      throw new InvalidMoveError(move, 'Destination position is invalid');
    }

    // Check if there's a piece at the source position
    const piece = board.getPiece(move.from);
    if (!piece) {
      throw new InvalidMoveError(move, 'No piece at source position');
    }

    // Check if the piece belongs to the current player
    if (piece.player !== player) {
      throw new InvalidMoveError(move, 'Piece does not belong to current player');
    }

    // Check if destination is not the same as source
    if (move.from.equals(move.to)) {
      throw new InvalidMoveError(move, 'Source and destination cannot be the same');
    }

    // Check if destination is empty
    if (!board.isEmpty(move.to)) {
      throw new InvalidMoveError(move, 'Destination position is occupied');
    }

    return true;
  }
}