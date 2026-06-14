import { StandardRules } from './StandardRules';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Piece } from '../pieces/Piece';
import { Player, Direction, MoveStep } from '../types';

const DELTAS: Record<Direction, { dRow: number; dCol: number }> = {
  [Direction.NORTH_WEST]: { dRow: -1, dCol: -1 },
  [Direction.NORTH_EAST]: { dRow: -1, dCol: 1 },
  [Direction.SOUTH_WEST]: { dRow: 1, dCol: -1 },
  [Direction.SOUTH_EAST]: { dRow: 1, dCol: 1 },
};

const ALL_DIRECTIONS: Direction[] = [
  Direction.NORTH_WEST,
  Direction.NORTH_EAST,
  Direction.SOUTH_WEST,
  Direction.SOUTH_EAST,
];

/** A single jump step: where it lands and the opponent it captures (if any). */
interface JumpStep {
  landing: Position;
  captured: Position | null;
}

/**
 * "Jump Your Own Man" variant.
 *
 * In addition to the standard rules, a piece may make a non-capturing **hop**:
 * jump over one of its OWN pieces into an empty square beyond. The hopped-over
 * piece is NOT removed — it is purely a mobility rule. Regular pieces hop
 * forward only (matching their move directions); kings may hop in any diagonal
 * direction (flying-style).
 *
 * Crucially, hops and opponent captures combine into a single turn: a piece may
 * hop over its own men and then continue by capturing an opponent (or capture,
 * then hop, then capture again, …). A turn is therefore a *jump sequence* whose
 * individual jumps are each either a hop or a capture, chained from one landing
 * to the next. Every prefix of such a sequence is a legal move, so the player
 * may stop after any jump.
 *
 * Opponent captures keep their normal behaviour: they remove the captured piece.
 * When any direct jump is on the board the move must capture an opponent (you
 * may not slide or make a *pure* hop instead) — but the capture may be reached
 * by hopping your own men first, and you may hop after capturing. So a forced
 * turn can be a direct capture, a hop-then-capture, a capture-then-hop, or any
 * chain of these; whichever capturing sequence you like is allowed. Men capture
 * forward only (see {@link Piece.getCaptureDirections}); kings capture in any
 * diagonal direction.
 */
export class JumpOwnRules extends StandardRules {
  override getPossibleMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    if (this.getMandatoryMoves(board, piece.player).length > 0) {
      // A jump is on the board, so the move must capture an opponent. Any
      // sequence that captures is legal — including ones that reach the capture
      // by hopping your own men first, or that hop after capturing. A piece that
      // cannot reach a capture (even via hops) offers nothing.
      return this.capturingSequences(board, position, piece);
    }

