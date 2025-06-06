import React from 'react';
import { Player } from '../../../types';

interface GameStatusProps {
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  moveCount: number;
}

export function GameStatus({ 
  currentPlayer, 
  gameOver, 
  winner, 
  moveCount 
}: GameStatusProps) {
  const playerName = (player: Player) => player === Player.RED ? 'Red' : 'Black';
  
  return (
    <div className="game-status">
      {gameOver ? (
        <div className="game-over">
          {winner ? (
            `Game Over - ${playerName(winner)} Wins!`
          ) : (
            'Game Over - Draw!'
          )}
        </div>
      ) : (
        <div className="current-player">
          Current Player: {playerName(currentPlayer)}
        </div>
      )}
      <div>Move Count: {moveCount}</div>
    </div>
  );
}