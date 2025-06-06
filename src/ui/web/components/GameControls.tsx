import React from 'react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  gameOver: boolean;
}

export function GameControls({
  onNewGame,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  gameOver
}: GameControlsProps): React.JSX.Element {
  return (
    <div className="game-controls">
      <button 
        className="btn btn-primary" 
        onClick={onNewGame}
      >
        New Game
      </button>
      
      <button 
        className="btn btn-secondary" 
        onClick={onUndo}
        disabled={!canUndo || gameOver}
      >
        Undo
      </button>
      
      <button 
        className="btn btn-secondary" 
        onClick={onRedo}
        disabled={!canRedo || gameOver}
      >
        Redo
      </button>
    </div>
  );
}