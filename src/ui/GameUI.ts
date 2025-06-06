import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';
import { Position } from '../core/Position';

/**
 * Interface for game UI implementations.
 * Implement this to create different UI types (console, web, mobile).
 */
export interface GameUI {
  /**
   * Renders the current board state.
   */
  render(board: Board): void;

  /**
   * Gets a move from the user.
   * Should return a promise that resolves when user makes a move.
   */
  getMove(): Promise<Move>;

  /**
   * Displays a message to the user.
   */
  showMessage(message: string): void;

  /**
   * Handles game end state.
   */
  onGameEnd(winner: Player | null): void;

  /**
   * Highlights possible moves on the board.
   */
  highlightMoves(moves: Move[]): void;

  /**
   * Clears all highlights from the board.
   */
  clearHighlights(): void;

  /**
   * Shows an error message.
   */
  showError(error: string): void;

  /**
   * Updates the current player display.
   */
  updateCurrentPlayer(player: Player): void;

  /**
   * Highlights a specific position.
   */
  highlightPosition?(position: Position): void;

  /**
   * Shows move history.
   */
  showMoveHistory?(moves: Move[]): void;

  /**
   * Initializes the UI.
   */
  initialize?(): Promise<void>;

  /**
   * Cleans up the UI.
   */
  destroy?(): void;
}