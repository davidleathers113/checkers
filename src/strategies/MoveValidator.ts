import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Player } from '../types';

/**
 * Interface for move validation strategies.
 * Implement this to add custom validation logic.
 */
export interface MoveValidator {
  /**
   * Validates a move according to specific criteria.
   * Should throw an error with a descriptive message if invalid.
   */
  validateMove(board: Board, move: Move, player: Player): boolean;

  /**
   * Gets the priority of this validator.
   * Lower numbers run first.
   */
  getPriority(): number;

  /**
   * Gets the name of this validator for debugging.
   */
  getName(): string;

  /**
   * Checks if this validator should be applied to the given move.
   */
  shouldValidate?(board: Board, move: Move, player: Player): boolean;
}

/**
 * Abstract base class for move validators.
 */
export abstract class BaseMoveValidator implements MoveValidator {
  constructor(
    protected readonly priority: number = 0,
    protected readonly name: string = 'Validator'
  ) {}

  abstract validateMove(board: Board, move: Move, player: Player): boolean;

  getPriority(): number {
    return this.priority;
  }

  getName(): string {
    return this.name;
  }

  shouldValidate(_board: Board, _move: Move, _player: Player): boolean {
    return true;
  }
}