import { Piece } from './Piece';
import { Position } from '../core/Position';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player, Direction } from '../types';

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
        board.size - 1
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
   * Gets possible capture moves for a king.
   */
  getCaptureMoves(position: Position, board: Board): Move[] {
    const captures: Move[] = [];
    
    for (const direction of this.getMoveDirections()) {
      const capturesInDirection = this.getCapturesInDirection(
        position,
        direction,
        board,
        []
      );
      captures.push(...capturesInDirection);
    }
    
    return captures;
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
   * Finds all capture moves in a given direction.
   */
  private getCapturesInDirection(
    from: Position,
    direction: Direction,
    board: Board,
    alreadyCaptured: Position[]
  ): Move[] {
    const captures: Move[] = [];
    const positions = this.getPositionsInDirection(from, direction, board.size - 1);
    
    let foundOpponent = false;
    let opponentPos: Position | null = null;
    
    for (const pos of positions) {
      if (!board.isValidPosition(pos)) break;
      
      const piece = board.getPiece(pos);
      
      // Hit our own piece - can't continue
      if (piece && piece.belongsTo(this.player)) break;
      
      // Found an opponent
      if (piece && !foundOpponent && !this.isAlreadyCaptured(pos, alreadyCaptured)) {
        foundOpponent = true;
        opponentPos = pos;
        continue;
      }
      
      // Found a second piece - can't jump over two pieces
      if (piece && foundOpponent) break;
      
      // Found empty square after opponent - valid landing position
      if (!piece && foundOpponent && opponentPos) {
        const newCapture = new Move(from, pos, [opponentPos]);
        captures.push(newCapture);
        
        // Check for additional captures from this position
        const newAlreadyCaptured = [...alreadyCaptured, opponentPos];
        for (const nextDirection of this.getMoveDirections()) {
          const additionalCaptures = this.getCapturesInDirection(
            pos,
            nextDirection,
            board,
            newAlreadyCaptured
          );
          
          // Combine captures into multi-capture moves
          for (const additional of additionalCaptures) {
            captures.push(new Move(
              from,
              additional.to,
              [...newCapture.captures, ...additional.captures],
              false
            ));
          }
        }
      }
    }
    
    return captures;
  }

  /**
   * Checks if a position is already captured in the current sequence.
   */
  private isAlreadyCaptured(position: Position, captured: Position[]): boolean {
    return captured.some(pos => pos.equals(position));
  }
}