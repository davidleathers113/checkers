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
   * Gets possible capture moves.
   */
  getCaptureMoves(position: Position, board: Board): Move[] {
    return this.getCaptureMoveHelper(position, board, []);
  }

  /**
   * Helper method for recursive capture move generation.
   */
  private getCaptureMoveHelper(position: Position, board: Board, capturedPieces: Position[]): Move[] {
    const captures: Move[] = [];
    
    // Check all four diagonal directions for captures
    for (const direction of [Direction.NORTH_WEST, Direction.NORTH_EAST, 
      Direction.SOUTH_WEST, Direction.SOUTH_EAST]) {
      const captureMove = this.getCaptureInDirection(position, direction, board);
      if (captureMove && !this.isAlreadyCaptured(captureMove.captures[0]!, capturedPieces)) {
        captures.push(captureMove);
        
        // Create a board with captured pieces removed for recursive check
        const newBoard = board.removePieces([...capturedPieces, ...captureMove.captures]);
        const newCaptured = [...capturedPieces, ...captureMove.captures];
        
        // Check for additional captures from the landing position
        const additionalCaptures = this.getCaptureMoveHelper(captureMove.to, newBoard, newCaptured);
        for (const additionalCapture of additionalCaptures) {
          // Create multi-capture move
          captures.push(new Move(
            position,
            additionalCapture.to,
            [...captureMove.captures, ...additionalCapture.captures],
            false
          ));
        }
      }
    }
    
    return captures;
  }

  /**
   * Checks if a position has already been captured in this sequence.
   */
  private isAlreadyCaptured(position: Position, captured: Position[]): boolean {
    return captured.some(pos => pos.equals(position));
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

  /**
   * Gets a capture move in a specific direction if available.
   */
  private getCaptureInDirection(
    from: Position,
    direction: Direction,
    board: Board
  ): Move | null {
    // Get position of potential capture
    const capturePos = this.getNextPosition(from, direction, board.size);
    if (!capturePos || !board.isValidPosition(capturePos)) return null;
    
    // Check if there's an opponent piece to capture
    if (!this.hasOpponent(capturePos, board)) return null;
    
    // Get landing position after capture
    const landingPos = this.getNextPosition(capturePos, direction, board.size);
    if (!landingPos || !board.isValidPosition(landingPos)) return null;
    
    // Check if landing position is empty
    if (!board.isEmpty(landingPos)) return null;
    
    return new Move(from, landingPos, [capturePos], false);
  }
}