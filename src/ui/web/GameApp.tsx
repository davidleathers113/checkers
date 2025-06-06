import React, { useState } from 'react';
import { GameConfigProvider, useGameConfig } from './contexts/GameConfigContext';
import { useConfigurableGame } from './hooks/useConfigurableGame';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { GameControls } from './components/GameControls';
import { GameConfig } from './components/GameConfig';
import { THEME_COLORS } from './types/GameConfig';

function GameAppContent(): React.JSX.Element {
  const { config } = useGameConfig();
  const { gameState, actions, canUndo, canRedo } = useConfigurableGame();
  const [showConfig, setShowConfig] = useState(false);

  const handleNewGame = (boardSize?: 8 | 10, ruleSet?: 'standard' | 'international' | 'crazy'): void => {
    actions.newGame(boardSize, ruleSet);
    setShowConfig(false);
  };

  const themeClass = `theme-${config.theme}`;
  const appClass = `app-container ${themeClass}`;

  // Apply theme-specific CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    const themeColors = THEME_COLORS[config.theme];
    
    root.style.setProperty('--light-square', themeColors.lightSquare);
    root.style.setProperty('--dark-square', themeColors.darkSquare);
    root.style.setProperty('--red-piece-start', themeColors.redPiece.start);
    root.style.setProperty('--red-piece-mid', themeColors.redPiece.mid);
    root.style.setProperty('--red-piece-end', themeColors.redPiece.end);
    root.style.setProperty('--black-piece-start', themeColors.blackPiece.start);
    root.style.setProperty('--black-piece-mid', themeColors.blackPiece.mid);
    root.style.setProperty('--black-piece-end', themeColors.blackPiece.end);
  }, [config.theme]);

  return (
    <div className={appClass}>
      <div className="game-container">
        <button 
          className="settings-btn" 
          onClick={() => setShowConfig(true)}
          aria-label="Game Settings"
        >
          ⚙️
        </button>

        <h1>Extensible Checkers</h1>
        
        <GameStatus 
          currentPlayer={gameState.currentPlayer}
          gameOver={gameState.isGameOver}
          winner={gameState.winner}
          moveCount={gameState.moveHistory.length}
        />
        
        <GameBoard
          board={gameState.board}
          selectedPosition={gameState.selectedPosition}
          validMoves={gameState.validMoves}
          animationState={gameState.animationState}
          onSquareClick={actions.selectPosition}
          showMoveHints={config.showMoveHints}
        />
        
        {gameState.errorMessage && (
          <div className="error-message">
            {gameState.errorMessage}
          </div>
        )}
        
        <GameControls
          onNewGame={() => actions.newGame()}
          onUndo={actions.undoMove}
          onRedo={actions.redoMove}
          canUndo={canUndo}
          canRedo={canRedo}
          gameOver={gameState.isGameOver}
        />

        {showConfig && (
          <GameConfig 
            onClose={() => setShowConfig(false)}
            onNewGame={handleNewGame}
          />
        )}
      </div>
    </div>
  );
}

export function GameApp(): React.JSX.Element {
  return (
    <GameConfigProvider>
      <GameAppContent />
    </GameConfigProvider>
  );
}