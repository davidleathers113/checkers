import { CustomRulesBase } from '../src/rules/CustomRulesBase';
import { Board } from '../src/core/Board';
import { Move } from '../src/core/Move';
import { Position } from '../src/core/Position';
import { Player } from '../src/types';
import { Piece } from '../src/pieces/Piece';

/**
 * Crazy Checkers with multiple rule variations.
 * - Regular pieces can move backward
 * - Kings can teleport to opposite corners
 * - Optional super jumps (jump over multiple pieces)
 * - Configurable rule combinations
 */
export class CrazyCheckersRules extends CustomRulesBase {
  constructor(
    private options: {
      allowBackwardMoves?: boolean;
      enableTeleportation?: boolean;
      enableSuperJumps?: boolean;
      doubleJumpReward?: boolean;
    } = {}
  ) {
    super();
  }

  /**
   * Enhanced move validation with crazy rules.
   */
  override validateMove(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // Check for teleportation moves
    if (this.options.enableTeleportation && this.isTeleportMove(move, piece)) {
      return this.validateTeleportMove(board, move);
    }

    // Check for super jump moves
    if (this.options.enableSuperJumps && this.isSuperJump(move)) {
      return this.validateSuperJump(board, move);
    }

    // Check backward moves for regular pieces
    if (this.options.allowBackwardMoves && !piece.isKing()) {
      return this.validateBackwardMove(board, move, piece);
    }

    return super.validateMove(board, move);
  }

  /**
   * Enhanced move generation with crazy rules.
   */
  override getPossibleMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    let moves = super.getPossibleMoves(board, position);

    // Add teleportation moves for kings
    if (this.options.enableTeleportation && piece.isKing()) {
      moves.push(...this.getTeleportMoves(board, position));
    }

    // Add backward moves for regular pieces
    if (this.options.allowBackwardMoves && !piece.isKing()) {
      moves.push(...this.getBackwardMoves(board, position, piece));
    }

    // Add super jump moves
    if (this.options.enableSuperJumps) {
      moves.push(...this.getSuperJumpMoves(board, position));
    }

