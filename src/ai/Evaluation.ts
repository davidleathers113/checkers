import { Board } from '../core/Board';
import { Player } from '../types';

/** Material and positional weights for board evaluation. */
export const MAN_VALUE = 100;
export const KING_VALUE = 175;
export const ADVANCE_BONUS = 8; // per row a man has advanced toward promotion

/** Returns the opposing player. */
export function opponentOf(player: Player): Player {
  return player === Player.RED ? Player.BLACK : Player.RED;
}

/**
 * Heuristic score of `board` from `player`'s perspective (higher is better).
 * Combines material (kings worth more than men) with how far each man has
 * advanced toward its promotion row.
 */
export function evaluateBoard(board: Board, player: Player): number {
  return sideScore(board, player) - sideScore(board, opponentOf(player));
}

function sideScore(board: Board, player: Player): number {
  let score = 0;
  for (const { position, piece } of board.getPlayerPieces(player)) {
    if (piece.isKing()) {
      score += KING_VALUE;
    } else {
      score += MAN_VALUE;
      // RED promotes at row 0; BLACK promotes at the last row.
      const rowsAdvanced =
        player === Player.RED ? board.size - 1 - position.row : position.row;
      score += rowsAdvanced * ADVANCE_BONUS;
    }
  }
  return score;
}
