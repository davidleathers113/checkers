import { Piece } from './Piece';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player, Direction } from '../types';
import { KingPiece } from './KingPiece';

/**
 * Regular checker piece that can only move forward diagonally.
 */
export class RegularPiece extends Piece {
  /**
   * Regular pieces can only move forward diagonally by one square.
   */
  canMove(from: Position, to: Position, board: Board): boolean {
    if (!from.isOnSameDiagonalAs(to)) return false;
    if (!board.isEmpty(to)) return false;
    
    const distance = from.diagonalDistanceTo(to);
    const direction = from.getDirectionTo(to);
    
    // Regular move: one square forward
    if (distance === 1) {
      return this.isForwardDirection(direction);
    }
    
    // Capture move: two squares with enemy piece in between
    if (distance === 2) {
      const betweenPositions = from.getPositionsBetween(to);
      if (betweenPositions.length !== 1) return false;
      
      const capturedPosition = betweenPositions[0]!;
      return this.hasOpponent(capturedPosition, board);
    }
    
    return false;
  }

  /**
   * Gets possible non-capture moves (one square forward diagonally).
   */
  getPossibleMoves(position: Position, board: Board): Position[] {
    const moves: Position[] = [];
    const directions = this.getMoveDirections();
    
    for (const direction of directions) {
      const nextPos = this.getNextPosition(position, direction, board.size);
      if (nextPos && this.isValidEmptyPosition(nextPos, board)) {
        moves.push(nextPos);
      }
    }
    
    return moves;
  }

  /**
   * Gets all possible capture moves, including multi-jump sequences.
   * This is the public entry point.
   */
  getCaptureMoves(position: Position, board: Board): Move[] {
    const allSequences: Move[] = [];
    this.findCaptureSequences(position, board, [], new Set(), allSequences);
    return allSequences;
  }

  /**
   * Recursively finds all capture sequences from a given position.
   * @param currentPos The current position in the jump sequence.
   * @param board The original, unmodified board.
   * @param path The sequence of jumps taken so far.
   * @param capturedOnPath A Set of positions of pieces already captured to prevent loops.
   * @param allSequences The accumulator array for all valid final move sequences.
   */
  private findCaptureSequences(
    currentPos: Position,
    board: Board,
    path: Move[],
    capturedOnPath: Set<string>,
    allSequences: Move[]
  ): void {
    // Check all four diagonal directions for the next jump.
    for (const direction of [Direction.NORTH_WEST, Direction.NORTH_EAST, Direction.SOUTH_WEST, Direction.SOUTH_EAST]) {
      const opponentPos = this.getNextPosition(currentPos, direction, board.size);
      if (!opponentPos) continue;

      const landingPos = this.getNextPosition(opponentPos, direction, board.size);
      if (!landingPos) continue;

      const opponentKey = opponentPos.hash();
      if (
        this.hasOpponent(opponentPos, board) &&
        board.isEmpty(landingPos) &&
        !capturedOnPath.has(opponentKey) // Check if we've already captured this piece in this sequence
      ) {
        const newMove = new Move(currentPos, landingPos, [opponentPos]);
        const newPath = [...path, newMove];
        const newCaptured = new Set(capturedOnPath).add(opponentKey);

        // This complete sequence is a valid move.
        // We create a final Move object from the start of the sequence to the end.
        const startPos = path.length > 0 ? path[0]!.from : currentPos;
        const allCapturedPieces = newPath.flatMap(p => p.captures);
        
        // Create proper steps for multi-step moves
        if (newPath.length > 1) {
          const steps = newPath.map(move => ({
            from: move.from,
            to: move.to,
            captured: move.captures[0]
          }));
          allSequences.push(new Move(startPos, landingPos, allCapturedPieces, false, steps));
        } else {
          allSequences.push(new Move(startPos, landingPos, allCapturedPieces));
        }

        // Recursively check for more jumps from the new landing position.
        this.findCaptureSequences(landingPos, board, newPath, newCaptured, allSequences);
      }
    }
  }

  /**
   * Creates a copy of this piece.
   */
  copy(): RegularPiece {
    return new RegularPiece(this.player, this.id);
  }

  /**
   * Promotes this piece to a king.
   */
  promote(): KingPiece {
    return new KingPiece(this.player, this.id);
  }

  /**
   * Gets the value of a regular piece (typically 1).
   */
  getValue(): number {
    return 1;
  }

  /**
   * Gets the symbol for display.
   */
  getSymbol(): string {
    return this.player === Player.RED ? 'r' : 'b';
  }

  /**
   * Gets valid move directions (forward only for regular pieces).
   */
  getMoveDirections(): Direction[] {
    if (this.player === Player.RED) {
      return [Direction.NORTH_WEST, Direction.NORTH_EAST];
    } else {
      return [Direction.SOUTH_WEST, Direction.SOUTH_EAST];
    }
  }

  /**
   * Regular pieces can capture in any direction.
   */
  canCaptureInDirection(_direction: Direction): boolean {
    return true;
  }

  /**
   * Regular pieces can only move one square.
   */
  getMaxMoveDistance(): number {
    return 1;
  }

  /**
   * Regular pieces are not kings.
   */
  isKing(): boolean {
    return false;
  }

  /**
   * Checks if a direction is forward for this piece.
   */
  private isForwardDirection(direction: string | null): boolean {
    if (!direction) return false;
    
    if (this.player === Player.RED) {
      return direction === 'NW' || direction === 'NE';
    } else {
      return direction === 'SW' || direction === 'SE';
    }
  }
}