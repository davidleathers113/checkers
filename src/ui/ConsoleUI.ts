import { GameUI } from './GameUI';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { GameObserver } from '../core/GameObserver';
import * as readline from 'readline';

/**
 * Console-based UI for the checkers game.
 */
export class ConsoleUI implements GameUI, GameObserver {
  private rl: readline.Interface;
  private moveResolver: ((move: Move) => void) | null = null;
  private highlightedPositions: Set<string> = new Set();

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Renders the board to console.
   */
  render(board: Board): void {
    console.clear();
    console.log(this.formatBoard(board));
    console.log();
  }

  /**
   * Gets a move from the user via console input.
   */
  async getMove(): Promise<Move> {
    return new Promise((resolve) => {
      this.moveResolver = resolve;
      this.promptForMove();
    });
  }

  /**
   * Shows a message to the user.
   */
  showMessage(message: string): void {
    console.log(`📢 ${message}`);
  }

  /**
   * Shows an error message.
   */
  showError(error: string): void {
    console.log(`❌ Error: ${error}`);
  }

  /**
   * Handles game end.
   */
  onGameEnd(winner: Player | null): void {
    if (winner) {
      console.log(`🎉 Game Over! ${winner} wins!`);
    } else {
      console.log('🤝 Game Over! It\'s a draw!');
    }
  }

  /**
   * Highlights possible moves.
   */
  highlightMoves(moves: Move[]): void {
    this.highlightedPositions.clear();
    moves.forEach(move => {
      this.highlightedPositions.add(move.to.toString());
    });
  }

  /**
   * Clears all highlights.
   */
  clearHighlights(): void {
    this.highlightedPositions.clear();
  }

  /**
   * Updates current player display.
   */
  updateCurrentPlayer(player: Player): void {
    console.log(`\n🎮 Current Player: ${player}`);
  }

  /**
   * Shows move history.
   */
  showMoveHistory(moves: Move[]): void {
    console.log('\n📜 Move History:');
    if (moves.length === 0) {
      console.log('  No moves yet');
      return;
    }

    moves.forEach((move, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      const playerColor = index % 2 === 0 ? 'RED' : 'BLACK';
      console.log(`  ${moveNumber}. ${playerColor}: ${move.toString()}`);
    });
  }

  /**
   * Highlights a specific position.
   */
  highlightPosition(position: Position): void {
    this.highlightedPositions.add(position.toString());
  }

  /**
   * Initializes the UI.
   */
  async initialize(): Promise<void> {
    console.log('🎯 Welcome to Extensible Checkers!');
    console.log('Commands:');
    console.log('  move <from> <to> - Make a move (e.g., "move a3 b4")');
    console.log('  moves <position> - Show possible moves from position');
    console.log('  history - Show move history');
    console.log('  quit - Exit game');
    console.log();
  }

  /**
   * Cleans up the UI.
   */
  destroy(): void {
    this.rl.close();
  }

  // GameObserver implementation
  onMove(move: Move, board: Board): void {
    console.log(`✅ Move made: ${move.toString()}`);
    this.render(board);
  }

  onTurnChange(player: Player): void {
    this.updateCurrentPlayer(player);
  }

  onInvalidMove(move: Move, reason: string): void {
    this.showError(`Invalid move ${move.toString()}: ${reason}`);
  }

  onPiecePromoted?(position: Position): void {
    console.log(`👑 Piece promoted at ${position.toString()}!`);
  }

  onBoardUpdate?(board: Board): void {
    this.render(board);
  }

