import { BaseCommand } from './Command';
import { Move } from '../core/Move';
import { GameState, Player } from '../types';

/**
 * Command for executing moves with undo capability.
 */
export class MoveCommand extends BaseCommand {
  private previousState: GameState | null = null;

  constructor(private readonly move: Move) {
    super();
  }

  override execute(state: GameState): GameState {
    // Store deep copy of previous state for undo
    this.previousState = {
      board: state.board.copy(),
      currentPlayer: state.currentPlayer,
      moveHistory: [...state.moveHistory],
      capturedPieces: [...state.capturedPieces],
      winner: state.winner,
      isGameOver: state.isGameOver
    };

    // Apply the move to create new state
    const newBoard = this.move.apply(state.board);
    
    const newState: GameState = {
      ...state,
      board: newBoard,
      moveHistory: [...state.moveHistory, this.move],
      // Current player switching would be handled by Game class
      currentPlayer: state.currentPlayer === Player.RED ? Player.BLACK : Player.RED
    };

    return newState;
  }

  override undo(_state: GameState): GameState {
    if (!this.previousState) {
      throw new Error('Cannot undo: no previous state stored');
    }

    return this.previousState;
  }

  override getDescription(): string {
    return `Move from ${this.move.from} to ${this.move.to}${
      this.move.isCapture() ? ' (capture)' : ''
    }`;
  }

  override canExecute(state: GameState): boolean {
    // Basic validation - piece exists and belongs to current player
    const piece = state.board.getPiece(this.move.from);
    return piece !== null && piece.player === state.currentPlayer;
  }

  getMove(): Move {
    return this.move;
  }
}