import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { Piece } from '../pieces/Piece';
import { MoveValidator } from '../strategies/MoveValidator';

/**
 * Core interface for game rule implementations.
 * Implement this interface to create custom game variations.
 */
export interface RuleEngine {
  /**
   * Validates if a move is legal according to the rules.
   */
  validateMove(board: Board, move: Move): boolean;

  /**
   * Gets all possible moves from a given position.
   */
  getPossibleMoves(board: Board, position: Position): Move[];

  /**
   * Gets all possible moves for a player.
   */
  getAllPossibleMoves(board: Board, player: Player): Move[];

  /**
   * Checks if the game has ended.
   */
  isGameOver(board: Board, currentPlayer: Player): boolean;

  /**
   * Determines the winner of the game.
   * Returns null if game is not over or is a draw.
   */
  getWinner(board: Board, currentPlayer: Player): Player | null;

  /**
   * Gets mandatory moves (e.g., forced captures).
   * Empty array means no mandatory moves.
   */
  getMandatoryMoves(board: Board, player: Player): Move[];

  /**
   * Gets all valid non-capture moves for the given piece from the given position.
   */
  getNonCaptureMovesForPiece(piece: Piece, position: Position, board: Board): Move[];

  /**
   * Gets all valid capture moves (potentially multi-step) for the given piece from the given position.
   */
  getCaptureMovesForPiece(piece: Piece, position: Position, board: Board): Move[];

  /**
   * Determines if the piece should be promoted after landing on 'landingPosition'.
   */
  shouldPromotePiece(piece: Piece, landingPosition: Position, board: Board): boolean;

  /**
   * Returns a new, promoted piece instance if promotion should occur.
   * Returns original piece if no promotion or if piece cannot be promoted by rule.
   */
  getPromotedPiece(piece: Piece, landingPosition: Position, board: Board): Piece;

  /**
   * Gets the initial board setup.
   */
  getInitialBoard(): Board;

  /**
   * Validates if a board state is legal.
   */
  isValidBoardState(board: Board): boolean;

  /**
   * Gets the list of move validators required by this rule set.
   */
  getRequiredValidators(): MoveValidator[];

  /**
   * Checks if captures are mandatory for the given player and board state.
   */
  areCapturesMandatory(board: Board, player: Player): boolean;
}