  /**
   * Formats the board for console display.
   */
  private formatBoard(board: Board): string {
    const lines: string[] = [];
    
    // Top border with column labels
    lines.push('   ' + Array.from({ length: board.size }, (_, i) => 
      String.fromCharCode(97 + i)
    ).join(' '));
    
    lines.push('  ┌' + '─'.repeat(board.size * 2 - 1) + '┐');

    // Board rows
    for (let row = 0; row < board.size; row++) {
      const rank = (board.size - row).toString();
      let rowStr = `${rank} │`;
      
      for (let col = 0; col < board.size; col++) {
        const pos = new Position(row, col);
        const piece = board.getPiece(pos);
        const isHighlighted = this.highlightedPositions.has(pos.toString());
        
        let symbol = '.';
        if (piece) {
          symbol = piece.getSymbol();
        } else if (pos.isDarkSquare()) {
          symbol = isHighlighted ? '●' : '▪';
        } else {
          symbol = isHighlighted ? '○' : '▫';
        }
        
        // Add color if piece exists
        if (piece) {
          symbol = isHighlighted ? `[${symbol}]` : ` ${symbol} `;
        } else {
          symbol = isHighlighted ? `[${symbol}]` : ` ${symbol} `;
        }
        
        rowStr += symbol.length === 3 ? symbol : ` ${symbol}`;
        if (col < board.size - 1) rowStr += '';
      }
      
      rowStr += `│ ${rank}`;
      lines.push(rowStr);
    }

    // Bottom border with column labels
    lines.push('  └' + '─'.repeat(board.size * 2 - 1) + '┘');
    lines.push('   ' + Array.from({ length: board.size }, (_, i) => 
      String.fromCharCode(97 + i)
    ).join(' '));

    return lines.join('\n');
  }

  /**
   * Prompts user for move input.
   */
  private promptForMove(): void {
    this.rl.question('\n🎯 Enter command: ', (input) => {
      this.handleInput(input.trim());
    });
  }

  /**
   * Handles user input.
   */
  private handleInput(input: string): void {
    const parts = input.toLowerCase().split(' ');
    const command = parts[0];

    try {
      switch (command) {
      case 'move':
      case 'm':
        this.handleMoveCommand(parts);
        break;
      case 'moves':
        this.handleMovesCommand(parts);
        break;
      case 'history':
      case 'h':
        this.handleHistoryCommand();
        break;
      case 'quit':
      case 'q':
        this.handleQuitCommand();
        break;
      case 'help':
        this.handleHelpCommand();
        break;
      default:
        this.showError('Unknown command. Type "help" for available commands.');
        this.promptForMove();
      }
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Unknown error');
      this.promptForMove();
    }
  }

  /**
   * Handles move command.
   */
  private handleMoveCommand(parts: string[]): void {
    if (parts.length !== 3) {
      this.showError('Usage: move <from> <to> (e.g., "move a3 b4")');
      this.promptForMove();
      return;
    }

    try {
      const from = Position.fromString(parts[1]!);
      const to = Position.fromString(parts[2]!);
      const move = new Move(from, to);
      
      if (this.moveResolver) {
        this.moveResolver(move);
        this.moveResolver = null;
      }
    } catch (error) {
      this.showError(`Invalid position format: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.promptForMove();
    }
  }

  /**
   * Handles moves command to show possible moves.
   */
  private handleMovesCommand(parts: string[]): void {
    if (parts.length !== 2) {
      this.showError('Usage: moves <position> (e.g., "moves a3")');
      this.promptForMove();
      return;
    }

    try {
      const position = Position.fromString(parts[1]!);
      console.log(`\n📍 Showing possible moves from ${position.toString()}`);
      // This would need game reference to show actual moves
      console.log('(Feature requires game integration)');
    } catch (error) {
      this.showError(`Invalid position: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    this.promptForMove();
  }

  /**
   * Handles history command.
   */
  private handleHistoryCommand(): void {
    console.log('\n📜 Move history feature requires game integration');
    this.promptForMove();
  }

  /**
   * Handles quit command.
   */
  private handleQuitCommand(): void {
    console.log('\n👋 Thanks for playing!');
    this.destroy();
    process.exit(0);
  }

  /**
   * Handles help command.
   */
  private handleHelpCommand(): void {
    console.log('\n📖 Available Commands:');
    console.log('  move <from> <to> - Make a move (e.g., "move a3 b4")');
    console.log('  moves <position> - Show possible moves from position');
    console.log('  history - Show move history');
    console.log('  help - Show this help message');
    console.log('  quit - Exit game');
    console.log('\n📝 Position format: column + row (e.g., a1, h8)');
    console.log('🎯 Pieces: r/R = red regular/king, b/B = black regular/king');
    this.promptForMove();
  }
}