import { CustomRulesBase } from '../src/rules/CustomRulesBase';
import { Board } from '../src/core/Board';
import { Move } from '../src/core/Move';
import { Position } from '../src/core/Position';
import { Player } from '../src/types';
import { Piece } from '../src/pieces/Piece';

/**
 * Timed Checkers with time-based mechanics.
 * - Each player has a time limit per move
 * - Pieces can "age" and gain special abilities
 * - Time pressure affects available moves
 * - Blitz mode with faster promotions
 */
export class TimedCheckersRules extends CustomRulesBase {
  private moveTimers: Map<Player, number> = new Map();
  private moveStartTimes: Map<Player, number> = new Map();
  private pieceAges: Map<string, number> = new Map();
  private moveHistory: Array<{ player: Player, move: Move, timestamp: number }> = [];

  constructor(
    private config: {
      timePerMove?: number; // milliseconds
      totalGameTime?: number; // milliseconds
      blitzMode?: boolean;
      agingEnabled?: boolean;
      timeBonus?: boolean;
    } = {}
  ) {
    super();
    
    this.config = {
      timePerMove: 30000, // 30 seconds default
      totalGameTime: 600000, // 10 minutes default
      blitzMode: false,
      agingEnabled: true,
      timeBonus: false,
      ...config
    };

    // Initialize timers
    this.moveTimers.set(Player.RED, this.config.totalGameTime!);
    this.moveTimers.set(Player.BLACK, this.config.totalGameTime!);
  }

  /**
   * Start timing a player's move.
   */
  startMoveTimer(player: Player): void {
    this.moveStartTimes.set(player, Date.now());
  }

  /**
   * Enhanced move validation with time constraints.
   */
  override validateMove(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // Check time constraints
    if (!this.isTimeValid(piece.player)) {
      throw new Error('Move time limit exceeded');
    }

    // Standard validation
    const isValid = super.validateMove(board, move);
    
    if (isValid) {
      this.recordMove(piece.player, move);
      this.updatePieceAge(piece.getId());
    }

    return isValid;
  }

  /**
   * Enhanced move generation based on time pressure.
   */
  override getPossibleMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    let moves = super.getPossibleMoves(board, position);

    // Under time pressure, prioritize captures and simple moves
    if (this.isUnderTimePressure(piece.player)) {
      moves = this.prioritizeMovesForTimePressure(moves);
    }

    // Add time bonus moves
    if (this.config.timeBonus && this.hasTimeBonus(piece.player)) {
      moves.push(...this.getTimeBonusMoves(board, position));
    }

    // Add aged piece special moves
    if (this.config.agingEnabled && this.isAgedPiece(piece)) {
      moves.push(...this.getAgedPieceMoves(board, position));
    }

