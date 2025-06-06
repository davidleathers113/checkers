import { Move } from '../core/Move';
import { Position } from '../core/Position';

/**
 * Base error class for all game-related errors.
 */
export class GameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameError';
    Object.setPrototypeOf(this, GameError.prototype);
  }
}

/**
 * Error thrown when an invalid move is attempted.
 */
export class InvalidMoveError extends GameError {
  constructor(
    public readonly move: Move,
    public readonly reason: string
  ) {
    super(`Invalid move from ${move.from} to ${move.to}: ${reason}`);
    this.name = 'InvalidMoveError';
    Object.setPrototypeOf(this, InvalidMoveError.prototype);
  }
}

/**
 * Error thrown when an invalid position is used.
 */
export class InvalidPositionError extends GameError {
  constructor(public readonly position: Position) {
    super(`Invalid position: ${position}`);
    this.name = 'InvalidPositionError';
    Object.setPrototypeOf(this, InvalidPositionError.prototype);
  }
}

/**
 * Error thrown when game operations are attempted after game ends.
 */
export class GameOverError extends GameError {
  constructor() {
    super('Game is over');
    this.name = 'GameOverError';
    Object.setPrototypeOf(this, GameOverError.prototype);
  }
}

/**
 * Error thrown when a rule violation occurs.
 */
export class RuleViolationError extends GameError {
  constructor(public readonly rule: string, message: string) {
    super(`Rule violation (${rule}): ${message}`);
    this.name = 'RuleViolationError';
    Object.setPrototypeOf(this, RuleViolationError.prototype);
  }
}

/**
 * Error thrown when an invalid board state is detected.
 */
export class InvalidBoardStateError extends GameError {
  constructor(message: string) {
    super(`Invalid board state: ${message}`);
    this.name = 'InvalidBoardStateError';
    Object.setPrototypeOf(this, InvalidBoardStateError.prototype);
  }
}

/**
 * Error thrown when piece operations fail.
 */
export class PieceError extends GameError {
  constructor(message: string) {
    super(message);
    this.name = 'PieceError';
    Object.setPrototypeOf(this, PieceError.prototype);
  }
}

/**
 * Error thrown when UI operations fail.
 */
export class UIError extends GameError {
  constructor(message: string) {
    super(message);
    this.name = 'UIError';
    Object.setPrototypeOf(this, UIError.prototype);
  }
}