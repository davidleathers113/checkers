import { Game } from './core/Game';
import { ConsoleUI } from './ui/ConsoleUI';
import { StandardRules } from './rules/StandardRules';
import { Player } from './types';

/**
 * Main entry point for the checkers game.
 * Demonstrates how to set up and run a game with the console UI.
 */
async function main(): Promise<void> {
  // Create UI and game
  const ui = new ConsoleUI();
  const game = new Game({
    ruleEngine: new StandardRules(),
    startingPlayer: Player.RED
  });

  // Connect UI as observer
  game.addObserver(ui);

  try {
    // Initialize UI
    await ui.initialize();

    // Render initial board
    ui.render(game.getBoard());
    ui.updateCurrentPlayer(game.getCurrentPlayer());

    // Debug: Check why game is over immediately
    console.log('Red pieces:', game.getBoard().getPieceCount(Player.RED));
    console.log('Black pieces:', game.getBoard().getPieceCount(Player.BLACK));
    console.log('Red moves:', game.getAllPossibleMoves().length);
    console.log('Game over?', game.isGameOver());
    
    // Game loop
    while (!game.isGameOver()) {
      try {
        const move = await ui.getMove();
        game.makeMove(move);
      } catch (error) {
        ui.showError(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Game ended
    ui.onGameEnd(game.getWinner());
    
  } catch (error) {
    ui.showError(`Game error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    ui.destroy();
  }
}

// Export main components for library usage
export * from './core';
export * from './pieces';
export * from './rules';
export * from './strategies';
export * from './ui';
export * from './commands';
export * from './types';
export * from './errors';

// Run the game if this file is executed directly
// Note: This check works in CommonJS but not in ES modules
// For ES modules, you would use import.meta.url === new URL(process.argv[1]!, 'file:').href
if (process.argv[1]?.endsWith('index.ts') || process.argv[1]?.endsWith('index.js')) {
  main().catch(console.error);
}