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