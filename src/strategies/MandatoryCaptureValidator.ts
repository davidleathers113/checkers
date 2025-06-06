import { BaseMoveValidator } from './MoveValidator';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { InvalidMoveError } from '../errors';

/**
 * Validates that mandatory captures are taken when available.
 */
export class MandatoryCaptureValidator extends BaseMoveValidator {
  constructor() {
    super(20, 'MandatoryCaptureValidator');
  }

  validateMove(board: Board, move: Move, player: Player): boolean {
    // Get all possible capture moves for the player
    const availableCaptures = this.getAllCaptureMoves(board, player);
    
    if (availableCaptures.length === 0) {
      // No captures available, any valid move is allowed
      return true;
    }

    // If captures are available, the move must be a capture
    if (!move.isCapture()) {
      throw new InvalidMoveError(
        move, 
        'Captures are mandatory when available'
      );
    }

    // Check if this move is among the valid capture moves
    const isValidCapture = availableCaptures.some(capture => 
      this.movesAreEquivalent(move, capture)
    );

    if (!isValidCapture) {
      throw new InvalidMoveError(
        move, 
        'Move is not a valid mandatory capture'
      );
    }

    // Check for maximum capture rule
    if (this.hasMaximumCaptureRule()) {
      const maxCaptures = Math.max(...availableCaptures.map(m => m.getCaptureCount()));
      if (move.getCaptureCount() < maxCaptures) {
        throw new InvalidMoveError(
          move, 
          `Must capture maximum possible pieces (${maxCaptures})`
        );
      }
    }

    return true;
  }

  /**
   * Gets all possible capture moves for a player.
   */
  private getAllCaptureMoves(board: Board, player: Player): Move[] {
    const captures: Move[] = [];
    const playerPieces = board.getPlayerPieces(player);

    for (const { position } of playerPieces) {
      const piece = board.getPiece(position);
      if (piece) {
        const captureMoves = piece.getCaptureMoves(position, board);
        captures.push(...captureMoves);
      }
    }

    return captures;
  }

  /**
   * Checks if two moves are equivalent (same from/to, captures can vary in order).
   */
  private movesAreEquivalent(move1: Move, move2: Move): boolean {
    if (!move1.from.equals(move2.from) || !move1.to.equals(move2.to)) {
      return false;
    }

    if (move1.captures.length !== move2.captures.length) {
      return false;
    }

    // Check if all captures in move1 are present in move2
    return move1.captures.every(cap1 => 
      move2.captures.some(cap2 => cap1.equals(cap2))
    );
  }

  /**
   * Determines if maximum capture rule should be enforced.
   * This could be configurable based on rule engine settings.
   */
  private hasMaximumCaptureRule(): boolean {
    return true; // Standard checkers enforces maximum captures
  }
}