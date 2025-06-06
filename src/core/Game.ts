import { Board } from './Board';
import { Move } from './Move';
import { Position } from './Position';
import { GameObserver } from './GameObserver';
import { Player, GameState, GameConfig } from '../types';
import { RuleEngine } from '../rules/RuleEngine';
import { StandardRules } from '../rules/StandardRules';
import { ValidationEngine } from '../strategies/ValidationEngine';
import { GameOverError, InvalidMoveError } from '../errors';
import { Piece } from '../pieces/Piece';
import { MoveCommand } from '../commands/MoveCommand';
import { Command } from '../commands/Command';

/**
 * Main game controller that orchestrates the checkers game.
 * Implements Observer pattern for state change notifications.
 */
export class Game {
  private board: Board;
  private currentPlayer: Player;
  private history: Command[] = [];
  private redoStack: Command[] = [];
  private observers: Set<GameObserver> = new Set();
  private ruleEngine: RuleEngine;
  private validationEngine: ValidationEngine;
  private gameOver: boolean = false;
  private winner: Player | null = null;
  private moveCount: number = 0;

  constructor(config: Partial<GameConfig> = {}) {
    this.ruleEngine = config.ruleEngine || new StandardRules();
    this.validationEngine = new ValidationEngine();
    this.currentPlayer = config.startingPlayer || Player.RED;
    this.board = this.ruleEngine.getInitialBoard();
  }

  /**
   * Gets the current board state.
   */
  getBoard(): Board {
    return this.board;
  }

  /**
   * Gets the current player.
   */
  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  /**
   * Gets the move history.
   */
  getHistory(): readonly Move[] {
    return this.history
      .filter(cmd => cmd instanceof MoveCommand)
      .map(cmd => (cmd as MoveCommand).getMove());
  }

  /**
   * Gets the current move count.
   */
  getMoveCount(): number {
    return this.moveCount;
  }

  /**
   * Checks if the game is over.
   */
  isGameOver(): boolean {
    return this.gameOver || this.ruleEngine.isGameOver(this.board);
  }

  /**
   * Gets the winner of the game.
   */
  getWinner(): Player | null {
    if (!this.isGameOver()) return null;
    return this.winner || this.ruleEngine.getWinner(this.board);
  }

