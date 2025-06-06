import { CustomRulesBase } from '../src/rules/CustomRulesBase';
import { Board } from '../src/core/Board';
import { Move } from '../src/core/Move';
import { Position } from '../src/core/Position';
import { Player } from '../src/types';
import { RegularPiece } from '../src/pieces/RegularPiece';

/**
 * International Draughts (10x10) rules implementation.
 * - Played on 10x10 board
 * - Kings can fly (move multiple squares)
 * - Must capture maximum possible pieces
 * - Different piece placement
 */
export class InternationalDraughtsRules extends CustomRulesBase {
  constructor(boardSize: number = 10) {
    super(boardSize); // Default to 10x10 for International Draughts
  }

  /**
   * Enhanced move validation for flying kings.
   */
  override validateMove(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // For kings, allow flying moves
    if (piece.isKing()) {
      return this.validateFlyingKingMove(board, move);
    }

    // Regular pieces follow standard rules
    return super.validateMove(board, move);
  }

  /**
   * Enhanced move generation for flying kings.
   */
  override getPossibleMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    if (piece.isKing()) {
      return this.getFlyingKingMoves(board, position);
    }

    return super.getPossibleMoves(board, position);
  }

  /**
   * Must capture maximum possible pieces rule.
   */
  override getMandatoryMoves(board: Board, player: Player): Move[] {
    const allCaptures = this.getAllCaptureMoves(board, player);
    
    if (allCaptures.length === 0) return [];

    // Find maximum capture count
    const maxCaptures = Math.max(...allCaptures.map(move => move.getCaptureCount()));
    
    // Return only moves that capture the maximum
    return allCaptures.filter(move => move.getCaptureCount() === maxCaptures);
  }

  /**
   * International draughts initial setup (4 rows each).
   */
  override getInitialBoard(): Board {
    let board = new Board(10);

    // Place black pieces (top 4 rows)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new RegularPiece(Player.BLACK));
        }
      }
    }

    // Place red pieces (bottom 4 rows)
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

  /**
   * Validates flying king moves.
   */
  private validateFlyingKingMove(board: Board, move: Move): boolean {
    if (!move.isDiagonal()) return false;

    const betweenPositions = move.from.getPositionsBetween(move.to);
    
    if (move.isCapture()) {
      // For captures, exactly one opponent should be captured
      const occupiedPositions = betweenPositions.filter(pos => !board.isEmpty(pos));
      
      if (occupiedPositions.length !== 1) return false;
      
      const capturedPos = occupiedPositions[0]!;
      const capturedPiece = board.getPiece(capturedPos);
      
      const movingPiece = board.getPiece(move.from);
      return capturedPiece !== null && 
             movingPiece !== null &&
             capturedPiece.player !== movingPiece.player && 
             move.captures.some(cap => cap.equals(capturedPos));
    } else {
      // For regular moves, path must be clear
      return betweenPositions.every(pos => board.isEmpty(pos));
    }
  }

  /**
   * Gets all possible flying king moves.
   */
  private getFlyingKingMoves(board: Board, position: Position): Move[] {
    const moves: Move[] = [];
    const directions = ['NW', 'NE', 'SW', 'SE'] as const;

    for (const direction of directions) {
      // Regular moves in this direction
      const regularMoves = this.getRegularMovesInDirection(board, position, direction);
      moves.push(...regularMoves);

      // Capture moves in this direction
      const captureMoves = this.getCaptureMovesInDirection(board, position, direction);
      moves.push(...captureMoves);
    }

    return moves;
  }

  /**
   * Gets regular moves in a specific direction for flying kings.
   */
  private getRegularMovesInDirection(
    board: Board, 
    position: Position, 
    direction: 'NW' | 'NE' | 'SW' | 'SE'
  ): Move[] {
    const moves: Move[] = [];
    let currentPos = position;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextPos = this.getNextPositionInDirection(currentPos, direction);
      if (!nextPos || !board.isValidPosition(nextPos)) break;
      
      if (!board.isEmpty(nextPos)) break;
      
      moves.push(new Move(position, nextPos));
      currentPos = nextPos;
    }

    return moves;
  }

  /**
   * Gets capture moves in a specific direction for flying kings.
   */
  private getCaptureMovesInDirection(
    board: Board,
    position: Position,
    direction: 'NW' | 'NE' | 'SW' | 'SE'
  ): Move[] {
    const moves: Move[] = [];
    let currentPos = position;
    const piece = board.getPiece(position);
    if (!piece) return moves;

    // Look for opponent pieces to capture
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextPos = this.getNextPositionInDirection(currentPos, direction);
      if (!nextPos || !board.isValidPosition(nextPos)) break;

      const nextPiece = board.getPiece(nextPos);
      
      // Hit our own piece - stop
      if (nextPiece && nextPiece.player === piece.player) break;
      
      // Found opponent piece
      if (nextPiece && nextPiece.player !== piece.player) {
        // Look for landing positions after the captured piece
        let landingPos = nextPos;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const nextLandingPos = this.getNextPositionInDirection(landingPos, direction);
          if (!nextLandingPos || !board.isValidPosition(nextLandingPos)) break;
          if (!board.isEmpty(nextLandingPos)) break;
          
          moves.push(new Move(position, nextLandingPos, [nextPos]));
          landingPos = nextLandingPos;
        }
        break; // Only one capture per direction in this simple implementation
      }
      
      currentPos = nextPos;
    }

    return moves;
  }

  /**
   * Helper to get next position in a direction.
   */
  private getNextPositionInDirection(
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
    return newPos.isValid(10) ? newPos : null;
  }
}