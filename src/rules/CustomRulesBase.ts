import { RuleEngine } from './RuleEngine';
import { StandardRules } from './StandardRules';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { Piece } from '../pieces/Piece';

/**
 * Abstract base class for custom rule implementations.
 * Extend this class to create custom game variations.
 * By default, delegates to StandardRules for all methods.
 */
export abstract class CustomRulesBase implements RuleEngine {
  protected standardRules: StandardRules;

  constructor(boardSize: number = 8) {
    this.standardRules = new StandardRules(boardSize);
  }

  /**
   * Override this to implement custom move validation.
   */
  validateMove(board: Board, move: Move): boolean {
    return this.standardRules.validateMove(board, move);
  }

  /**
   * Override this to implement custom move generation.
   */
  getPossibleMoves(board: Board, position: Position): Move[] {
    return this.standardRules.getPossibleMoves(board, position);
  }

  /**
   * Override this to implement custom move generation for a player.
   */
  getAllPossibleMoves(board: Board, player: Player): Move[] {
    return this.standardRules.getAllPossibleMoves(board, player);
  }

  /**
   * Override this to implement custom game end conditions.
   */
  isGameOver(board: Board): boolean {
    return this.standardRules.isGameOver(board);
  }

  /**
   * Override this to implement custom winning conditions.
   */
  getWinner(board: Board): Player | null {
    return this.standardRules.getWinner(board);
  }

  /**
   * Override this to implement custom mandatory moves.
   */
  getMandatoryMoves(board: Board, player: Player): Move[] {
    return this.standardRules.getMandatoryMoves(board, player);
  }

  /**
   * Override this to implement custom promotion rules.
   */
  shouldPromote(position: Position, piece: Piece): boolean {
    return this.standardRules.shouldPromote(position, piece);
  }

  /**
   * Override this to implement custom initial board setup.
   */
  getInitialBoard(): Board {
    return this.standardRules.getInitialBoard();
  }

  /**
   * Override this to implement custom board validation.
   */
  isValidBoardState(board: Board): boolean {
    return this.standardRules.isValidBoardState(board);
  }

  /**
   * Helper method to get all capture moves for a player.
   */
  protected getAllCaptureMoves(board: Board, player: Player): Move[] {
    const captures: Move[] = [];
    const playerPieces = board.getPlayerPieces(player);

    for (const { position } of playerPieces) {
      const piece = board.getPiece(position);
      if (piece) {
        const captureMoves = piece.getCaptureMoves(position, board);
        captures.push(...captureMoves);
      }
    }

    return captures;
  }

  /**
   * Helper method to get all non-capture moves for a player.
   */
  protected getAllRegularMoves(board: Board, player: Player): Move[] {
    const moves: Move[] = [];
    const playerPieces = board.getPlayerPieces(player);

    for (const { position } of playerPieces) {
      const piece = board.getPiece(position);
      if (piece) {
        const regularMoves = piece.getPossibleMoves(position, board);
        for (const to of regularMoves) {
          moves.push(new Move(position, to));
        }
      }
    }

    return moves;
  }

  /**
   * Helper method to count pieces by type.
   */
  protected countPiecesByType(board: Board, player: Player): { regular: number; kings: number } {
    const pieces = board.getPlayerPieces(player);
    let regular = 0;
    let kings = 0;

    for (const { piece } of pieces) {
      if (piece.isKing()) {
        kings++;
      } else {
        regular++;
      }
    }

    return { regular, kings };
  }
}