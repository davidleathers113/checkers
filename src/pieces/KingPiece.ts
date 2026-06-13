import { Piece } from './Piece';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player, Direction, MoveStep } from '../types';

/**
 * King piece that can move in all diagonal directions.
 */
export class KingPiece extends Piece {
  /**
   * Kings can move diagonally in any direction.
   */
  canMove(from: Position, to: Position, board: Board): boolean {
    if (!from.isOnSameDiagonalAs(to)) return false;
    if (!board.isEmpty(to)) return false;
    
    const distance = from.diagonalDistanceTo(to);
    if (distance < 1) return false;
    
    const betweenPositions = from.getPositionsBetween(to);
    
    // For regular moves, path must be clear
    if (this.isPathClear(betweenPositions, board)) {
      return true;
    }
    
    // For capture moves, must have exactly one opponent in path
    const opponents = betweenPositions.filter(pos => 
      this.hasOpponent(pos, board)
    );
    
    return opponents.length === 1;
  }

  /**
   * Gets possible non-capture moves (any diagonal direction).
   */
  getPossibleMoves(position: Position, board: Board): Position[] {
    const moves: Position[] = [];
    
    for (const direction of this.getMoveDirections()) {
      const positionsInDirection = this.getPositionsInDirection(
        position,
        direction,
        board.size - 1,
        board.size
      );
      
      for (const pos of positionsInDirection) {
        if (!board.isValidPosition(pos)) break;
        if (!board.isEmpty(pos)) break;
        moves.push(pos);
      }
    }
    
    return moves;
  }

  /**
   * Gets possible capture moves for a king, including multi-jump sequences.
   * Each returned move carries explicit per-jump `steps` so that turning
   * sequences (whose start and end are not on a single diagonal) are
   * represented and validated correctly.
   */
  getCaptureMoves(position: Position, board: Board): Move[] {
    const sequences: Move[] = [];
    this.collectCaptures(position, position, board, [], [], sequences);
    return sequences;
  }

  /**
   * Creates a copy of this piece.
   */
  copy(): KingPiece {
    return new KingPiece(this.player, this.id);
  }

  /**
   * Kings are already promoted.
   */
  promote(): KingPiece {
    return this;
  }

  /**
   * Gets the value of a king piece (typically 3-4).
   */
  getValue(): number {
    return 3;
  }

  /**
   * Gets the symbol for display.
   */
  getSymbol(): string {
    return this.player === Player.RED ? 'R' : 'B';
  }

  /**
   * Kings can move in all diagonal directions.
   */
  getMoveDirections(): Direction[] {
    return [
      Direction.NORTH_WEST,
      Direction.NORTH_EAST,
      Direction.SOUTH_WEST,
      Direction.SOUTH_EAST
    ];
  }

  /**
   * Kings can capture in any direction.
   */
  canCaptureInDirection(_direction: Direction): boolean {
    return true;
  }

  /**
   * Kings can move across the entire board.
   */
  getMaxMoveDistance(): number {
    return 7; // Maximum for 8x8 board
  }

  /**
   * This is a king piece.
   */
  isKing(): boolean {
    return true;
  }

  /**
   * Checks if a path is clear (no pieces).
   */
  private isPathClear(positions: Position[], board: Board): boolean {
    return positions.every(pos => board.isEmpty(pos));
  }

  /**
   * Recursively builds flying-king capture sequences. The board is never
   * mutated: pieces captured earlier in the sequence remain on the board and
   * therefore act as blockers (you may not jump the same piece twice, and a
   * captured piece blocks the king's path until the turn ends).
   *
   * @param start    The king's original square (the move's `from`).
   * @param current  The square the king is jumping from at this step.
   * @param captured Pieces captured so far in this sequence.
   * @param steps    The jump steps taken so far.
   * @param out      Accumulator for every valid (partial or full) sequence.
   */
  private collectCaptures(
    start: Position,
    current: Position,
    board: Board,
    captured: Position[],
    steps: MoveStep[],
    out: Move[]
  ): void {
    for (const direction of this.getMoveDirections()) {
      const jump = this.findJumpInDirection(current, direction, board, captured);
      if (!jump) continue;

      for (const landing of jump.landings) {
        const step: MoveStep = { from: current, to: landing, captured: jump.opponent };
        const nextSteps = [...steps, step];
        const nextCaptured = [...captured, jump.opponent];

        out.push(new Move(start, landing, nextCaptured, false, nextSteps));
        this.collectCaptures(start, landing, board, nextCaptured, nextSteps, out);
      }
    }
  }

  /**
   * Looks along one diagonal for the first jumpable opponent and the empty
   * landing squares beyond it. Returns null if no capture is possible that way.
   */
  private findJumpInDirection(
    from: Position,
    direction: Direction,
    board: Board,
    captured: Position[]
  ): { opponent: Position; landings: Position[] } | null {
    // Glide over empty squares to the first occupied one.
    let scan = this.getNextPosition(from, direction, board.size);
    while (scan && board.isEmpty(scan)) {
      scan = this.getNextPosition(scan, direction, board.size);
    }
    if (!scan) return null;

    const blocker = board.getPiece(scan);
    // Can only jump a fresh opponent piece.
    if (!blocker || blocker.belongsTo(this.player)) return null;
    if (captured.some(c => c.equals(scan))) return null;

    const opponent = scan;
    const landings: Position[] = [];
    let landing = this.getNextPosition(opponent, direction, board.size);
    while (landing && board.isEmpty(landing)) {
      landings.push(landing);
      landing = this.getNextPosition(landing, direction, board.size);
    }
    return landings.length > 0 ? { opponent, landings } : null;
  }
}