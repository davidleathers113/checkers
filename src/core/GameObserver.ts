import { Move } from './Move';
import { Board } from './Board';
import { Player } from '../types';

/**
 * Observer interface for game state changes.
 * Implement this to react to game events.
 */
export interface GameObserver {
  /**
   * Called when a move is successfully made.
   */
  onMove(move: Move, board: Board): void;

  /**
   * Called when the game ends.
   */
  onGameEnd(winner: Player | null): void;

  /**
   * Called when the current player changes.
   */
  onTurnChange(player: Player): void;

  /**
   * Called when an invalid move is attempted.
   */
  onInvalidMove(move: Move, reason: string): void;

  /**
   * Called when a piece is promoted.
   */
  onPiecePromoted?(position: Position, newPiece: Piece): void;

  /**
   * Called when pieces are captured.
   */
  onPiecesCaptured?(positions: Position[], pieces: Piece[]): void;

  /**
   * Called when the board state changes.
   */
  onBoardUpdate?(board: Board): void;
}

import type { Position } from './Position';
import type { Piece } from '../pieces/Piece';