    // No forced capture: regular slides, plus every hop / hop-then-capture
    // sequence reachable from here (the hop-then-capture is optional here).
    const base = super.getPossibleMoves(board, position);
    const jumps = this.getJumpSequences(board, position, piece);
    return this.dedupeMoves([...base, ...jumps]);
  }

  override getAllPossibleMoves(board: Board, player: Player): Move[] {
    if (this.getMandatoryMoves(board, player).length === 0) {
      // Not forced: the inherited logic delegates to getPossibleMoves per piece
      // (slides + hop sequences), which is exactly what we want.
      return super.getAllPossibleMoves(board, player);
    }

    // Forced to capture: every capturing sequence (direct, hop-then-capture, or
    // capture-then-hop) from any piece that can reach a capture.
    const moves: Move[] = [];
    for (const { position, piece } of board.getPlayerPieces(player)) {
      moves.push(...this.capturingSequences(board, position, piece));
    }
    return this.dedupeMoves(moves);
  }

  override validateMove(board: Board, move: Move): boolean {
    // Standard moves (slides, captures) validate exactly as usual.
    if (super.validateMove(board, move)) {
      return true;
    }

    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // Otherwise the move is only legal if it is one of the jump sequences this
    // position offers (which already encode the mandatory-capture rule).
    return this.getPossibleMoves(board, move.from).some(seq => seq.equals(move));
  }

  /** Every jump sequence for `piece` that captures at least one opponent. */
  private capturingSequences(board: Board, position: Position, piece: Piece): Move[] {
    return this.getJumpSequences(board, position, piece).filter(seq => seq.getCaptureCount() > 0);
  }

  /**
   * Generates every legal jump *sequence* for the piece at `position`, freely
   * interleaving non-capturing hops (over your own pieces) and captures (over
   * opponents). Every prefix is returned so the player may stop after any jump.
   *
   * Each move carries explicit per-jump {@link MoveStep}s — a hop step has no
   * `captured`, a capture step removes the opponent — so it applies and animates
   * correctly. The search runs on a simulated board (the moving piece is
   * relocated and captured opponents removed at each step) so square occupancy
   * is always accurate; a `visited` set of landing squares prevents hop cycles.
   * Callers filter the result by capture count to enforce the mandatory-jump
   * rule (see {@link capturingSequences}).
   */
  private getJumpSequences(board: Board, position: Position, piece: Piece): Move[] {
    const results = new Map<string, Move>();
    const visited = new Set<string>([position.hash()]);

    const explore = (current: Position, simBoard: Board, steps: MoveStep[]): void => {
      for (const { landing, captured } of this.nextJumps(simBoard, current, piece)) {
        if (visited.has(landing.hash())) continue;

        const step: MoveStep = captured
          ? { from: current, to: landing, captured }
          : { from: current, to: landing };
        const nextSteps = [...steps, step];
        const captures = nextSteps.filter(s => s.captured).map(s => s.captured!);

        const promote = this.shouldPromote(landing, piece);
        const move = new Move(position, landing, captures, promote, nextSteps);
        results.set(move.hash(), move);

        // A man crowned mid-turn stops: promotion ends the sequence.
        if (promote) continue;

        let nextBoard = simBoard.movePiece(current, landing);
        if (captured) nextBoard = nextBoard.removePiece(captured);

        visited.add(landing.hash());
        explore(landing, nextBoard, nextSteps);
        visited.delete(landing.hash());
      }
    };

    explore(position, board, []);
    return [...results.values()];
  }

  /**
   * The immediate jumps available from `from` on `board` for `piece`: captures
   * over an opponent (in the piece's capture directions — forward only for a
   * standard man) and hops over an own piece (the piece's own move directions).
   * Regular pieces jump a single adjacent square; kings glide over empty squares
   * to the first piece and may land anywhere beyond it.
   */
  private nextJumps(board: Board, from: Position, piece: Piece): JumpStep[] {
    const jumps: JumpStep[] = [];

    if (!piece.isKing()) {
      // Captures: only in the man's capture directions (forward for a standard
      // man; any direction for an International man).
      for (const direction of piece.getCaptureDirections()) {
        const { dRow, dCol } = DELTAS[direction];
        const over = new Position(from.row + dRow, from.col + dCol);
        const landing = new Position(from.row + 2 * dRow, from.col + 2 * dCol);
        if (
          board.isValidPosition(over) &&
          board.isValidPosition(landing) &&
          this.isOpponentPiece(board, over, piece.player) &&
          board.isEmpty(landing)
        ) {
          jumps.push({ landing, captured: over });
        }
      }
      // Hops: only forward (a regular piece's own move directions).
      for (const direction of piece.getMoveDirections()) {
        const { dRow, dCol } = DELTAS[direction];
        const over = new Position(from.row + dRow, from.col + dCol);
        const landing = new Position(from.row + 2 * dRow, from.col + 2 * dCol);
        if (
          board.isValidPosition(over) &&
          board.isValidPosition(landing) &&
          this.isOwnPiece(board, over, piece.player) &&
          board.isEmpty(landing)
        ) {
          jumps.push({ landing, captured: null });
        }
      }
      return jumps;
    }

    // King: glide over empties to the first piece in each direction, then jump
    // it (capture if opponent, hop if own) landing on any empty square beyond.
    for (const direction of ALL_DIRECTIONS) {
      const { dRow, dCol } = DELTAS[direction];
      let row = from.row + dRow;
      let col = from.col + dCol;
      let scan = new Position(row, col);
      while (board.isValidPosition(scan) && board.isEmpty(scan)) {
        row += dRow;
        col += dCol;
        scan = new Position(row, col);
      }
      if (!board.isValidPosition(scan)) continue;
      const blocker = board.getPiece(scan);
      if (!blocker) continue;
      const captured = blocker.player !== piece.player ? scan : null;

      row += dRow;
      col += dCol;
      let landing = new Position(row, col);
      while (board.isValidPosition(landing) && board.isEmpty(landing)) {
        jumps.push({ landing, captured });
        row += dRow;
        col += dCol;
        landing = new Position(row, col);
      }
    }
    return jumps;
  }

  private isOwnPiece(board: Board, position: Position, player: Player): boolean {
    const piece = board.getPiece(position);
    return piece !== null && piece.player === player;
  }

  private isOpponentPiece(board: Board, position: Position, player: Player): boolean {
    const piece = board.getPiece(position);
    return piece !== null && piece.player !== player;
  }

  private dedupeMoves(moves: Move[]): Move[] {
    const seen = new Map<string, Move>();
    for (const move of moves) {
      seen.set(move.hash(), move);
    }
    return [...seen.values()];
  }
}
