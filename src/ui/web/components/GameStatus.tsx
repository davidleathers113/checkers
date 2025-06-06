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
}: GameStatusProps): React.JSX.Element {
  const playerName = (player: Player): string => player === Player.RED ? 'Red' : 'Black';
  const playerColorClass = currentPlayer === Player.RED ? 'red' : 'black';
  
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
        <>
          <div className={`current-player ${playerColorClass}`}>
            Current Turn: {playerName(currentPlayer)}
          </div>
          <div className="move-count">Move {moveCount + 1}</div>
        </>
      )}
    </div>
  );
}