    return moves;
  }

  /**
   * Enhanced promotion rules for blitz mode.
   */
  override shouldPromote(position: Position, piece: Piece): boolean {
    if (super.shouldPromote(position, piece)) {
      return true;
    }

    // In blitz mode, promote pieces faster
    if (this.config.blitzMode) {
      // Promote if piece reached 75% of the way to the end
      const targetRow = piece.player === Player.RED ? 0 : 7;
      const startRow = piece.player === Player.RED ? 7 : 0;
      const progressThreshold = Math.abs(startRow - targetRow) * 0.25;
      
      const currentProgress = Math.abs(position.row - startRow);
      return currentProgress >= progressThreshold;
    }

    // Promote aged pieces earlier
    if (this.config.agingEnabled && this.isAgedPiece(piece)) {
      const normalPromotionRow = piece.player === Player.RED ? 0 : 7;
      const earlyPromotionRow = piece.player === Player.RED ? 1 : 6;
      return position.row === earlyPromotionRow || position.row === normalPromotionRow;
    }

    return false;
  }

  /**
   * Get remaining time for a player.
   */
  getRemainingTime(player: Player): number {
    const totalTime = this.moveTimers.get(player) || 0;
    const startTime = this.moveStartTimes.get(player);
    
    if (!startTime) return totalTime;
    
    const elapsed = Date.now() - startTime;
    return Math.max(0, totalTime - elapsed);
  }

  /**
   * Check if player is under time pressure.
   */
  isUnderTimePressure(player: Player): boolean {
    const remaining = this.getRemainingTime(player);
    return remaining < (this.config.totalGameTime! * 0.1); // Less than 10% time left
  }

  /**
   * Check if move time is valid.
   */
  private isTimeValid(player: Player): boolean {
    const startTime = this.moveStartTimes.get(player);
    if (!startTime) return true;

    const elapsed = Date.now() - startTime;
    return elapsed <= this.config.timePerMove!;
  }

  /**
   * Record a move with timestamp.
   */
  private recordMove(player: Player, move: Move): void {
    const startTime = this.moveStartTimes.get(player);
    if (startTime) {
      const elapsed = Date.now() - startTime;
      
      // Deduct time from player's total
      const currentTime = this.moveTimers.get(player) || 0;
      this.moveTimers.set(player, Math.max(0, currentTime - elapsed));
      
      // Record in history
      this.moveHistory.push({
        player,
        move,
        timestamp: elapsed
      });
      
      this.moveStartTimes.delete(player);
    }
  }

  /**
   * Update piece age.
   */
  private updatePieceAge(pieceId: string): void {
    if (!this.config.agingEnabled) return;
    
    const currentAge = this.pieceAges.get(pieceId) || 0;
    this.pieceAges.set(pieceId, currentAge + 1);
  }

  /**
   * Check if piece is aged (moved 5+ times).
   */
  private isAgedPiece(piece: Piece): boolean {
    const age = this.pieceAges.get(piece.getId()) || 0;
    return age >= 5;
  }

  /**
   * Check if player has time bonus.
   */
  private hasTimeBonus(player: Player): boolean {
    const remaining = this.getRemainingTime(player);
    return remaining > (this.config.totalGameTime! * 0.5); // More than 50% time left
  }

  /**
   * Prioritize moves for time pressure.
   */
  private prioritizeMovesForTimePressure(moves: Move[]): Move[] {
    // Sort by priority: captures first, then forward moves
    return moves.sort((a, b) => {
      if (a.isCapture() && !b.isCapture()) return -1;
      if (!a.isCapture() && b.isCapture()) return 1;
      
      // Prefer moves toward promotion
      const aForward = a.to.row < a.from.row ? 1 : -1;
      const bForward = b.to.row < b.from.row ? 1 : -1;
      return bForward - aForward;
    });
  }

  /**
   * Get time bonus moves (extra mobility when ahead on time).
   */
  private getTimeBonusMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    const bonusMoves: Move[] = [];

    // Time bonus: can move 2 squares in any direction (if path is clear)
    const directions = ['NW', 'NE', 'SW', 'SE'] as const;
    
    for (const direction of directions) {
      const firstPos = this.getPositionInDirection(position, direction);
      if (!firstPos || !board.isValidPosition(firstPos) || !board.isEmpty(firstPos)) {
        continue;
      }

      const secondPos = this.getPositionInDirection(firstPos, direction);
      if (secondPos && board.isValidPosition(secondPos) && board.isEmpty(secondPos)) {
        bonusMoves.push(new Move(position, secondPos));
      }
    }

    return bonusMoves;
  }

  /**
   * Get special moves for aged pieces.
   */
  private getAgedPieceMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    const agedMoves: Move[] = [];

    // Aged pieces can move like kings (even if they're regular pieces)
    if (!piece.isKing()) {
      const kingDirections = ['NW', 'NE', 'SW', 'SE'] as const;
      
      for (const direction of kingDirections) {
        let currentPos = position;
        
        // Check up to 3 squares in this direction
        for (let i = 1; i <= 3; i++) {
          const nextPos = this.getPositionInDirection(currentPos, direction);
          if (!nextPos || !board.isValidPosition(nextPos)) break;
          
          if (board.isEmpty(nextPos)) {
            agedMoves.push(new Move(position, nextPos));
          } else {
            break;
          }
          
          currentPos = nextPos;
        }
      }
    }

    return agedMoves;
  }

  /**
   * Helper to get position in a direction.
   */
  private getPositionInDirection(
    pos: Position, 
    direction: 'NW' | 'NE' | 'SW' | 'SE'
  ): Position | null {
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

  /**
   * Get move statistics.
   */
  getMoveStats(): {
    averageTime: number;
    fastestMove: number;
    slowestMove: number;
    totalMoves: number;
    } {
    if (this.moveHistory.length === 0) {
      return { averageTime: 0, fastestMove: 0, slowestMove: 0, totalMoves: 0 };
    }

    const times = this.moveHistory.map(entry => entry.timestamp);
    const sum = times.reduce((a, b) => a + b, 0);
    
    return {
      averageTime: sum / times.length,
      fastestMove: Math.min(...times),
      slowestMove: Math.max(...times),
      totalMoves: this.moveHistory.length
    };
  }
}