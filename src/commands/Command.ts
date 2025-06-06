import { GameState } from '../types';

/**
 * Command interface for implementing undo/redo functionality.
 * Follows the Command pattern.
 */
export interface Command {
  /**
   * Executes the command and returns the new game state.
   */
  execute(state: GameState): GameState;

  /**
   * Undoes the command and returns the previous game state.
   */
  undo(state: GameState): GameState;

  /**
   * Gets a description of this command.
   */
  getDescription(): string;

  /**
   * Checks if this command can be executed in the current state.
   */
  canExecute(state: GameState): boolean;

  /**
   * Gets the timestamp when this command was created.
   */
  getTimestamp(): Date;
}

/**
 * Abstract base class for commands.
 */
export abstract class BaseCommand implements Command {
  protected readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
  }

  abstract execute(state: GameState): GameState;
  abstract undo(state: GameState): GameState;
  abstract getDescription(): string;

  canExecute(_state: GameState): boolean {
    return true;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}