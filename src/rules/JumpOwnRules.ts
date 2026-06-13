import { StandardRules } from './StandardRules';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Piece } from '../pieces/Piece';
import { Player, Direction } from '../types';

const DELTAS: Record<Direction, { dRow: number; dCol: number }> = {
  [Direction.NORTH_WEST]: { dRow: -1, dCol: -1 },
  [Direction.NORTH_EAST]: { dRow: -1, dCol: 1 },
  [Direction.SOUTH_WEST]: { dRow: 1, dCol: -1 },
  [Direction.SOUTH_EAST]: { dRow: 1, dCol: 1 },
};

/**
 * "Jump Your Own Man" variant.
 *
 * In addition to the standard rules, a piece may make a non-capturing **hop**:
 * jump over one of its OWN pieces into an empty square beyond. The hopped-over
 * piece is NOT removed — it is purely a mobility rule. Regular pieces hop
 * forward only (matching their move directions); kings may hop in any diagonal
 * direction (flying-style). Hops can chain over several of your own pieces in a
 * single turn.
 *
 * Opponent captures keep their normal behaviour: they remove the captured
 * piece and remain mandatory. Hops are therefore only available when you are
 * not forced to capture an opponent.
 */
export class JumpOwnRules extends StandardRules {
  override getPossibleMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    // Mandatory opponent captures take priority — no hops while forced to jump.
    if (this.getMandatoryMoves(board, piece.player).length > 0) {
      return super.getPossibleMoves(board, position);
    }

    const base = super.getPossibleMoves(board, position);
    const hops = this.getHopMoves(board, position, piece);
    return this.dedupeMoves([...base, ...hops]);
  }

  override validateMove(board: Board, move: Move): boolean {
    // Standard moves (slides, captures) validate exactly as usual.
    if (super.validateMove(board, move)) {
      return true;
    }

    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // A hop is only legal when the player is not forced to capture.
    if (this.getMandatoryMoves(board, piece.player).length > 0) {
      return false;
    }

    return this.getHopMoves(board, move.from, piece).some(hop => hop.equals(move));
  }

  /**
   * Generates every non-capturing hop (including chained hops) available to the
   * piece at `position`. Each hop is a single relocation Move with no captures;
   * since nothing is removed, hopping over intermediate own pieces and landing
   * on the final square is equivalent to moving the piece straight there.
   */
  private getHopMoves(board: Board, position: Position, piece: Piece): Move[] {
    const results = new Map<string, Move>();
    const visited = new Set<string>([position.hash()]);

    const explore = (current: Position): void => {
      for (const direction of piece.getMoveDirections()) {
        for (const landing of this.hopLandings(board, current, direction, piece)) {
          if (visited.has(landing.hash())) continue;

          let move = new Move(position, landing, []);
          if (this.shouldPromote(landing, piece)) {
            move = move.withPromotion();
          }
          results.set(move.hash(), move);

          visited.add(landing.hash());
          explore(landing);
        }
      }
    };

    explore(position);
    return [...results.values()];
  }

  /**
   * Finds the empty landing squares reachable by hopping over an own piece in a
   * single direction from `from`. Regular pieces hop over an adjacent own piece
   * (landing two squares away); kings slide over empties to the first piece and,
   * if it is their own, may land on any empty square beyond it.
   */
  private hopLandings(board: Board, from: Position, direction: Direction, piece: Piece): Position[] {
    const { dRow, dCol } = DELTAS[direction];

    if (!piece.isKing()) {
      const over = new Position(from.row + dRow, from.col + dCol);
      const landing = new Position(from.row + 2 * dRow, from.col + 2 * dCol);
      if (
        board.isValidPosition(over) &&
        this.isOwnPiece(board, over, piece.player) &&
        board.isValidPosition(landing) &&
        board.isEmpty(landing)
      ) {
        return [landing];
      }
      return [];
    }

    // King: advance over empty squares to the first occupied square.
    let row = from.row + dRow;
    let col = from.col + dCol;
    let scan = new Position(row, col);
    while (board.isValidPosition(scan) && board.isEmpty(scan)) {
      row += dRow;
      col += dCol;
      scan = new Position(row, col);
    }
    // The first piece encountered must be the king's own to hop it.
    if (!board.isValidPosition(scan) || !this.isOwnPiece(board, scan, piece.player)) {
      return [];
    }
    // Collect empty landing squares beyond the hopped piece.
    const landings: Position[] = [];
    row += dRow;
    col += dCol;
    let landing = new Position(row, col);
    while (board.isValidPosition(landing) && board.isEmpty(landing)) {
      landings.push(landing);
      row += dRow;
      col += dCol;
      landing = new Position(row, col);
    }
    return landings;
  }

  private isOwnPiece(board: Board, position: Position, player: Player): boolean {
    const piece = board.getPiece(position);
    return piece !== null && piece.player === player;
  }

  private dedupeMoves(moves: Move[]): Move[] {
    const seen = new Map<string, Move>();
    for (const move of moves) {
      seen.set(move.hash(), move);
    }
    return [...seen.values()];
  }
}
