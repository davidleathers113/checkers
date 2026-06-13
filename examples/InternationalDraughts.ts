import { StandardRules } from '../src/rules/StandardRules';
import { Board } from '../src/core/Board';
import { Position } from '../src/core/Position';
import { Player } from '../src/types';
import { RegularPiece } from '../src/pieces/RegularPiece';

/**
 * International Draughts (10x10).
 *
 * The engine's core already provides the rules that distinguish International
 * Draughts from a naive game: flying kings (see {@link KingPiece}), captures in
 * any diagonal direction for men, multi-jump sequences, and the mandatory
 * maximum-capture rule (see {@link StandardRules.getMandatoryMoves}). So this
 * variant only needs the larger board and its four-rows-per-side setup; all
 * move generation and validation are inherited and stay consistent.
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
          board = board.setPiece(pos, new RegularPiece(Player.BLACK));
        }
      }
    }

    // Red pieces fill the bottom four rows.
    for (let row = 6; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new RegularPiece(Player.RED));
        }
      }
    }

    return board;
  }
}