  /**
   * Gets the current game state.
   */
  getGameState(): GameState {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      moveHistory: [...this.getHistory()],
      capturedPieces: this.getCapturedPieces(),
      winner: this.getWinner(),
      isGameOver: this.isGameOver()
    };
  }

  /**
   * Makes a move on the board.
   */
  makeMove(move: Move): boolean {
    if (this.isGameOver()) {
      throw new GameOverError();
    }

    try {
      // Validate the move using both rule engine and validation engine
      this.validateMove(move);

      // Create and execute command
      const command = new MoveCommand(move);
      const currentState = this.getGameState();
      
      if (!command.canExecute(currentState)) {
        throw new InvalidMoveError(move, 'Move cannot be executed');
      }

      const newState = command.execute(currentState);
      
      // Update game state from command result
      this.board = newState.board;
      this.currentPlayer = newState.currentPlayer;
      this.moveCount++;

      // Add command to history and clear redo stack
      this.history.push(command);
      this.redoStack = [];

      // Handle promotion if needed
      this.handlePromotion(move);

      // Check for game end
      this.checkGameEnd();

      // Notify observers
      this.notifyMoveObservers(move, this.board);
      this.notifyBoardUpdateObservers(this.board);

      if (this.isGameOver()) {
        this.notifyGameEndObservers(this.getWinner());
      }

      return true;
    } catch (error) {
      if (error instanceof InvalidMoveError) {
        this.notifyInvalidMoveObservers(move, error.reason);
      }
      throw error;
    }
  }

  /**
   * Gets possible moves from a position.
   */
  getPossibleMoves(position: Position): Move[] {
    if (this.isGameOver()) return [];
    
    const piece = this.board.getPiece(position);
    if (!piece || piece.player !== this.currentPlayer) return [];

    return this.ruleEngine.getPossibleMoves(this.board, position);
  }

  /**
   * Gets all possible moves for the current player.
   */
  getAllPossibleMoves(): Move[] {
    if (this.isGameOver()) return [];
    return this.ruleEngine.getAllPossibleMoves(this.board, this.currentPlayer);
  }

  /**
   * Gets mandatory moves for the current player.
   */
  getMandatoryMoves(): Move[] {
    if (this.isGameOver()) return [];
    return this.ruleEngine.getMandatoryMoves(this.board, this.currentPlayer);
  }

  /**
   * Undoes the last move.
   */
  undoMove(): boolean {
    if (this.history.length === 0) return false;

    // Pop the last command from history
    const lastCommand = this.history.pop()!;
    
    // Push it onto redo stack
    this.redoStack.push(lastCommand);
    
    // Get the previous state and update game
    const previousState = lastCommand.undo(this.getGameState());
    this.board = previousState.board;
    this.currentPlayer = previousState.currentPlayer;
    this.gameOver = previousState.isGameOver;
    this.winner = previousState.winner;
    this.moveCount--;

    // Notify observers
    this.notifyBoardUpdateObservers(this.board);
    this.notifyTurnChangeObservers(this.currentPlayer);

    return true;
  }

  /**
   * Redoes the last undone move.
   */
  redoMove(): boolean {
    if (this.redoStack.length === 0) return false;

    // Pop command from redo stack
    const command = this.redoStack.pop()!;
    
    // Execute it and push back to history
    const newState = command.execute(this.getGameState());
    this.history.push(command);
    
    // Update game state
    this.board = newState.board;
    this.currentPlayer = newState.currentPlayer;
    this.moveCount++;

    // Check for game end
    this.checkGameEnd();

    // Notify observers
    this.notifyBoardUpdateObservers(this.board);
    this.notifyTurnChangeObservers(this.currentPlayer);

    if (this.isGameOver()) {
      this.notifyGameEndObservers(this.getWinner());
    }

    return true;
  }

  /**
   * Resets the game to initial state.
   */
  reset(): void {
    this.board = this.ruleEngine.getInitialBoard();
    this.currentPlayer = Player.RED;
    this.history = [];
    this.redoStack = [];
    this.gameOver = false;
    this.winner = null;
    this.moveCount = 0;

    this.notifyBoardUpdateObservers(this.board);
  }

  /**
   * Adds an observer to receive game notifications.
   */
  addObserver(observer: GameObserver): void {
    this.observers.add(observer);
  }

  /**
   * Removes an observer.
   */
  removeObserver(observer: GameObserver): void {
    this.observers.delete(observer);
  }

  /**
   * Removes all observers.
   */
  clearObservers(): void {
    this.observers.clear();
  }

  /**
   * Sets a new rule engine.
   */
  setRuleEngine(ruleEngine: RuleEngine): void {
    this.ruleEngine = ruleEngine;
    // Validate current board state with new rules
    if (!this.ruleEngine.isValidBoardState(this.board)) {
      throw new Error('Current board state is invalid with new rules');
    }
  }

  /**
   * Gets the current rule engine.
   */
  getRuleEngine(): RuleEngine {
    return this.ruleEngine;
  }

  /**
   * Sets the validation engine.
   */
  setValidationEngine(validationEngine: ValidationEngine): void {
    this.validationEngine = validationEngine;
  }

  /**
   * Gets the validation engine.
   */
  getValidationEngine(): ValidationEngine {
    return this.validationEngine;
  }

  /**
   * Validates a move using both rule engine and validation engine.
   */
  private validateMove(move: Move): void {
    // First check with rule engine
    if (!this.ruleEngine.validateMove(this.board, move)) {
      throw new InvalidMoveError(move, 'Move violates game rules');
    }

    // Then validate with validation engine
    this.validationEngine.validateMove(this.board, move, this.currentPlayer);
  }


  /**
   * Handles piece promotion after a move.
   */
  private handlePromotion(move: Move): void {
    if (move.isPromotion) return; // Already handled

    const piece = this.board.getPiece(move.to);
    if (piece && this.ruleEngine.shouldPromote(move.to, piece)) {
      const promotedPiece = piece.promote();
      this.board = this.board.setPiece(move.to, promotedPiece);
      
      // Notify observers of promotion
      this.observers.forEach(observer => {
        if (observer.onPiecePromoted) {
          observer.onPiecePromoted(move.to, promotedPiece);
        }
      });
    }
  }

  /**
   * Checks if the game has ended.
   */
  private checkGameEnd(): void {
    if (this.ruleEngine.isGameOver(this.board)) {
      this.gameOver = true;
      this.winner = this.ruleEngine.getWinner(this.board);
    }
  }


  /**
   * Gets captured pieces from move history.
   */
  private getCapturedPieces(): Piece[] {
    // Calculate captured pieces from move history
    const captured: Piece[] = [];
    for (const move of this.getHistory()) {
      if (move.isCapture()) {
        // Note: In a real implementation, we'd need to track the actual captured pieces
        // For now, return an empty array since we can't reconstruct the pieces
        // This would require storing captured pieces with each move
      }
    }
    return captured;
  }

  /**
   * Notifies observers of a move.
   */
  private notifyMoveObservers(move: Move, board: Board): void {
    this.observers.forEach(observer => observer.onMove(move, board));
  }

  /**
   * Notifies observers of game end.
   */
  private notifyGameEndObservers(winner: Player | null): void {
    this.observers.forEach(observer => observer.onGameEnd(winner));
  }

  /**
   * Notifies observers of turn change.
   */
  private notifyTurnChangeObservers(player: Player): void {
    this.observers.forEach(observer => observer.onTurnChange(player));
  }

  /**
   * Notifies observers of invalid move.
   */
  private notifyInvalidMoveObservers(move: Move, reason: string): void {
    this.observers.forEach(observer => observer.onInvalidMove(move, reason));
  }

  /**
   * Notifies observers of board update.
   */
  private notifyBoardUpdateObservers(board: Board): void {
    this.observers.forEach(observer => {
      if (observer.onBoardUpdate) {
        observer.onBoardUpdate(board);
      }
    });
  }
}