    return moves;
  }

  /**
   * Special promotion rules - double jump reward.
   */
  override shouldPromote(position: Position, piece: Piece): boolean {
    if (super.shouldPromote(position, piece)) {
      return true;
    }

    // Promote if piece made a double jump (captured 2+ pieces in one turn)
    if (this.options.doubleJumpReward) {
      // This would require tracking the current move context
      // Simplified for this example
      return false;
    }

    return false;
  }

  /**
   * Check if move is a teleportation move.
   */
  private isTeleportMove(move: Move, piece: Piece): boolean {
    if (!piece.isKing()) return false;
    
    // Teleportation: king can move to opposite corner areas
    const corners = [
      new Position(0, 1), new Position(1, 0), // Top-left area
      new Position(0, 7), new Position(1, 6), // Top-right area  
      new Position(6, 1), new Position(7, 0), // Bottom-left area
      new Position(6, 7), new Position(7, 6)  // Bottom-right area
    ];

    return corners.some(corner => corner.equals(move.to));
  }

  /**
   * Validate teleportation move.
   */
  private validateTeleportMove(board: Board, move: Move): boolean {
    // Teleportation requires empty destination
    return board.isEmpty(move.to);
  }

  /**
   * Check if move is a super jump (jumping over multiple pieces).
   */
  private isSuperJump(move: Move): boolean {
    return move.getDistance() > 2 && move.isCapture();
  }

  /**
   * Validate super jump move.
   */
  private validateSuperJump(board: Board, move: Move): boolean {
    const betweenPositions = move.from.getPositionsBetween(move.to);
    let opponentCount = 0;

    for (const pos of betweenPositions) {
      const piece = board.getPiece(pos);
      if (piece) {
        const movingPiece = board.getPiece(move.from);
        if (!movingPiece) return false;
        
        if (piece.player === movingPiece.player) {
          return false; // Can't jump over own pieces
        }
        opponentCount++;
      }
    }

    // Must capture all opponents in the path
    return opponentCount === move.getCaptureCount();
  }

  /**
   * Validate backward move for regular pieces.
   */
  private validateBackwardMove(board: Board, move: Move, piece: Piece): boolean {
    // Allow any diagonal move (forward or backward)
    if (!move.isDiagonal()) return false;
    
    const distance = move.getDistance();
    if (distance > 2) return false;
    
    if (distance === 1) {
      return board.isEmpty(move.to);
    }
    
    if (distance === 2 && move.isCapture()) {
      const betweenPos = move.from.getPositionsBetween(move.to)[0];
      if (!betweenPos) return false;
      
      const capturedPiece = board.getPiece(betweenPos);
      return capturedPiece !== null && capturedPiece.player !== piece.player;
    }

    return false;
  }

  /**
   * Get teleportation moves for kings.
   */
  private getTeleportMoves(board: Board, position: Position): Move[] {
    const moves: Move[] = [];
    const corners = [
      new Position(0, 1), new Position(1, 0),
      new Position(0, 7), new Position(1, 6),
      new Position(6, 1), new Position(7, 0),
      new Position(6, 7), new Position(7, 6)
    ];

    for (const corner of corners) {
      if (!corner.equals(position) && board.isEmpty(corner)) {
        moves.push(new Move(position, corner));
      }
    }

    return moves;
  }

  /**
   * Get backward moves for regular pieces.
   */
  private getBackwardMoves(board: Board, position: Position, piece: Piece): Move[] {
    const moves: Move[] = [];
    const backwardDirections = piece.player === Player.RED 
      ? ['SW', 'SE'] as const // Red normally goes NW/NE, so backward is SW/SE
      : ['NW', 'NE'] as const; // Black normally goes SW/SE, so backward is NW/NE

    for (const direction of backwardDirections) {
      const nextPos = this.getNextPositionInDirection(position, direction);
      if (nextPos && board.isValidPosition(nextPos) && board.isEmpty(nextPos)) {
        moves.push(new Move(position, nextPos));
      }

      // Check for backward captures
      const jumpPos = this.getNextPositionInDirection(nextPos || position, direction);
      if (jumpPos && board.isValidPosition(jumpPos) && board.isEmpty(jumpPos)) {
        const capturePos = nextPos;
        if (capturePos) {
          const capturedPiece = board.getPiece(capturePos);
          if (capturedPiece && capturedPiece.player !== piece.player) {
            moves.push(new Move(position, jumpPos, [capturePos]));
          }
        }
      }
    }

    return moves;
  }

  /**
   * Get super jump moves.
   */
  private getSuperJumpMoves(board: Board, position: Position): Move[] {
    const moves: Move[] = [];
    const piece = board.getPiece(position);
    if (!piece) return moves;

    const directions = ['NW', 'NE', 'SW', 'SE'] as const;

    for (const direction of directions) {
      let currentPos = position;
      const captures: Position[] = [];

      // Look for a sequence of opponents to jump over
      for (let distance = 1; distance <= 4; distance++) {
        const nextPos = this.getNextPositionInDirection(currentPos, direction);
        if (!nextPos || !board.isValidPosition(nextPos)) break;

        const nextPiece = board.getPiece(nextPos);
        if (nextPiece) {
          if (nextPiece.player === piece.player) break; // Hit own piece
          captures.push(nextPos);
        }

        const landingPos = this.getNextPositionInDirection(nextPos, direction);
        if (landingPos && board.isValidPosition(landingPos) && board.isEmpty(landingPos)) {
          if (captures.length > 0) {
            moves.push(new Move(position, landingPos, [...captures]));
          }
        }

        currentPos = nextPos;
      }
    }

    return moves;
  }

  /**
   * Helper to get next position in a direction.
   */
  private getNextPositionInDirection(
    pos: Position | null, 
    direction: 'NW' | 'NE' | 'SW' | 'SE'
  ): Position | null {
    if (!pos) return null;
    
    let { row, col } = pos;

    switch (direction) {
    case 'NW': row--; col--; break;
    case 'NE': row--; col++; break;
    case 'SW': row++; col--; break;
    case 'SE': row++; col++; break;
    }

    const newPos = new Position(row, col);
    return newPos.isValid(8) ? newPos : null;
  }
}