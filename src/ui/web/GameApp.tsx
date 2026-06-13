import React, { useState } from 'react';
import { GameConfigProvider, useGameConfig } from './contexts/GameConfigContext';
import { useConfigurableGame } from './hooks/useConfigurableGame';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { GameControls } from './components/GameControls';
import { GameConfig } from './components/GameConfig';
import { HelpPanel } from './components/HelpPanel';
import { Confetti } from './components/Confetti';
import { THEME_COLORS, ANIMATION_DURATIONS, RuleSet, BoardSize } from './types/GameConfig';

function GameAppContent(): React.JSX.Element {
  const { config, updateConfig } = useGameConfig();
  const { gameState, actions, canUndo, canRedo, isThinking, mustCapture, mandatorySources, hintMove } =
    useConfigurableGame();
  const [showConfig, setShowConfig] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleNewGame = (boardSize?: BoardSize, ruleSet?: RuleSet): void => {
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
    root.style.setProperty('--glide-dur', `${ANIMATION_DURATIONS[config.animationSpeed]}ms`);
  }, [config.theme, config.animationSpeed]);

  const celebrate = gameState.isGameOver && gameState.winner !== null;

  return (
    <div className={appClass}>
      {celebrate && <Confetti key={gameState.moveHistory.length} />}
      <main className="game-container" role="main">
        <button
          className="settings-btn"
          data-testid="settings-button"
          onClick={() => setShowConfig(true)}
          aria-label="Game Settings"
        >
          ⚙️
        </button>

        <button
          className="help-btn"
          data-testid="help-button"
          onClick={() => setShowHelp(true)}
          aria-label="How to Play"
        >
          ❓
        </button>

        <button
          className="sound-btn"
          data-testid="sound-button"
          onClick={() => updateConfig({ sound: !config.sound })}
          aria-label={config.sound ? 'Mute sound' : 'Unmute sound'}
          aria-pressed={config.sound}
        >
          {config.sound ? '🔊' : '🔇'}
        </button>

        <h1>Checkers</h1>
        
        <GameStatus
          currentPlayer={gameState.currentPlayer}
          gameOver={gameState.isGameOver}
          winner={gameState.winner}
          moveCount={gameState.moveHistory.length}
        />

        {isThinking && (
          <div className="thinking-indicator" data-testid="thinking-indicator" role="status">
            🤔 Computer is thinking…
          </div>
        )}

        {mustCapture && !gameState.isGameOver && !isThinking && (
          <div className="capture-alert" data-testid="capture-alert" role="status">
            ⚡ You must jump!
          </div>
        )}

        <GameBoard
          board={gameState.board}
          selectedPosition={gameState.selectedPosition}
          validMoves={gameState.validMoves}
          animationState={gameState.animationState}
          onSquareClick={actions.selectPosition}
          onDragMove={actions.dragMove}
          currentPlayer={gameState.currentPlayer}
          locked={isThinking}
          showMoveHints={config.showMoveHints}
          mandatorySources={mandatorySources}
          hintMove={hintMove}
        />
        
        {gameState.errorMessage && (
          <div className="error-message" data-testid="error-message">
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

        <div className="extra-controls">
          <button
            className="btn btn-hint"
            data-testid="hint-button"
            onClick={actions.showHint}
            disabled={gameState.isGameOver || isThinking}
          >
            💡 Hint
          </button>
        </div>

        {showConfig && (
          <GameConfig
            onClose={() => setShowConfig(false)}
            onNewGame={handleNewGame}
          />
        )}

        {showHelp && (
          <HelpPanel ruleSet={config.ruleSet} onClose={() => setShowHelp(false)} />
        )}
      </main>
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