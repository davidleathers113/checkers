import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { Piece } from '../pieces/Piece';

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
  isGameOver(board: Board): boolean;

  /**
   * Determines the winner of the game.
   * Returns null if game is not over or is a draw.
   */
  getWinner(board: Board): Player | null;

  /**
   * Gets mandatory moves (e.g., forced captures).
   * Empty array means no mandatory moves.
   */
  getMandatoryMoves(board: Board, player: Player): Move[];

  /**
   * Checks if a piece should be promoted (e.g., to king).
   */
  shouldPromote(position: Position, piece: Piece): boolean;

  /**
   * Gets the initial board setup.
   */
  getInitialBoard(): Board;

  /**
   * Validates if a board state is legal.
   */
  isValidBoardState(board: Board): boolean;
}