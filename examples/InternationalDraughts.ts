import { StandardRules } from '../src/rules/StandardRules';
import { Board } from '../src/core/Board';
import { Position } from '../src/core/Position';
import { Player, Direction } from '../src/types';
import { RegularPiece } from '../src/pieces/RegularPiece';

/**
 * An International Draughts man. Unlike a standard (American) man — which
 * captures forward only — a draughts man may capture in any diagonal direction,
 * so it overrides {@link getCaptureDirections}. It is otherwise a regular piece
 * (it still *moves* forward only and promotes to a king on the far row).
 */
export class InternationalManPiece extends RegularPiece {
  override getCaptureDirections(): Direction[] {
    return [
      Direction.NORTH_WEST,
      Direction.NORTH_EAST,
      Direction.SOUTH_WEST,
      Direction.SOUTH_EAST,
    ];
  }

  override canCaptureInDirection(): boolean {
    return true;
  }

  // Preserve the type across board copies (Board.copy() calls piece.copy()).
  override copy(): InternationalManPiece {
    return new InternationalManPiece(this.player, this.id);
  }
}

/**
 * International Draughts (10x10).
 *
 * The engine's core already provides flying kings (see {@link KingPiece}),
 * multi-jump sequences, and the mandatory maximum-capture rule (see
 * {@link StandardRules.getMandatoryMoves}). This variant adds the larger board,
 * its four-rows-per-side setup, and men that capture in any direction (via
 * {@link InternationalManPiece}); all other move generation and validation are
 * inherited and stay consistent.
 */
export class InternationalDraughtsRules extends StandardRules {
  constructor(boardSize: number = 10) {
    super(boardSize);
  }

  /**
   * International setup: four rows of pieces per side on a 10x10 board.
   */
  override getInitialBoard(): Board {
    let board = new Board(10);

    // Black pieces fill the top four rows (dark squares only).
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new InternationalManPiece(Player.BLACK));
        }
      }
    }

    // Red pieces fill the bottom four rows.
    for (let row = 6; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new InternationalManPiece(Player.RED));
        }
      }
    }

    return board;
  }
}
