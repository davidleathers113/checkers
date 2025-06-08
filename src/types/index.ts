export enum Player {
  RED = 'RED',
  BLACK = 'BLACK'
}

export enum Direction {
  NORTH_WEST = 'NW',
  NORTH_EAST = 'NE',
  SOUTH_WEST = 'SW',
  SOUTH_EAST = 'SE'
}

/**
 * Enum defining the supported game variants.
 */
export enum GameVariant {
  STANDARD_AMERICAN = 'STANDARD_AMERICAN',
  // INTERNATIONAL_DRAUGHTS = 'INTERNATIONAL_DRAUGHTS', // Example for later
}

export enum PieceType {
  REGULAR = 'REGULAR',
  KING = 'KING',
  // Add other types here for variants if needed, e.g., DAME, WOLF
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  moveHistory: Move[];
  capturedPieces: Piece[];
  winner: Player | null;
  isGameOver: boolean;
}

export interface GameConfig {
  boardSize?: number;
  startingPlayer?: Player;
  ruleEngine: RuleEngine;
  validators?: MoveValidator[];
  ui?: GameUI;
}

export interface MoveStep {
  from: Position;
  to: Position;
  captured?: Position;
}

import type { Board } from '../core/Board';
import type { Move } from '../core/Move';
import type { Piece } from '../pieces/Piece';
import type { Position } from '../core/Position';
import type { RuleEngine } from '../rules/RuleEngine';
import type { MoveValidator } from '../strategies/MoveValidator';
import type { GameUI } from '../ui/GameUI';