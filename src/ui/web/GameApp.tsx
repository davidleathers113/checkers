import React from 'react';
import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { GameControls } from './components/GameControls';

export function GameApp() {
  const { gameState, actions, canUndo, canRedo } = useGame();

  return (
    <div className="game-container">
      <h1>Extensible Checkers</h1>
      
      <GameStatus 
        currentPlayer={gameState.currentPlayer}
        gameOver={gameState.gameOver}
        winner={gameState.winner}
        moveCount={gameState.moveCount}
      />
      
      <GameBoard
        board={gameState.board}
        selectedPosition={gameState.selectedPosition}
        validMoves={gameState.validMoves}
        onSquareClick={actions.selectPosition}
      />
      
      {gameState.errorMessage && (
        <div className="error-message">
          {gameState.errorMessage}
        </div>
      )}
      
      <GameControls
        onNewGame={actions.newGame}
        onUndo={actions.undoMove}
        onRedo={actions.redoMove}
        canUndo={canUndo}
        canRedo={canRedo}
        gameOver={gameState.gameOver}
      />
    </div>
  );
}